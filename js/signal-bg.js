/* Interactive background for the cover page: a sparse node-and-trace network
   (like a circuit board / constellation) that lights up near the cursor. */
function initSignalBackground() {
  const canvas = document.getElementById('signalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let nodes = [];
  let edges = [];
  const mouse = { x: -9999, y: -9999 };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function colors() {
    const cs = getComputedStyle(document.documentElement);
    return {
      rule: cs.getPropertyValue('--rule').trim() || '#ddd2c0',
      ink: cs.getPropertyValue('--ink-soft').trim() || '#6b6259',
      rose: cs.getPropertyValue('--rose-deep').trim() || '#9c3f57'
    };
  }

  function build(w, h) {
    const count = Math.max(24, Math.min(60, Math.floor((w * h) / 28000)));
    nodes = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h }));
    edges = [];
    nodes.forEach((n, i) => {
      const nearest = nodes
        .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      nearest.forEach((o) => {
        const key = [i, o.j].sort((a, b) => a - b).join('-');
        if (!edges.some((e) => e.key === key)) edges.push({ key, a: n, b: nodes[o.j] });
      });
    });
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build(w, h);
  }

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const c = colors();
    ctx.clearRect(0, 0, w, h);

    edges.forEach((e) => {
      const midX = (e.a.x + e.b.x) / 2;
      const midY = (e.a.y + e.b.y) / 2;
      const t = Math.max(0, 1 - Math.hypot(midX - mouse.x, midY - mouse.y) / 220);
      ctx.strokeStyle = t > 0.02 ? c.rose : c.rule;
      ctx.globalAlpha = t > 0.02 ? 0.25 + t * 0.5 : 0.35;
      ctx.lineWidth = t > 0.3 ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(e.a.x, e.a.y);
      ctx.lineTo(e.b.x, e.b.y);
      ctx.stroke();
    });

    nodes.forEach((n) => {
      const t = Math.max(0, 1 - Math.hypot(n.x - mouse.x, n.y - mouse.y) / 220);
      ctx.fillStyle = t > 0.15 ? c.rose : c.ink;
      ctx.globalAlpha = t > 0.15 ? 0.7 + t * 0.3 : 0.4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6 + t * 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  if (reduceMotion) {
    resize();
    draw();
    window.addEventListener('resize', () => { resize(); draw(); });
    return;
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  loop();
}

window.addEventListener('DOMContentLoaded', initSignalBackground);
