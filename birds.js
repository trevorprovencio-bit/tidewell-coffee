// Tiny gulls drifting across the page background, drawn like the birds in the van artwork:
// two curved wing strokes that flap. The canvas is fixed behind the content (z-index -1), so
// text, panels and art always sit on top and anything with its own fill simply hides them.
(() => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  // With a [data-birds] element on the page the flock lives inside it (the homepage hero);
  // otherwise it flies behind the whole page. The attribute's value, if any, is the bird colour.
  const host = document.querySelector('[data-birds]');
  canvas.style.cssText = host ? 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none' : 'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';
  (host || document.body).prepend(canvas);
  const ctx = canvas.getContext('2d');
  const ink = (host && host.dataset.birds) || '#8F8F8B';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1;

  const rand = (a, b) => a + Math.random() * (b - a);
  // A bird: position, size (also its depth: smaller birds are further, slower and fainter), flap phase
  const spawn = (x, y, s) => ({ x, y, s, v: 14 + s * 5.5, flap: rand(0, 6.28), rate: rand(5, 7.5), bob: rand(0, 6.28), drift: rand(-3, 3) });
  // Birds travel in loose groups of two to four, like a V that never quite forms
  const group = startX => {
    const n = 2 + Math.floor(Math.random() * 3), y = rand(0.08, host ? 0.5 : 0.8) * H, s = rand(7, 13);
    return Array.from({ length: n }, (_, i) => spawn(startX - i * rand(22, 46), y + (i % 2 ? 1 : -1) * i * rand(8, 18), s * rand(0.8, 1.15)));
  };
  let birds = [];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = host ? host.clientWidth : innerWidth; H = host ? host.clientHeight : innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!birds.length) birds = [...group(W * 0.12), ...group(W * 0.4), ...group(W * 0.68), ...group(W * 0.95)];
    if (!running) draw(0);
  }

  function draw(dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = ink; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const b of birds) {
      b.x += b.v * dt; b.flap += b.rate * dt; b.bob += dt;
      b.y += (Math.sin(b.bob * 0.6) * 4 + b.drift) * dt;
      const lift = Math.sin(b.flap) * 0.55 - 0.15;           // wing tips rise and fall
      const span = b.s * 1.5, tipY = -lift * b.s, dip = b.s * 0.35;
      ctx.globalAlpha = 0.4 + Math.min(0.45, b.s / 24);
      ctx.lineWidth = Math.max(1.25, b.s / 5.5);
      ctx.beginPath();
      ctx.moveTo(b.x - span, b.y + tipY);
      ctx.quadraticCurveTo(b.x - span * 0.45, b.y + tipY - dip, b.x, b.y);
      ctx.quadraticCurveTo(b.x + span * 0.45, b.y + tipY - dip, b.x + span, b.y + tipY);
      ctx.stroke();
    }
    // When the last bird of a group leaves the right edge, send a new group in from the left
    birds = birds.filter(b => b.x < W + 60);
    if (birds.length < 9 && Math.random() < 0.02) birds.push(...group(-40));
  }

  let running = false, last = 0;
  const loop = t => { const dt = Math.min(0.05, (t - last) / 1000); last = t; draw(dt); if (running) requestAnimationFrame(loop); };
  const start = () => { if (!running && !calm && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(loop); } };
  document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else start(); });
  addEventListener('resize', resize);
  resize();
  start();
})();
