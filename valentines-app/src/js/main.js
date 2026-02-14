// src/js/main.js

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'friend';
    const messageElement = document.getElementById('message');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const secondScreen = document.getElementById('second-screen');

    messageElement.textContent = `${name} will you be my valentines?`;

    yesButton.addEventListener('click', function() {
        document.body.style.display = 'none';
        secondScreen.style.display = 'block';
    });

    noButton.addEventListener('mouseover', function() {
        const randomX = Math.random() * (window.innerWidth - noButton.offsetWidth);
        const randomY = Math.random() * (window.innerHeight - noButton.offsetHeight);
        noButton.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
});