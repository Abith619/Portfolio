/* ============================================================
   ABITH RAJ S — Portfolio Script
   Features: Particles, Scroll Animations, Theme, Nav, Form
   ============================================================ */

'use strict';

// ─── DOM READY ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initParticles();
  initScrollAnimations();
  initProjectCardHover();
  initContactForm();
  setYear();
  animateTimelineOnScroll();
});

// ─── THEME TOGGLE ───────────────────────────────────────────
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const stored = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', stored);
  toggle.textContent = stored === 'dark' ? '🌙' : '☀️';

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

// ─── NAVBAR SCROLL ────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });
}

// ─── MOBILE MENU ──────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');
  const spans = hamburger.querySelectorAll('span');

  hamburger.addEventListener('click', () => {
    menu.classList.toggle('open');
    // Animate hamburger to X
    if (menu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ─── PARTICLES CANVAS ─────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 80;
  const particles = [];

  const colors = [
    'rgba(108, 99, 255, 0.7)',
    'rgba(0, 212, 255, 0.6)',
    'rgba(67, 233, 123, 0.5)',
    'rgba(255, 107, 107, 0.4)',
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.6 + 0.2,
    });
  }

  let mouseX = -9999, mouseY = -9999;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * 0.3;
        p.vy += (dy / dist) * force * 0.3;
      }

      // Speed damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      p.x = Math.max(0, Math.min(canvas.width, p.x));
      p.y = Math.max(0, Math.min(canvas.height, p.y));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

// ─── TIMELINE ANIMATION ───────────────────────────────────
function animateTimelineOnScroll() {
  const items = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
  });

  items.forEach(item => observer.observe(item));
}

// ─── PROJECT CARD CURSOR GLOW ────────────────────────────
function initProjectCardHover() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
}

// ─── CONTACT FORM ─────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('messageForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      // Shake animation on empty fields
      [name ? null : 'name', email ? null : 'email', message ? null : 'message']
        .filter(Boolean)
        .forEach(id => {
          const el = document.getElementById(id);
          el.style.borderColor = '#ff6b6b';
          el.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.2)';
          setTimeout(() => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
          }, 2000);
        });
      return;
    }

    // Simulate form submission
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.transition = 'opacity 0.4s, transform 0.4s';
      form.style.opacity = '0';
      form.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
      }, 400);
    }, 1200);
  });
}

// ─── FOOTER YEAR ─────────────────────────────────────────
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── DOWNLOAD RESUME ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const resumeBtn = document.getElementById('downloadResume');

  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const link = document.createElement('a');
      link.href = 'Abith_Raj_Resume.pdf';
      link.download = 'Abith_Raj_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});

// ─── SMOOTH ACTIVE NAV HIGHLIGHT ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));
});

// ─── DYNAMIC ACTIVE NAV STYLE ─────────────────────────────
const styleTag = document.createElement('style');
styleTag.textContent = `
  .nav-links a.active {
    color: var(--text-primary);
    background: var(--bg-card);
  }
`;
document.head.appendChild(styleTag);

// ─── HERO TITLE TYPEWRITER EFFECT ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const phrases = [
    'Scalable ERP Systems',
    'Backend Platforms',
    'API Integrations',
    'Enterprise Software',
  ];

  const el = document.querySelector('.hero-title .line-2');
  if (!el) return;

  el.style.opacity = '1';
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let prefix = 'Building ';

  function type() {
    const currentPhrase = prefix + phrases[phraseIndex];
    const displayed = isDeleting
      ? currentPhrase.substring(0, charIndex - 1)
      : currentPhrase.substring(0, charIndex + 1);

    el.textContent = displayed;
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    if (!isDeleting && charIndex > currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }

    if (isDeleting && charIndex < prefix.length) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = prefix.length;
    }

    const speed = isDeleting ? 45 : 75;
    setTimeout(type, speed);
  }

  // Start after hero animation plays
  setTimeout(() => {
    charIndex = (prefix + phrases[0]).length;
    setTimeout(type, 2000);
  }, 1000);
});

// ─── SCROLL-TRIGGERED COUNTER ANIMATION ──────────────────
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.textContent;
        const numericTarget = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[0-9]/g, '');
        let count = 0;
        const step = Math.ceil(numericTarget / 40);
        const interval = setInterval(() => {
          count += step;
          if (count >= numericTarget) {
            count = numericTarget;
            clearInterval(interval);
          }
          el.textContent = count + suffix;
        }, 35);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
});

// ─── KEYBOARD NAVIGATION ─────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      document.getElementById('hamburger').querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    }
  }
});

