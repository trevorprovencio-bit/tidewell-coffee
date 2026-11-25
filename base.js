// Shared content and behaviour for every Tidewell page: ticker, nav, footer, bag, product and location data.
const COFFEES = [
  { id: 'signature', name: 'Signature Blend', badge: 'House blend', origin: 'Costa Rica', roast: 'House blend, medium roast', notes: 'Dark caramel and rich chocolate', tint: '#1B1815', price: '22.00' },
  { id: 'dreamy', name: 'Dreamy Dayz', badge: 'Medium roast', origin: 'Honduras', roast: 'Medium roast', notes: 'Chocolate, rustic fruit and berry', tint: '#7E8457', price: '22.00' },
  { id: 'costasur', name: 'Costa Sur', badge: 'Single origin', origin: 'Mexico', roast: 'Single origin, full bodied', notes: 'Dark berries, chocolate syrup, malt and brown sugar', tint: '#34506E', price: '22.00' },
  { id: 'decaf', name: 'Decaf', badge: 'Decaf', origin: 'Mexico Chiapas', roast: 'Medium roast', notes: 'Milk chocolate, caramel and toasted nut', tint: '#9CC4B4', price: '22.00' },
];
const MENU = {
  Coffees: [['Espresso', '4.50'], ['Cappuccino', '5.00'], ['Americano', '5.00'], ['Cold brew', '5.50'], ['Flat white', '5.00'], ['Latte', '6.00'], ['Cortado', '5.00']],
  'Specialty lattes': [['Honey cinnamon latte', '6.25'], ['Vanilla cardamom latte', '6.25'], ['Sea salt maple latte', '6.25'], ['Blue agave cinnamon latte', '6.50'], ['Lavender latte', '6.25'], ['Mocha', '6.25'], ['Caramel latte', '6.25']],
  'Matcha and refreshers': [['Matcha latte', '8.00'], ['Lavender matcha', '8.25'], ['Maple cinnamon matcha', '8.25'], ['Coastal lemonade', '5.50'], ['Lavender bloom lemonade', '5.50'], ['Chai latte', '6.50'], ['London fog', '6.25']],
};
// Addresses and Oceanside hours come from the two Instagram profiles.
// PLACEHOLDER: San Marcos hours are not published anywhere yet.
const LOCATIONS = [
  { id: 'san-marcos', page: 'san-marcos.html', name: 'San Marcos', place: 'At The Sanctuary by The Lost Abbey', addr: ['1215 San Elijo Rd S', 'San Marcos, CA'],
    blurb: 'The original Tidewell cart, parked in San Elijo Hills. Espresso, specialty lattes, matcha and pastries, made to order.',
    hours: [['Every day', 'Hours to be added']], img: 'assets/photos/cart-front.jpg', alt: 'The Tidewell coffee cart with its lettered front panel and a red espresso machine on the counter',
    map: 'https://www.google.com/maps/search/?api=1&query=1215+San+Elijo+Rd+S+San+Marcos+CA' },
  { id: 'oceanside', page: 'oceanside.html', name: 'Oceanside', place: 'Inside Bodega Market', addr: ['3529 Cannon Rd, Suite 2D', 'Oceanside, CA'],
    blurb: 'Our second home. Tidewell coffee on the bar at Bodega Market, next to cold pressed juice, focaccia sandwiches and a full market.',
    hours: [['Monday to Saturday', '8am to 3pm'], ['Sunday', 'Closed']], img: 'assets/photos/bags-shelf.jpg', alt: 'Bags of Tidewell coffee on the counter at Bodega Market under the hand lettered hot coffee sign',
    map: 'https://www.google.com/maps/search/?api=1&query=Bodega+Market+3529+Cannon+Rd+Oceanside+CA' },
];
const TICKER = ['Small batch coffee roasted in San Diego, CA', 'Good coffee. Good people. Brighter days.', 'Now pouring in San Marcos and Oceanside', '100% arabica in every 12 oz bag', 'Whole bean or ground, your call'];
// Off the homepage, section links point back at it
const PAGE = location.pathname.split('/').pop();
const HOME = PAGE === '' || PAGE === 'index.html' ? '' : 'index.html';
const LINKS = [['Shop coffee', HOME + '#shop'], ['Cafe menu', 'menu.html'], ['Catering', 'catering.html'], ['Visit', 'visit.html'], ['Our story', HOME + '#story'], ['Contact', 'visit.html#contact']];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '$' + n.toFixed(2);

// Ticker, nav, bag drawer and footer are identical on every page, so they are injected.
const SUN = `<svg class="burst" viewBox="-12 -12 24 24" fill="currentColor"><circle r="3"/>${Array.from({ length: 12 }, (_, i) => `<ellipse cy="-8" rx="1.4" ry="3.4" transform="rotate(${i * 30})"/>`).join('')}</svg>`;
// Visit drop down: a photo card per location, each with its own page and a directions link
const IN_VISIT = PAGE === 'visit.html' || LOCATIONS.some(l => l.page === PAGE);
const VISIT_DROP = `<div class="has-drop"><a class="drop-trigger" href="visit.html" aria-haspopup="true" aria-expanded="false"${IN_VISIT ? ' aria-current="page"' : ''}>Visit<i class="ph ph-caret-down"></i></a>
  <div class="drop"><div class="drop-in">${LOCATIONS.map(l => `
    <div class="drop-card"><img src="${l.img}" alt="" loading="lazy">
      <div class="drop-copy"><h3>${l.name}</h3><p>${l.place}</p>
        <p class="drop-acts"><a class="btn" href="${l.page}">Read more</a><a class="btn" href="${l.map}" target="_blank" rel="noopener">Directions</a></p></div>
    </div>`).join('')}</div></div></div>`;
const tick = TICKER.map(t => `<span>${t}</span><span aria-hidden="true">${SUN}</span>`).join('');
document.body.insertAdjacentHTML('afterbegin', `
  <a class="skip" href="#main">Skip to content</a>
  <div class="ticker"><div class="ticker-track">${tick}${tick}</div></div>
  <header class="nav">
    <a href="${HOME || '#main'}" aria-label="Tidewell Coffee Co. home"><span class="art logo"></span></a>
    <nav class="nav-links" aria-label="Main">${LINKS.map(([t, h]) => t === 'Visit' ? VISIT_DROP : `<a href="${h}"${h === PAGE ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    <button class="btn sm bag-btn" aria-haspopup="dialog" aria-controls="bag">Bag<span class="bag-count" aria-hidden="true">0</span></button>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
  </header>
  <div class="menu-panel">${LINKS.map(([t, h], i) => `<a href="${h}" style="--i:${i}">${t}</a>${t === 'Visit' ? LOCATIONS.map(l => `<a class="sub" href="${l.page}" style="--i:${i}">${l.name}</a>`).join('') : ''}`).join('')}</div>
  <div class="bag-scrim"></div>
  <aside class="bag" id="bag" role="dialog" aria-modal="true" aria-label="Your bag" inert>
    <div class="bag-head"><h2>Your bag</h2><button class="bag-close" aria-label="Close bag"><i class="ph ph-x"></i></button></div>
    <div class="bag-body"></div>
    <div class="bag-foot">
      <p class="bag-total"><span>Subtotal</span><b></b></p>
      <button class="btn bag-checkout">Checkout<i class="ph ph-arrow-right"></i></button>
      <p class="bag-note" role="status">Shipping and tax are worked out at checkout.</p>
    </div>
  </aside>`);
document.body.insertAdjacentHTML('beforeend', `
  <footer><span class="art skater rider" aria-hidden="true"></span><div class="wrap">
    <span class="art logo" role="img" aria-label="Tidewell Coffee Co."></span>
    <div class="foot-grid">
      <div><h4>Shop</h4>${COFFEES.map(c => `<a href="product.html?c=${c.id}">${c.name}</a>`).join('')}</div>
      <div><h4>Cafe</h4><a href="menu.html">Menu</a><a href="catering.html">Catering</a><a href="${HOME}#story">Our story</a></div>
      <div><h4>Find us</h4>${LOCATIONS.map(l => `<a href="${l.page}">${l.name}</a>`).join('')}<a href="visit.html#contact">Contact</a><a href="https://www.instagram.com/tidewellcoffeeco/" target="_blank" rel="noopener">Instagram</a></div>
      <div><h4>Notes from the roaster</h4><p>New roasts and cafe news, sent now and then.</p>
        <form class="news" novalidate><input type="email" placeholder="Email address" aria-label="Email address" required><button class="btn sm">Sign me up</button></form>
        <p class="news-msg" role="status"></p></div>
    </div>
    <div class="legal"><span>© 2026 Tidewell Coffee Co. Small batch in San Diego, CA.</span><span><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms</a></span></div>
  </div></footer>`);

// Product grids, menu columns and location cards
$$('[data-coffees]').forEach(el => {
  const list = COFFEES.filter(c => c.id !== el.dataset.skip);
  el.innerHTML = list.map(c => el.dataset.coffees === 'rows' ? `
    <a class="row" href="product.html?c=${c.id}" style="--tint:${c.tint}">
      <div class="row-img"><img src="assets/label-${c.id}.jpg" alt="${c.name} bag label" loading="lazy"></div>
      <div class="row-copy"><h3>${c.name}</h3><p class="row-notes">${c.notes}.</p>
        <dl><div><dt>Origin</dt><dd>${c.origin}</dd></div><div><dt>Profile</dt><dd>${c.roast}</dd></div><div><dt>Bag</dt><dd>12 oz, $${c.price}</dd></div></dl>
        <span class="btn">Shop ${c.name}<i class="ph ph-arrow-right"></i></span></div>
    </a>` : `
    <a class="card reveal" href="product.html?c=${c.id}" style="--tint:${c.tint}">
      <div class="card-img"><span class="badge">${c.badge}</span><img src="assets/label-${c.id}.jpg" alt="${c.name} bag label" loading="lazy"></div>
      <h3>${c.name}</h3><p class="muted">${c.notes}</p>
      <p class="price">$${c.price}<span class="muted" style="font-weight:400;font-size:14px">${c.origin}, 12 oz</span></p>
    </a>`).join('');
});
$$('[data-menu]').forEach(el => {
  el.innerHTML = Object.entries(MENU).map(([h, items]) => `<div><h3>${h}</h3><ul>${items.map(([n, p]) => `<li>${n}<b>${p}</b></li>`).join('')}</ul></div>`).join('');
});
$$('[data-locations]').forEach(el => {
  const full = el.dataset.locations === 'full';
  el.innerHTML = LOCATIONS.filter(l => !el.dataset.only || l.id === el.dataset.only).map(l => `
    <article class="loc reveal" id="${l.id}">
      <img src="${l.img}" alt="${l.alt}" loading="lazy">
      <div class="loc-body">
        <h3>${l.name}</h3><p class="loc-place">${l.place}</p>
        ${full ? `<p>${l.blurb}</p>` : ''}
        <address>${l.addr.join('<br>')}</address>
        <dl>${l.hours.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join('')}</dl>
        <p class="loc-links"><a class="btn sm" href="${l.map}" target="_blank" rel="noopener">Get directions<i class="ph ph-arrow-up-right"></i></a><a class="link" href="${l.page}">What is at ${l.name}<i class="ph ph-arrow-right"></i></a></p>
      </div>
    </article>`).join('');
});

// Visit drop down: opens on hover or keyboard focus, closes on leaving the header or pressing Escape
const dropWrap = $('.has-drop'), dropTrig = $('.drop-trigger');
const setDrop = open => { $('.nav').classList.toggle('drop-open', open); dropTrig.setAttribute('aria-expanded', open); };
dropWrap.addEventListener('mouseenter', () => setDrop(true));
$('.nav').addEventListener('mouseleave', () => setDrop(false));
$$('.nav-links > a').forEach(a => a.addEventListener('mouseenter', () => setDrop(false)));
dropWrap.addEventListener('focusin', () => setDrop(true));
dropWrap.addEventListener('focusout', e => { if (!dropWrap.contains(e.relatedTarget)) setDrop(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && $('.nav').classList.contains('drop-open')) { setDrop(false); dropTrig.focus(); } });

// Nav toggle
const toggle = $('.nav-toggle');
const setNav = open => { document.body.classList.toggle('nav-open', open); toggle.setAttribute('aria-expanded', open); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
$$('.menu-panel a').forEach(a => a.addEventListener('click', () => setNav(false)));

// Bag: kept in memory and mirrored to localStorage so it survives a page change.
// Front end only. Checkout is handed to WooCommerce and Square when the shop goes live.
const BAG_KEY = 'tw-bag';
let bag = [];
try { bag = JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch (e) { bag = []; }
bag = bag.filter(i => COFFEES.some(c => c.id === i.id));
const bagEl = $('#bag'), bagBtn = $('.bag-btn');
function bagRender() {
  try { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); } catch (e) { /* private window: the bag still works for this page */ }
  const count = bag.reduce((n, i) => n + i.qty, 0);
  $('.bag-count').textContent = count;
  bagBtn.setAttribute('aria-label', `Open bag, ${count} ${count === 1 ? 'item' : 'items'}`);
  bagEl.classList.toggle('empty', !count);
  $('.bag-total b').textContent = money(bag.reduce((n, i) => n + i.qty * +COFFEES.find(c => c.id === i.id).price, 0));
  $('.bag-body').innerHTML = count ? `<ul>${bag.map((i, k) => { const c = COFFEES.find(c => c.id === i.id); return `
    <li><span class="bag-thumb" style="--tint:${c.tint}"><img src="assets/label-${c.id}.jpg" alt=""></span>
      <div><b>${c.name}</b><span class="muted">12 oz, ${i.grind.toLowerCase()}</span>
        <span class="qty"><button data-act="dec" data-k="${k}" aria-label="One fewer ${c.name}"><i class="ph ph-minus"></i></button><output>${i.qty}</output><button data-act="inc" data-k="${k}" aria-label="One more ${c.name}"><i class="ph ph-plus"></i></button></span></div>
      <div class="bag-side"><b>${money(i.qty * +c.price)}</b><button class="bag-rm" data-act="rm" data-k="${k}">Remove</button></div></li>`; }).join('')}</ul>`
    : `<div class="bag-empty"><span class="art sun" aria-hidden="true"></span><h3>Nothing in here yet</h3><p class="muted">Four coffees are waiting, all roasted in small batches.</p><a class="btn" href="${HOME}#shop">Shop the beans<i class="ph ph-arrow-right"></i></a></div>`;
}
const setBag = open => { document.body.classList.toggle('bag-open', open); bagEl.inert = !open; if (open) { setNav(false); $('.bag-close').focus(); } else bagBtn.focus(); };
function bagAdd(id, grind, qty) {
  const hit = bag.find(i => i.id === id && i.grind === grind);
  if (hit) hit.qty += qty; else bag.push({ id, grind, qty });
  bagRender(); setBag(true);
}
bagBtn.addEventListener('click', () => setBag(true));
$('.bag-close').addEventListener('click', () => setBag(false));
$('.bag-scrim').addEventListener('click', () => setBag(false));
addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('bag-open')) setBag(false); });
bagEl.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b) { const i = bag[+b.dataset.k]; if (b.dataset.act === 'inc') i.qty++; else if (b.dataset.act === 'dec' && i.qty > 1) i.qty--; else bag.splice(+b.dataset.k, 1); bagRender(); }
  if (e.target.closest('.bag-empty a')) setBag(false);
});
$('.bag-checkout').addEventListener('click', () => { $('.bag-note').textContent = 'Checkout is not switched on yet. Your bag is saved on this device for when it is.'; });
bagRender();

// Section reveals, once each
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
$$('.reveal').forEach(el => io.observe(el));

// Tagline lights up one word at a time as it crosses a trigger line
$$('.tagline p').forEach(p => { p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' '); });
const words = $$('.tagline .w');
let queued = false;
const paint = () => { queued = false; const line = innerHeight * 0.72; words.forEach(w => { if (w.getBoundingClientRect().top < line) w.classList.add('on'); }); };
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
paint();

// Lineup parallax: feed each row its distance from the viewport centre as --p
const pxRows = $$('.row');
if (pxRows.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let pxQueued = false;
  const pxPaint = () => {
    pxQueued = false;
    pxRows.forEach(r => {
      const b = r.getBoundingClientRect();
      if (b.bottom < -200 || b.top > innerHeight + 200) return;
      const p = (innerHeight / 2 - (b.top + b.height / 2)) / innerHeight;
      r.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
    });
  };
  addEventListener('scroll', () => { if (!pxQueued) { pxQueued = true; requestAnimationFrame(pxPaint); } }, { passive: true });
  addEventListener('resize', pxPaint);
  pxPaint();
}

// The footer skater only rides while the footer edge is on screen
new IntersectionObserver(([e]) => $('.rider').classList.toggle('go', e.isIntersecting), { rootMargin: '0px 0px -40px 0px' }).observe($('footer'));

// Newsletter validation (front end only, nothing is sent yet)
$('.news').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('.news input').value.trim();
  $('.news-msg').textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? `You are on the list, ${v}.` : 'That email looks off. Check the address and try again.';
});
