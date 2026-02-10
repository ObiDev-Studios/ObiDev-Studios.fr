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
