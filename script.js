// ============ NAVBAR SCROLL EFFECT ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ============ MOBILE MENU ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ============ SCROLL ANIMATIONS ============
const animatedEls = document.querySelectorAll(
  '.service-card, .product-card, .step, .why-card, .supplier-feature, .about-point, .coa-highlight'
);

animatedEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

animatedEls.forEach(el => observer.observe(el));

// ============ ACTIVE NAV LINK ON SCROLL ============
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeStyle = document.createElement('style');
activeStyle.textContent = '.nav-links a.active { color: var(--green-700) !important; font-weight: 600; }';
document.head.appendChild(activeStyle);

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.25 }
);

sections.forEach(s => sectionObserver.observe(s));

// ============ CONTACT FORM ============
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      if (isEmpty) {
        if (field.type !== 'checkbox') field.style.borderColor = '#ef4444';
        valid = false;
      }
    });

    if (!valid) return;

    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    const data = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          submitBtn.style.display = 'none';
          formSuccess.style.display = 'flex';
          form.reset();
        } else {
          btnText.style.display = 'inline';
          btnLoading.style.display = 'none';
          submitBtn.disabled = false;
          alert('Something went wrong. Please try again or contact us directly via WhatsApp.');
        }
      })
      .catch(() => {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        alert('Network error. Please check your connection or contact us via WhatsApp.');
      });
  });

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}

// ============ SMOOTH ANCHOR SCROLLING ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});