// Hero ocean: rolling contour lines drawn with three.js, in the same cream line style as the label art.
// Sits behind the hero content, pauses when off screen, and holds still for reduced motion.
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const hero = document.querySelector('.hero');
const canvas = document.createElement('canvas');
canvas.className = 'sea';
canvas.setAttribute('aria-hidden', 'true');
hero.prepend(canvas);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);

const ROWS = 36, COLS = 180, WIDTH = 64, DEPTH = 40, NEAR = 7;
const rows = [];
for (let r = 0; r < ROWS; r++) {
  const k = r / (ROWS - 1);                       // 0 at the shore, 1 at the horizon
  const z = NEAR - Math.pow(k, 1.35) * DEPTH;     // rows bunch up toward the viewer
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COLS * 3), 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xF6EBD9, transparent: true, opacity: 0.02 + 0.5 * Math.pow(1 - k, 2.4) });
  const line = new THREE.Line(geo, mat);
  line.frustumCulled = false;
  scene.add(line);
  rows.push({ geo, z, k });
}

function shape(t) {
  for (const { geo, z, k } of rows) {
    const p = geo.attributes.position.array;
    const amp = 0.55 - 0.3 * k;
    for (let c = 0; c < COLS; c++) {
      const x = (c / (COLS - 1) - 0.5) * WIDTH;
      const y = Math.sin(x * 0.34 + z * 0.5 + t * 0.7) * 0.5
              + Math.sin(x * 0.11 - z * 0.23 + t * 0.4) * 0.8
              + Math.sin(x * 0.9 + z * 1.3 - t * 1.1) * 0.12;
      p[c * 3] = x; p[c * 3 + 1] = y * amp; p[c * 3 + 2] = z;
    }
    geo.attributes.position.needsUpdate = true;
  }
}

let drift = 0, target = 0;
function frame(ms) {
  const t = ms / 1000;
  shape(t);
  drift += (target - drift) * 0.04;
  camera.position.set(drift * 1.6, 3.1, 12);
  camera.lookAt(drift * 0.4, 3.7, -10);
  renderer.render(scene, camera);
}

function resize() {
  const w = hero.clientWidth, h = hero.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (!running) frame(still);
}

const still = 4200;
let running = false, raf = 0;
const loop = ms => { frame(ms); raf = requestAnimationFrame(loop); };
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
new IntersectionObserver(([e]) => {
  const on = e.isIntersecting && !calm;
  if (on && !running) { running = true; raf = requestAnimationFrame(loop); }
  if (!on && running) { running = false; cancelAnimationFrame(raf); }
}).observe(hero);
addEventListener('pointermove', e => { target = e.clientX / innerWidth - 0.5; }, { passive: true });
new ResizeObserver(resize).observe(hero);
resize();
