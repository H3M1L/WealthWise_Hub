document.addEventListener("mousemove", handleTilt);
document.addEventListener("mouseout", resetTilt);

function handleTilt(e) {
  const cards = document.querySelectorAll(".glass-card");
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    card.style.setProperty("--light-pos-x", `${x}px`);
    card.style.setProperty("--light-pos-y", `${y}px`);
    card.style.setProperty("--light-opacity", "1");
    card.style.transition = "transform 0.1s ease-out";
  });
}

function resetTilt() {
  const cards = document.querySelectorAll(".glass-card");
  cards.forEach(card => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    card.style.setProperty("--light-opacity", "0");
    card.style.transition = "transform 0.3s ease-out";
  });
}
