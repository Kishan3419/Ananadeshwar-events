/* ============================
   ANANDESHWAR EVENTS - SCRIPT.JS
   Advanced JavaScript
   ============================ */

'use strict';

// ===== DOM SELECTORS =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const heroParticles = document.getElementById('heroParticles');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const statNumbers = document.querySelectorAll('.stat-number');
const revealElements = document.querySelectorAll('.reveal');
const allNavLinks = document.querySelectorAll('.nav-link');

// ===== NAVBAR SCROLL =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show/Hide scroll-to-top
  if (scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  lastScroll = scrollY;
}, { passive: true });

// ===== HAMBURGER MENU =====
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  navbar.classList.toggle('menu-open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL TO TOP BUTTON =====
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== HERO PARTICLES =====
function createParticles() {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 6 + 3;
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;

    heroParticles.appendChild(particle);
  }
}

createParticles();

// ===== STATS COUNTER ANIMATION =====
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;

  const heroSection = document.getElementById('home');
  const rect = heroSection.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;

  if (inView) {
    statsAnimated = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);
        el.textContent = current;

        if (step >= steps) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, duration / steps);
    });
  }
}

window.addEventListener('scroll', animateStats, { passive: true });
// Also trigger on load
setTimeout(animateStats, 500);

// ===== INTERSECTION OBSERVER FOR REVEAL =====
const observerOptions = {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger delay for grid children
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, i) => {
        if (sib === entry.target) delay = i * 80;
      });

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(delay, 400));

      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// ===== GALLERY FILTER =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    // Update active filter
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');

    galleryItems.forEach((item, i) => {
      const category = item.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        item.classList.remove('hidden');
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, i * 60);
      } else {
        item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.classList.add('hidden');
        }, 250);
      }
    });
  });
});

// ===== GALLERY LIGHTBOX (Simple) =====
galleryItems.forEach(item => {
  item.addEventListener('click', function () {
    const img = this.querySelector('img');
    const caption = this.querySelector('.gallery-overlay span').textContent;

    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.92); display:flex;
      align-items:center; justify-content:center;
      padding:20px; cursor:pointer;
      animation: fadeIn 0.3s ease;
    `;

    const imgEl = document.createElement('img');
    imgEl.src = img.src.replace('w=500', 'w=1200');
    imgEl.alt = img.alt;
    imgEl.style.cssText = `
      max-width:90vw; max-height:85vh;
      object-fit:contain; border-radius:12px;
      box-shadow:0 20px 60px rgba(0,0,0,0.5);
    `;

    const captionEl = document.createElement('div');
    captionEl.textContent = caption;
    captionEl.style.cssText = `
      position:absolute; bottom:30px; left:50%;
      transform:translateX(-50%); color:#fff;
      font-weight:600; font-size:16px;
      background:rgba(234,179,8,0.9);
      padding:8px 24px; border-radius:100px;
      white-space:nowrap;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position:absolute; top:20px; right:20px;
      width:44px; height:44px; background:rgba(255,255,255,0.15);
      color:#fff; font-size:28px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; border:none; transition:background 0.2s;
    `;

    closeBtn.addEventListener('mouseover', () => closeBtn.style.background = 'rgba(255,255,255,0.25)');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.background = 'rgba(255,255,255,0.15)');

    lightbox.appendChild(imgEl);
    lightbox.appendChild(captionEl);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    const closeLightbox = () => {
      lightbox.style.animation = 'fadeOut 0.25s ease forwards';
      setTimeout(() => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
      }, 250);
    };

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function onKeyDown(e) {
      if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', onKeyDown); }
    });
  });
});

// Inject lightbox animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
`;
document.head.appendChild(style);

// ===== CONTACT FORM VALIDATION & SUBMISSION =====
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const eventInput = document.getElementById('eventType');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const eventError = document.getElementById('eventError');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  // Reset errors
  [nameInput, phoneInput, eventInput].forEach(el => el.classList.remove('error'));
  [nameError, phoneError, eventError].forEach(el => el.classList.remove('show'));
  formSuccess.classList.remove('show');

  let valid = true;

  // Validate name
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    nameInput.classList.add('error');
    nameError.classList.add('show');
    nameError.textContent = 'Please enter your full name (min 2 characters)';
    valid = false;
  }

  // Validate phone
  const phone = phoneInput.value.trim().replace(/\s|-/g, '');
  if (!phone || !/^(\+91|91)?[6-9]\d{9}$/.test(phone)) {
    phoneInput.classList.add('error');
    phoneError.classList.add('show');
    phoneError.textContent = 'Please enter a valid 10-digit Indian mobile number';
    valid = false;
  }

  // Validate event type
  if (!eventInput.value) {
    eventInput.classList.add('error');
    eventError.classList.add('show');
    valid = false;
  }

  if (!valid) return;

  // PREPARE DATA
  const formData = {
    name: nameInput.value.trim(),
    phone: phone,
    email: document.getElementById('email').value.trim(),
    eventType: eventInput.value,
    message: document.getElementById('message').value.trim()
  };

  // Google Sheets Web App URL - USER: PASTE YOUR URL HERE
  const SCRIPT_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

  // Real submission
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
    Sending...
  `;

  if (SCRIPT_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
    // Fallback/Demo mode if URL not yet provided
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send Enquiry
      `;
      formSuccess.classList.add('show');
      formSuccess.innerHTML = `<svg width="24" height="24" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> Success! Connect your Apps Script URL in script.js to start saving data to Excel.`;
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 8000);
    }, 1500);
    return;
  }

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Send Enquiry
    `;

      if (data.result === 'success') {
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } else {
        alert('Something went wrong. Please try again or call us directly.');
        console.error('Error:', data.message);
      }
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Send Enquiry
    `;
      alert('Network error. Please check your connection.');
      console.error('Fetch Error:', error);
    });
});

// Clear error on input
['name', 'phone', 'eventType'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', function () {
      this.classList.remove('error');
      const errEl = document.getElementById(id + 'Error') || document.getElementById(id.replace('Type', '') + 'Error');
      if (errEl) errEl.classList.remove('show');
    });
  }
});

// ===== NAVBAR HEIGHT CSS VAR =====
function updateNavHeight() {
  const h = navbar.offsetHeight;
  document.documentElement.style.setProperty('--nav-height', h + 'px');
}
updateNavHeight();
window.addEventListener('resize', updateNavHeight);

// ===== HERO PARALLAX =====
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.3}px)`;
  }
}, { passive: true });

// ===== SERVICE CARD - RIPPLE EFFECT =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(234,179,8,0.04) 0%, transparent 70%), #fff`;
  });

  card.addEventListener('mouseleave', function () {
    this.style.background = '';
  });
});

// ===== TESTIMONIAL CARDS - TILT EFFECT =====
document.querySelectorAll('.testimonial-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    this.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });

  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
    this.style.transition = 'transform 0.5s ease';
  });
});

// ===== WHY CARD STAGGER =====
document.querySelectorAll('.why-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  animateStats();
});

console.log('%c🎉 Anandeshwar Events Website', 'color:#D97706; font-size:16px; font-weight:bold;');
console.log('%cMaking Moments Memorable | Kanpur', 'color:#64748B; font-size:12px;');
