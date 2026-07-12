/* Shared cursor-trail effect: small glowing dots in the brand palette.
   Usage: initSparkles({ colors: [...], every: 40 }) */
function initSparkles(options = {}) {
  const colors = options.colors || ['#b8536a', '#9c3f57', '#ad7f2e'];
  const every = options.every || 45; // ms between spawns while moving
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let last = 0;

  function spawn(x, y) {
    const el = document.createElement('span');
    el.className = 'sparkle';
    const size = 5 + Math.random() * 7;
    const color = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.borderRadius = '50%';
    el.style.background = color;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);

    const dx = (Math.random() - 0.5) * 32;
    const dy = -24 - Math.random() * 32;

    el.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.85 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.25)`, opacity: 0 }
      ],
      { duration: 650 + Math.random() * 300, easing: 'ease-out' }
    ).onfinish = () => el.remove();
  }

  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < every) return;
    last = now;
    spawn(e.clientX, e.clientY);
  });

  // small burst helper for buttons etc.
  window.sparkleBurst = function (x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawn(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20), i * 20);
    }
  };
}

/* Full-screen confetti rain, used by the Konami easter egg. Works even if
   initSparkles() was never called (e.g. reduced-motion skipped it). */
window.confettiBurst = function (count = 90) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#b8536a', '#9c3f57', '#ad7f2e', '#1c1815'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'confetti-piece';
      const size = 6 + Math.random() * 8;
      el.style.width = size + 'px';
      el.style.height = size * (0.6 + Math.random() * 0.8) + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = Math.random() * window.innerWidth + 'px';
      document.body.appendChild(el);

      const fall = window.innerHeight + 40;
      const drift = (Math.random() - 0.5) * 200;
      const rot = 360 + Math.random() * 360;

      el.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${drift}px, ${fall}px) rotate(${rot}deg)`, opacity: 0.9 }
        ],
        { duration: 2200 + Math.random() * 900, easing: 'cubic-bezier(.25,.46,.45,.94)' }
      ).onfinish = () => el.remove();
    }, i * 12);
  }
};
