/* ══════════════════════════════════════════════
   Ahmed Mohsen · amohsen.com · Script v3
   Apple-style scroll storytelling
══════════════════════════════════════════════ */

/* ── LOADER ── */
(function() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-progress');
  let w = 0;
  const fill = setInterval(() => {
    w += Math.random() * 18 + 4;
    if (w >= 100) { w = 100; clearInterval(fill); }
    bar.style.width = w + '%';
  }, 60);
  window.addEventListener('load', () => {
    bar.style.width = '100%';
    setTimeout(() => loader.classList.add('done'), 400);
  });
})();

/* ── NAV ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── BURGER (mobile) ── */
const burger = document.getElementById('burger');
let menuOpen = false;
// simple mobile nav toggle — hide/show nav-items inline
burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  const items = document.querySelector('.nav-items');
  if (menuOpen) {
    items.style.cssText = `
      display:flex; flex-direction:column; gap:20px;
      position:fixed; top:0; left:0; right:0; bottom:0;
      background:rgba(255,255,255,0.98); backdrop-filter:blur(20px);
      align-items:center; justify-content:center; z-index:999;
      font-size:1.4rem;
    `;
    items.querySelectorAll('a').forEach(a => {
      a.style.cssText = 'font-size:1.3rem; letter-spacing:0.05em; color:#0a0a0a; text-decoration:none;';
    });
    burger.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    burger.querySelectorAll('span')[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    document.querySelector('.nav-items').style.cssText = '';
    burger.querySelectorAll('span')[0].style.transform = '';
    burger.querySelectorAll('span')[1].style.transform = '';
  }
});
document.querySelectorAll('.nav-items a').forEach(a => {
  a.addEventListener('click', () => {
    if (menuOpen) burger.click();
  });
});

/* ── HERO ENTRANCE ── */
window.addEventListener('DOMContentLoaded', () => {
  const slideEls = document.querySelectorAll('.slide-up');
  slideEls.forEach((el, i) => {
    el.style.transform = 'translateY(100%)';
    el.style.display = 'block';
    el.style.transition = `transform 1s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.12}s`;
    setTimeout(() => { el.style.transform = 'translateY(0)'; }, 50);
  });

  const fadeEls = document.querySelectorAll('.slide-fade');
  fadeEls.forEach((el) => {
    const delay = el.classList.contains('delay-2') ? 0.7 : 0.55;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50);
  });
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-block').forEach((el, i) => {
  const delay = (i % 4) * 0.08;
  el.style.transitionDelay = delay + 's';
  revealObs.observe(el);
});

/* ── SKILL BAR ANIMATION ── */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sk-level span').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.style.getPropertyValue('--w') || bar.style.width; }, 100);
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSec = document.querySelector('.skills-sec');
if (skillsSec) {
  // Trigger bar fill when section visible
  const skillFillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.sk-level span').forEach(bar => {
          // Get target width from inline style
          const targetW = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = targetW; }, 300);
        });
        skillFillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFillObs.observe(skillsSec);
}

/* ── COUNTER ANIMATION ── */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function runCounter(el, target, duration = 2000) {
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(p) * target);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.count-up').forEach(el => {
      runCounter(el, parseInt(el.dataset.target), 2000);
    });
    countObs.unobserve(entry.target);
  });
}, { threshold: 0.4 });
const statTower = document.querySelector('.stat-tower');
if (statTower) countObs.observe(statTower);
const aboutMeta = document.querySelector('.about-sec');
if (aboutMeta) countObs.observe(aboutMeta);

/* ── CONTACT FORM ── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.cf-submit');
    const txt = form.querySelector('.cf-submit-text');
    const icon = form.querySelector('.cf-submit-icon');
    txt.textContent = 'Message Sent!';
    icon.textContent = '✓';
    btn.style.background = '#00c07f';
    btn.disabled = true;
    setTimeout(() => {
      txt.textContent = 'Send Message';
      icon.textContent = '→';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

/* ── TIMELINE hover style helper ── */
/* Wrap each wt-content's inner markup in a styled box */
document.querySelectorAll('.wt-content').forEach(content => {
  const box = document.createElement('div');
  box.className = 'wt-content-box';
  while (content.firstChild) box.appendChild(content.firstChild);
  content.appendChild(box);
});

/* ── ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
  document.querySelectorAll('.nav-items a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--ink)' : '';
  });
}, { passive: true });

/* ── PARALLAX hero BG text ── */
window.addEventListener('scroll', () => {
  const bgText = document.querySelector('.hero-bg-text');
  if (bgText) bgText.style.transform = `translateY(${window.scrollY * 0.15}px)`;
}, { passive: true });
