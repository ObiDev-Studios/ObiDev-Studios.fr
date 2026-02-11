const html = document.documentElement;
const lightBtn = document.querySelector('.theme-btn.light-btn');
const darkBtn = document.querySelector('.theme-btn.dark-btn');

function setTheme(theme) {
  if (!html) return;
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (lightBtn && darkBtn) {
    lightBtn.classList.toggle('active', theme === 'light');
    darkBtn.classList.toggle('active', theme === 'dark');
  }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  setTheme(savedTheme);
} else {
  setTheme('dark');
}

if (lightBtn) {
  lightBtn.addEventListener('click', () => setTheme('light'));
}
if (darkBtn) {
  darkBtn.addEventListener('click', () => setTheme('dark'));
}


const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const button = item.querySelector('.faq-question');
  if (!button) return;

  button.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    faqItems.forEach(i => i.classList.remove('active'));

    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// NAVBAR hide on scroll down / show on scroll up
let lastScrollY = window.scrollY;
const headerEl = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (!headerEl) return;

  const currentY = window.scrollY;

  if (currentY > lastScrollY && currentY > 120) {
    // scroll vers le bas
    headerEl.classList.add('header--hidden');
  } else {
    // scroll vers le haut
    headerEl.classList.remove('header--hidden');
  }

  lastScrollY = currentY;
});



document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".plugin-card");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    cards.forEach((card) => observer.observe(card));
  } else {
    // Fallback vieux navigateurs : on montre tout
    cards.forEach((card) => card.classList.add("is-visible"));
  }
});
