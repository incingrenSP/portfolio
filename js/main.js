
const $ = (s) => document.querySelector(s);
const data = () => portfolioData;

const SECTIONS = ['about', 'projects', 'certifications', 'contact', 'cv'];
const NAMES = { about: 'About Me', projects: 'Projects', certifications: 'Certifications', contact: 'Contact Me', cv: 'CV' };
const PROFILE = 'assets/images/profile/profile.jpg';

let current = null;
let projIdx = 0;
let imgIdx = 0;
let projImgs = [];

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initNav();
    initPanelEvents();
    initCarouselEvents();
    initTopBar();
    initPower();
    initKeyboard();
    initParallax();
    resetWebsite();
});


// Fade the old content out, swap, then slide the new content in
let swapTimer;
function run(fn) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return fn();
    const els = [$('.content-panel'), ...document.querySelectorAll('.hub-content > div')];
    clearTimeout(swapTimer);
    els.forEach((e) => e.classList.add('out'));
    swapTimer = setTimeout(() => {
        try { fn(); }
        finally {
            els.forEach((e) => { e.classList.remove('out', 'in'); void e.offsetWidth; e.classList.add('in'); });
        }
    }, 180);
}

function greeting() {
    const h = new Date().getHours();
    return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function setPanel(title, html, tag) {
    $('#panelTitle').textContent = title;
    $('#panelTag').textContent = tag;
    $('#panelContent').innerHTML = html;
    $('#rightContent').scrollTop = 0;
}

function setHub(src, alt) {
    const img = $('#hubImg');
    if (src && img.getAttribute('src') !== src) { img.src = src; }
    if (alt) img.alt = alt;
    
    $('#centerImage').dataset.fit = (src === PROFILE) ? 'cover' : 'contain';
    $('#centerImage').classList.remove('hidden');
    $('#projectCarousel').classList.add('hidden');
}

function placeholder(text) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#222"/><text x="50%" y="50%" fill="#e8d44d" font-size="22" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function markSelected(i) {
    document.querySelectorAll('.catalog-item').forEach((el, k) => el.classList.toggle('selected', k === i));
}

/* ---------- clock ---------- */

function initClock() {
    const clock = $('#clock');
    const dateEl = $('#dateText');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const tick = () => {
        const n = new Date();
        const p = (v) => String(v).padStart(2, '0');
        clock.textContent = `${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
        dateEl.textContent = `${months[n.getMonth()]} ${p(n.getDate())}, ${n.getFullYear()}`;
    };
    tick();
    setInterval(tick, 1000);
}

/* ---------- navigation ---------- */

function initNav() {
    document.querySelectorAll('.nav-button').forEach((b) =>
        b.addEventListener('click', () => setSection(b.dataset.section))
    );
}

function setSection(section) {
    if (section === 'cv') return openCV();

    document.querySelectorAll('.nav-button').forEach((b) => b.classList.toggle('active', b.dataset.section === section));
    $('#statusText').textContent = NAMES[section] || 'Welcome';
    current = section;

    const views = { about: renderAbout, projects: renderProjects, certifications: renderCerts, contact: renderContact };
    run(() => views[section]());
}

const tagFor = (s) => `// ${String(SECTIONS.indexOf(s) + 1).padStart(2, '0')} — ${NAMES[s].toUpperCase()}`;

/* ---------- sections ---------- */

function renderAbout() {
    const a = data().about;
    setPanel(a.title, a.content, tagFor('about'));
    const img = Array.isArray(a.images) ? a.images[0] : a.images;
    setHub(img || PROFILE, 'About');
}

function renderProjects() {
    const list = data().projects;
    const html = list.map((p, i) => `
        <div class="catalog-item" style="--i:${i}" data-project="${i}">
            <div class="language">${p.language}</div>
            <h3>${p.name}</h3>
            <p class="description">${p.description}</p>
            <a class="github-link" href="${p.github}" target="_blank" rel="noopener">View on GitHub →</a>
        </div>`).join('');
    setPanel('Projects', `<div class="catalog-grid">${html}</div>`, tagFor('projects'));
    $('#centerImage').classList.add('hidden');
    $('#projectCarousel').classList.remove('hidden');
    selectProject(0);
}

function selectProject(i) {
    projIdx = i;
    imgIdx = 0;
    markSelected(i);
    renderCarousel();
}

// Builds the carousel once per project; image changes only swap the <img>
function renderCarousel() {
    const p = data().projects[projIdx];
    if (!p) return;
    projImgs = p.images && p.images.length ? p.images : [placeholder(p.name)];  // no data mutation
    const multi = projImgs.length > 1;
    const dots = projImgs.map((_, i) => `<span class="indicator-dot" data-i="${i}"></span>`).join('');

    $('.carousel-container').innerHTML = `
        <div class="carousel-item"><img alt="${p.name}"></div>
        <div class="project-language">${p.language}</div>
        <div class="project-description-box"><p>${p.description}</p></div>
        ${multi ? `<button class="carousel-arrow carousel-arrow-left" data-dir="-1" aria-label="Previous image">‹</button>
                   <button class="carousel-arrow carousel-arrow-right" data-dir="1" aria-label="Next image">›</button>
                   <div class="carousel-indicators">${dots}</div>` : ''}`;
    showImage(0);
}

function showImage(i) {
    imgIdx = (i + projImgs.length) % projImgs.length;
    const img = $('.carousel-item img');
    if (!img) return;
    const name = data().projects[projIdx].name;
    img.onerror = () => { img.onerror = null; img.src = placeholder(name); };
    img.style.animation = 'none';
    void img.offsetWidth;            // restart fade animation
    img.style.animation = '';
    img.src = projImgs[imgIdx];
    document.querySelectorAll('.indicator-dot').forEach((d, k) => d.classList.toggle('active', k === imgIdx));
}

function renderCerts() {
    const list = data().certifications;
    const html = list.map((c, i) => `
        <div class="catalog-item" style="--i:${i}" data-cert="${i}">
            <h3>${c.name}</h3>
            <p class="description">${c.description}</p>
        </div>`).join('');
    setPanel('Certifications', `<div class="catalog-grid">${html}</div>`, tagFor('certifications'));
    showCert(0);
}

function showCert(i) {
    const c = data().certifications[i];
    if (!c) return;
    markSelected(i);
    setHub(c.images && c.images[0], c.name);
}

function renderContact() {
    const items = [
        ['Email', 'Click to copy email to clipboard', 'data-action="copy"'],
        ['GitHub', 'Visit my GitHub profile', `data-link="${data().contact.github}"`],
        ['LinkedIn', 'Connect with me on LinkedIn', `data-link="${data().contact.linkedin}"`],
    ];
    const html = items.map(([h, d, attr], i) =>
        `<div class="catalog-item" style="--i:${i}" ${attr}><h3>${h}</h3><p class="description">${d}</p></div>`).join('');
    setPanel('Contact Me', `<div class="catalog-grid">${html}</div>`, tagFor('contact'));
    setHub(PROFILE, 'Contact');
}

function openCV() {
    // open immediately so popup blockers see the click, then play the exit effect
    window.open(data().cv.pdfUrl, '_blank', 'noopener');
    document.body.classList.add('zoom');
    setTimeout(() => { resetWebsite(); document.body.classList.remove('zoom'); }, 450);
}

/* ---------- events (delegated) ---------- */

function initPanelEvents() {
    $('#rightContent').addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const t = e.target.closest('[data-project],[data-cert],[data-action],[data-link]');
        if (!t) return;
        if (t.dataset.project !== undefined) selectProject(+t.dataset.project);
        else if (t.dataset.cert !== undefined) showCert(+t.dataset.cert);
        else if (t.dataset.action === 'copy') copyEmail();
        else if (t.dataset.link) window.open(t.dataset.link, '_blank', 'noopener');
    });
}

function initCarouselEvents() {
    $('#projectCarousel').addEventListener('click', (e) => {
        const arrow = e.target.closest('[data-dir]');
        const dot = e.target.closest('[data-i]');
        if (arrow) showImage(imgIdx + +arrow.dataset.dir);
        else if (dot) showImage(+dot.dataset.i);
    });
}

function initTopBar() {
    $('#resetBtn').addEventListener('click', () => run(resetWebsite));
    $('#mailBtn').addEventListener('click', copyEmail);
    $('#fsBtn').addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
    });
}

function copyEmail() {
    navigator.clipboard.writeText(data().contact.email)
        .then(() => showNotification('Email copied to clipboard'))
        .catch(() => showNotification('Failed to copy email'));
}

let toastTimer;
function showNotification(msg) {
    const n = $('#notification');
    $('#notificationText').textContent = msg;
    n.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => n.classList.remove('show'), 2000);
}

function resetWebsite() {
    document.querySelectorAll('.nav-button').forEach((b) => b.classList.remove('active'));
    $('#statusText').textContent = 'Welcome';
    setPanel('Welcome', `<p>${greeting()}, and welcome. Pick a section on the left to begin.</p>`, '// 00 — HOME');
    setHub(PROFILE, 'Profile');
    current = null;
}

/* ---------- power, keyboard, parallax ---------- */

function initPower() {
    const off = $('#offline');
    $('#powerBtn').addEventListener('click', () => off.classList.remove('hidden'));
    $('#rebootBtn').addEventListener('click', () => { off.classList.add('hidden'); resetWebsite(); });
}

function initKeyboard() {
    addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= SECTIONS.length) setSection(SECTIONS[n - 1]);
        else if (e.key === 'Escape') run(resetWebsite);
    });
}

function initParallax() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layers = document.querySelectorAll('[data-depth]');
    addEventListener('pointermove', (e) => {
        const x = e.clientX / innerWidth - 0.5;
        const y = e.clientY / innerHeight - 0.5;
        layers.forEach((l) => { l.style.translate = `${x * l.dataset.depth}px ${y * l.dataset.depth}px`; });
    });
}
