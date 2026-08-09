// =========================================================
// B. MOHAN — PORTFOLIO SCRIPT
// Lightweight 2D "drafting table" ambience (no 3D engine).
// =========================================================

// ===== BACKGROUND CANVAS: drifting grid + slow compass sweep =====
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w, h, dpr;

function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const inkColor = '22, 40, 63';
let t = 0;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Faint measurement ticks that drift slowly, plus a rotating compass arc
const ticks = Array.from({ length: 18 }, () => ({
    x: Math.random() * 1,
    y: Math.random() * 1,
    len: 10 + Math.random() * 18,
    speed: 0.05 + Math.random() * 0.08,
    angle: Math.random() * Math.PI
}));

function drawFrame() {
    ctx.clearRect(0, 0, w, h);

    // Slowly rotating compass arc, anchored near top-right
    const cx = w * 0.82;
    const cy = h * 0.22;
    const r = Math.min(w, h) * 0.22;
    ctx.strokeStyle = `rgba(${inkColor}, 0.08)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, t * 0.05, t * 0.05 + Math.PI * 1.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.62, -t * 0.03, -t * 0.03 + Math.PI * 0.8);
    ctx.stroke();

    // Drifting measurement ticks
    ticks.forEach(tk => {
        const px = tk.x * w;
        const py = tk.y * h;
        const dx = Math.cos(tk.angle) * tk.len;
        const dy = Math.sin(tk.angle) * tk.len;
        ctx.strokeStyle = `rgba(${inkColor}, 0.10)`;
        ctx.beginPath();
        ctx.moveTo(px - dx / 2, py - dy / 2);
        ctx.lineTo(px + dx / 2, py + dy / 2);
        ctx.stroke();
        tk.x += Math.cos(tk.angle) * 0.00006 * tk.speed;
        tk.y += Math.sin(tk.angle) * 0.00006 * tk.speed;
        if (tk.x < -0.05) tk.x = 1.05;
        if (tk.x > 1.05) tk.x = -0.05;
        if (tk.y < -0.05) tk.y = 1.05;
        if (tk.y > 1.05) tk.y = -0.05;
    });

    t += 1;
    if (!reduceMotion) requestAnimationFrame(drawFrame);
}
drawFrame();
if (reduceMotion) {
    // Draw a single static frame and stop.
}

// ===== CROSSHAIR CURSOR =====
const reticle = document.getElementById('reticle');
if (window.matchMedia('(pointer: fine)').matches && reticle) {
    document.addEventListener('mousemove', (e) => {
        reticle.style.left = e.clientX + 'px';
        reticle.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, textarea, .about-card, .contact-card')) {
            reticle.classList.add('active');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, input, textarea, .about-card, .contact-card')) {
            reticle.classList.remove('active');
        }
    });
} else if (reticle) {
    reticle.style.display = 'none';
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE NAVIGATION =====
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.reveal, .reveal-3d');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.2 });
revealElements.forEach(el => revealObserver.observe(el));

// ===== SKILL BAR (SPEC GAUGE) ANIMATION =====
const bars = document.querySelectorAll('.fill');
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const level = entry.target.dataset.level;
            entry.target.style.width = level + '%';
        }
    });
}, { threshold: 0.5 });
bars.forEach(bar => barObserver.observe(bar));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target, 10);
            let count = 0;
            const increment = Math.max(target / 60, 0.3);
            const updateCounter = () => {
                count += increment;
                if (count < target) {
                    entry.target.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.textContent = target;
                }
            };
            updateCounter();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(counter => counterObserver.observe(counter));

// ===== BOTTOM TITLE-BLOCK HUD: current sheet + scroll progress =====
const hudSection = document.getElementById('hud-section');
const hudProgress = document.getElementById('hud-progress');
const sheetNames = {
    home: '01 · HOME',
    about: '02 · PROFILE',
    skills: '03 · SPECS',
    contact: '04 · CONTACT'
};
const sections = document.querySelectorAll('section[id]');

const hudObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            hudSection.textContent = sheetNames[entry.target.id] || '';
        }
    });
}, { threshold: 0.5 });
sections.forEach(sec => hudObserver.observe(sec));

window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
    hudProgress.style.left = `calc(${(pct * 100).toFixed(1)}% - 4px)`;
});


/* ===== PORTFOLIO EXTENSIONS ===== */
document.addEventListener('DOMContentLoaded',()=>{const form=document.querySelector('#contact form');if(form){form.addEventListener('submit',e=>{e.preventDefault();const n=form.querySelector('input[type=text]')?.value.trim()||'Visitor',em=form.querySelector('input[type=email]')?.value.trim()||'',m=form.querySelector('textarea')?.value.trim()||'';location.href=`mailto:balamurugun530@gmail.com?subject=${encodeURIComponent('Portfolio message from '+n)}&body=${encodeURIComponent('Name: '+n+'\nEmail: '+em+'\n\n'+m)}`})}});
