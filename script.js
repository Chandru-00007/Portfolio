/* ============================
   script.js — Chandru T Portfolio
   ============================ */

// ─── Particles Background ───
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles = [];
  const PARTICLE_COUNT = 60;
  const COLORS = [
    'rgba(192,57,43,0.35)',
    'rgba(201,168,76,0.3)',
    'rgba(245,230,211,0.12)',
    'rgba(155,89,182,0.2)',
    'rgba(41,128,185,0.2)',
  ];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(245,230,211,0.04)';
          ctx.globalAlpha = 1 - dist / 150;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


// ─── Navbar Scroll Effect ───
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Glass effect on scroll
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
})();


// ─── Mobile Navigation ───
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


// ─── Scroll Reveal (Intersection Observer) ───
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


// ─── Projects Carousel ───
(function initProjectsCarousel() {
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');
  if (!track || !prevBtn || !nextBtn) return;

  let pos = 0;
  const cards = track.querySelectorAll('.project-card');
  
  function getCardWidth() {
    if (!cards.length) return 400;
    const card = cards[0];
    const style = window.getComputedStyle(card);
    return card.offsetWidth + parseInt(style.marginRight || 0) + 24; // 24 = gap
  }

  function getMaxScroll() {
    return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
  }

  function updatePosition() {
    track.style.transform = `translateX(${-pos}px)`;
  }

  nextBtn.addEventListener('click', () => {
    const cardW = getCardWidth();
    const max = getMaxScroll();
    pos = Math.min(pos + cardW, max);
    updatePosition();
  });

  prevBtn.addEventListener('click', () => {
    const cardW = getCardWidth();
    pos = Math.max(pos - cardW, 0);
    updatePosition();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchDiff = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    touchDiff = touchStartX - e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', () => {
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) nextBtn.click();
      else prevBtn.click();
    }
    touchDiff = 0;
  });
})();


// ─── Contact Form ───
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const progressBar = document.getElementById('formProgress');
  const inputs = form.querySelectorAll('input, textarea');

  // Update progress based on filled fields
  function updateProgress() {
    let filled = 0;
    inputs.forEach(input => { if (input.value.trim()) filled++; });
    const pct = (filled / inputs.length) * 100;
    progressBar.style.width = pct + '%';
  }

  inputs.forEach(input => input.addEventListener('input', updateProgress));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.textContent = '✓ Message Sent!';
    submitBtn.style.background = '#27ae60';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.innerHTML = `Send Message <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5-5-5-5"/></svg>`;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      form.reset();
      progressBar.style.width = '0%';
    }, 3000);
  });
})();


// ─── Smooth Scroll for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ─── Typed effect for hero tagline ───
(function initTypedEffect() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  el.style.borderRight = '2px solid var(--tomato-jam-light)';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 18);
    } else {
      // Remove cursor after typing
      setTimeout(() => { el.style.borderRight = 'none'; }, 1500);
    }
  }
  // Delay to let page load
  setTimeout(type, 1200);
})();
