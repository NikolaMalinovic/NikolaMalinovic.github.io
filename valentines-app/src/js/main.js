// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.getElementById('name');
  const yes = document.getElementById('yes');
  const no = document.getElementById('no');
  const area = document.getElementById('area');
  const celebrate = document.getElementById('celebrate');
  const restart = document.getElementById('restart');
  const card = document.getElementById('card');

  // get name from URL params ?name=Teodora
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') ? decodeURIComponent(params.get('name')) : 'you';
  nameEl.textContent = name;

  // Show celebration view
  yes.addEventListener('click', () => {
    celebrate.classList.remove('hidden');
    celebrate.setAttribute('aria-hidden','false');
    card.style.filter = 'blur(2px)';
  });

  restart.addEventListener('click', () => {
    celebrate.classList.add('hidden');
    celebrate.setAttribute('aria-hidden','true');
    card.style.filter = 'none';
  });

  // Make "no" escape but stay inside area bounding box
  function moveAway(e){
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const btnRect = no.getBoundingClientRect();

    // mouse coordinates in viewport
    const mx = e.clientX;
    const my = e.clientY;

    // current center of the button in viewport coords
    const bx = btnRect.left + btnRect.width / 2;
    const by = btnRect.top + btnRect.height / 2;

    // vector from mouse -> button center
    let vx = bx - mx;
    let vy = by - my;
    const len = Math.hypot(vx, vy) || 1;

    // stronger flee: scale by distance and random factor
    const base = 260; // base flee distance
    const rand = 120 + Math.random() * 240;
    const dist = base + rand;
    vx = (vx / len) * dist;
    vy = (vy / len) * dist;

    // new center position
    let newCx = bx + vx;
    let newCy = by + vy;

    // convert to top-left
    let newLeft = newCx - btnRect.width / 2;
    let newTop = newCy - btnRect.height / 2;

  // clamp to viewport with small padding so it stays visible (won't disappear)
  const pad = 8;
  const maxLeft = vw - btnRect.width - pad;
  const maxTop = vh - btnRect.height - pad;
  newLeft = Math.max(pad, Math.min(maxLeft, newLeft));
  newTop = Math.max(pad, Math.min(maxTop, newTop));

    no.style.left = `${newLeft}px`;
    no.style.top = `${newTop}px`;
  }

  // Use mouseenter to jump, mousemove to follow if user persists
  no.addEventListener('mouseenter', moveAway);
  no.addEventListener('mousemove', (e) => {
    // small chance to not move so user occasionally can click (fun)
    if (Math.random() > 0.12) moveAway(e);
  });

  // Allow keyboard accessible fallback: pressing Tab on no will nudge it
  no.addEventListener('focus', (e) => {
    const fake = { clientX: area.getBoundingClientRect().left + area.offsetWidth / 2, clientY: area.getBoundingClientRect().top + area.offsetHeight / 2 };
    moveAway(fake);
  });

  // place the No button initially near the card center (viewport coords)
  function placeInitialNo(){
    const yesRect = yes.getBoundingClientRect();
    const btnRect = no.getBoundingClientRect();
    const spacing = 12;
    const spaceRight = window.innerWidth - yesRect.right;
    let left;
    if (spaceRight > btnRect.width + spacing) {
      // place to the right of Yes
      left = yesRect.right + spacing;
    } else {
      // place to the left of Yes
      left = yesRect.left - spacing - btnRect.width;
    }
    const top = yesRect.top + (yesRect.height - btnRect.height) / 2;
    // final clamp so button is fully visible inside viewport
    const pad = 8;
    const clampedLeft = Math.max(pad, Math.min(window.innerWidth - btnRect.width - pad, left));
    const clampedTop = Math.max(pad, Math.min(window.innerHeight - btnRect.height - pad, top));
    no.style.left = `${clampedLeft}px`;
    no.style.top = `${clampedTop}px`;
  }

  // run initial placement and re-place on resize
  placeInitialNo();
  window.addEventListener('resize', () => setTimeout(placeInitialNo, 120));
});
// ...existing code...