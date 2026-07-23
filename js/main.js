/* =============================================
   MEDICORE HOSPITAL – Main JavaScript
   All interactions: theme, navbar, slider,
   lightbox, FAQ accordion, forms, counters,
   back-to-top, AOS, smooth scroll
   ============================================= */

'use strict';

/* ============================================
   HELPERS
   ============================================ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================
   PRELOADER
   ============================================ */
window.addEventListener('load', () => {
  const preloader = qs('#preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Remove from DOM after transition so it can't block clicks
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  }, 900);
});

/* ============================================
   THEME TOGGLE (Dark / Light Mode)
   ============================================ */
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('medicore-theme', theme);
  qsa('.theme-toggle').forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });
}

function initTheme() {
  const saved = localStorage.getItem('medicore-theme');
  setTheme(saved || 'dark');
}

document.addEventListener('click', e => {
  if (e.target.closest('.theme-toggle')) {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
});

// Init immediately — avoids flash of wrong theme
initTheme();

/* ============================================
   NAVBAR – scroll shadow + active link
   ============================================ */
const navbar = qs('.navbar');

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// Mark active nav link based on current page filename
(function setActiveNav() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-link, .mobile-nav a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    link.classList.toggle('active', href === file);
  });
})();

/* ============================================
   MOBILE MENU
   ============================================ */
const hamburger  = qs('.hamburger');
const mobileMenu = qs('.mobile-menu');

function closeMobileMenu() {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.classList.toggle('active', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close when a nav link is tapped
  qsa('a', mobileMenu).forEach(a => a.addEventListener('click', closeMobileMenu));

  // Close on outside click / tap
  document.addEventListener('click', e => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
  });
}

/* ============================================
   BACK TO TOP
   ============================================ */
const backToTop = qs('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================
   ANIMATED COUNTER
   ============================================ */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const fps      = 60;
  const steps    = (duration / 1000) * fps;
  const inc      = Math.max(1, Math.ceil(target / steps));
  let current    = 0;

  const tick = () => {
    current = Math.min(current + inc, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.3 });

qsa('[data-counter]').forEach(el => counterObserver.observe(el));

/* ============================================
   TESTIMONIAL / HERO SLIDER
   ============================================ */
function initSlider(sliderEl) {
  if (!sliderEl) return;
  const track    = qs('.testimonial-track', sliderEl);
  const slides   = qsa('.testimonial-slide', sliderEl);
  if (!track || slides.length < 2) return;

  const wrap    = sliderEl.closest('section') || sliderEl.parentElement;
  const dotsWrap = qs('.slider-dots', wrap);
  const prevBtn  = qs('.slider-btn.prev', wrap);
  const nextBtn  = qs('.slider-btn.next', wrap);

  let current = 0;
  let timer   = null;

  // Build dots
  if (dotsWrap && dotsWrap.children.length === 0) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className   = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    qsa('.slider-dot', wrap).forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    startAuto();
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard left/right on slider area
  sliderEl.setAttribute('tabindex', '0');
  sliderEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  // Pause on hover / focus
  sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
  sliderEl.addEventListener('mouseleave', startAuto);
  sliderEl.addEventListener('focusin',    () => clearInterval(timer));
  sliderEl.addEventListener('focusout',   startAuto);

  startAuto();
}

qsa('.testimonial-slider').forEach(initSlider);

/* ============================================
   FAQ ACCORDION
   ============================================ */
qsa('.faq-question').forEach(question => {
  // Make keyboard-accessible
  question.setAttribute('tabindex', '0');

  function toggle() {
    const item    = question.closest('.faq-item');
    const answer  = qs('.faq-answer', item);
    const isOpen  = question.classList.contains('active');

    // Close all
    qsa('.faq-question.active').forEach(q => {
      q.classList.remove('active');
      q.setAttribute('aria-expanded', 'false');
      const a = qs('.faq-answer', q.closest('.faq-item'));
      if (a) a.classList.remove('open');
    });

    // Open this one if it was closed
    if (!isOpen) {
      question.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
      if (answer) answer.classList.add('open');
    }
  }

  question.addEventListener('click', toggle);
  question.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

/* ============================================
   GALLERY LIGHTBOX
   ============================================ */
function initLightbox() {
  const lightbox = qs('.lightbox');
  if (!lightbox) return;

  const lbImg   = qs('.lightbox-img', lightbox);
  const closeBtn = qs('.lightbox-close', lightbox);
  const prevBtn  = qs('.lightbox-prev', lightbox);
  const nextBtn  = qs('.lightbox-next', lightbox);
  // Only count visible items (not hidden by filter)
  let items = [];
  let idx   = 0;

  function refreshItems() {
    items = qsa('.gallery-item').filter(el => el.style.display !== 'none');
  }

  function open(i) {
    refreshItems();
    idx = ((i % items.length) + items.length) % items.length;
    const img = qs('img', items[idx]);
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nav(dir) {
    refreshItems();
    idx = ((idx + dir + items.length) % items.length);
    const img = qs('img', items[idx]);
    if (!img) return;
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.95)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        lbImg.style.opacity  = '1';
        lbImg.style.transform = 'scale(1)';
      }, 180);
    });
  }

  // Add transition for smooth image swap
  if (lbImg) { lbImg.style.transition = 'opacity 0.18s ease, transform 0.18s ease'; }

  // Open on gallery item click
  document.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      refreshItems();
      open(items.indexOf(item));
    }
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click',  () => nav(-1));
  nextBtn?.addEventListener('click',  () => nav(1));

  // Backdrop click to close
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   nav(-1);
    if (e.key === 'ArrowRight')  nav(1);
  });
}
initLightbox();

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
const contactForm = qs('#contactForm');
if (contactForm) {
  const successMsg = qs('.form-success', contactForm);

  function showErr(field, msg) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    const span = field.parentElement.querySelector('.form-error');
    if (span) { span.textContent = msg; span.classList.add('show'); }
  }

  function clearErr(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    const span = field.parentElement?.querySelector('.form-error');
    if (span) span.classList.remove('show');
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[\+\d\s\-\(\)]{7,20}$/;

  // Live clear-error on input
  qsa('.form-control', contactForm).forEach(f => f.addEventListener('input', () => clearErr(f)));

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const f = {
      name:    qs('#name',    contactForm),
      email:   qs('#email',   contactForm),
      phone:   qs('#phone',   contactForm),
      subject: qs('#subject', contactForm),
      message: qs('#message', contactForm),
    };

    if (f.name && f.name.value.trim().length < 2)          { showErr(f.name,    'Please enter your full name.');         valid = false; } else if (f.name)    clearErr(f.name);
    if (f.email && !emailRe.test(f.email.value.trim()))    { showErr(f.email,   'Please enter a valid email address.');  valid = false; } else if (f.email)   clearErr(f.email);
    if (f.phone && f.phone.value && !phoneRe.test(f.phone.value)) { showErr(f.phone, 'Please enter a valid phone number.'); valid = false; } else if (f.phone)   clearErr(f.phone);
    if (f.subject && f.subject.value.trim().length < 3)    { showErr(f.subject, 'Please enter a subject.');              valid = false; } else if (f.subject) clearErr(f.subject);
    if (f.message && f.message.value.trim().length < 10)   { showErr(f.message, 'Message must be at least 10 characters.'); valid = false; } else if (f.message) clearErr(f.message);

    if (!valid) {
      // Scroll to first error
      const firstErr = qs('.form-control.error', contactForm);
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErr?.focus();
      return;
    }

    const btn = qs('[type="submit"]', contactForm);
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => successMsg.classList.remove('show'), 6000);
      }
    }, 1600);
  });
}

/* ============================================
   NEWSLETTER FORMS (handles multiple on page)
   ============================================ */
qsa('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = qs('input[type="email"]', form);
    const btn   = qs('button[type="submit"]', form);
    if (!input || !btn) return;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRe.test(input.value.trim())) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
      btn.style.background = '#198754';
      btn.disabled = true;
      input.value  = '';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    } else {
      input.classList.add('error');
      input.style.outline = '2px solid #dc3545';
      input.focus();
      setTimeout(() => {
        input.classList.remove('error');
        input.style.outline = '';
      }, 2500);
    }
  });
});

/* ============================================
   AOS – Scroll Animations
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration : 650,
      easing   : 'ease-out-cubic',
      once     : true,
      offset   : 50,
      delay    : 0,
    });
  }
});

/* ============================================
   SMOOTH SCROLL – internal anchor links
   ============================================ */
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (href === '#') return;
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
  ) || 72;
  const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ============================================
   GALLERY FILTER (gallery page only)
   ============================================ */
qsa('.gallery-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    qsa('.gallery-filter').forEach(b => {
      b.classList.remove('active', 'btn-primary');
      b.classList.add('btn-outline');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active', 'btn-primary');
    btn.classList.remove('btn-outline');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    qsa('.gallery-item').forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.display  = show ? '' : 'none';
      item.style.animation = show ? 'fadeIn 0.35s ease' : 'none';
    });
  });
});

/* ============================================
   DYNAMIC SCROLL PROGRESS BAR
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.className = 'scroll-progress-container';
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  container.appendChild(bar);
  document.body.appendChild(container);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = scrolled + '%';
  }, { passive: true });
});
