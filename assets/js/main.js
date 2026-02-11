/* ===== © 2026 ObiDev Studios ===== */

document.addEventListener("DOMContentLoaded", () => {
  function initNavLinks() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.removeEventListener('click', handleNavClick);
      link.addEventListener('click', handleNavClick);
    });
  }

  function handleNavClick(event) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  initNavLinks();

  // === FAQ ===
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-header'); 
      if (!header) return;

      const existingHandler = header._faqHandler;
      if (!existingHandler) {
        header._faqHandler = () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        };
        header.addEventListener('click', header._faqHandler);
      }
    });
  }

  // === CARDS MODAL ===
  const cards = document.querySelectorAll(".plugin-card");
  const modalOverlay = document.getElementById("plugin-modal");

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
    cards.forEach((card) => card.classList.add("is-visible"));
  }

  // Modal
  if (modalOverlay) {
    const modalTitle = modalOverlay.querySelector(".plugin-modal-title");
    const modalSubtitle = modalOverlay.querySelector(".plugin-modal-subtitle");
    const modalBadge = modalOverlay.querySelector(".plugin-modal-badge");
    const commandsList = modalOverlay.querySelector(".plugin-modal-commands");
    const contentList = modalOverlay.querySelector(".plugin-modal-content");
    const downloadBtn = modalOverlay.querySelector(".plugin-download-btn");
    const closeBtn = modalOverlay.querySelector(".plugin-modal-close");

    function openModalFromCard(card) {
      const name = card.dataset.name || "";
      const description = card.dataset.description || "";
      const badge = card.dataset.badge || "Plugin";
      const commands = (card.dataset.commands || "").split("|");
      const content = (card.dataset.content || "").split("|");
      const downloadUrl = card.dataset.download || "#";

      modalTitle.textContent = name;
      modalSubtitle.textContent = description;
      modalBadge.textContent = badge;

      commandsList.innerHTML = "";
      commands.filter((c) => c.trim() !== "").forEach((cmd) => {
        const li = document.createElement("li");
        li.textContent = cmd.trim();
        commandsList.appendChild(li);
      });

      contentList.innerHTML = "";
      content.filter((c) => c.trim() !== "").forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.trim();
        contentList.appendChild(li);
      });

      downloadBtn.href = downloadUrl;
      modalOverlay.classList.add("open");
    }

    cards.forEach((card) => {
      card.addEventListener("click", (e) => openModalFromCard(card));
    });

    function closeModal() {
      modalOverlay.classList.remove("open");
    }

    closeBtn?.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // === NAVBAR ===
  let lastScrollY = window.scrollY;
  const headerEl = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (!headerEl) return;
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 120) {
      headerEl.classList.add('header--hidden');
    } else {
      headerEl.classList.remove('header--hidden');
    }
    lastScrollY = currentY;
  });

  // === THÈME ===
  function setTheme(theme) {
    const stylesheet = document.getElementById('theme-stylesheet');
    const btnDark = document.getElementById('themeDarkTop');
    const btnLight = document.getElementById('themeLightTop');
    
    if (theme === 'light') {
      stylesheet.href = 'assets/css/light-theme.css?v=' + Date.now();
      btnLight.classList.add('is-active');
      btnDark.classList.remove('is-active');
      localStorage.setItem('theme', 'light');
    } else {
      stylesheet.href = 'assets/css/dark-theme.css?v=' + Date.now();
      btnDark.classList.add('is-active');
      btnLight.classList.remove('is-active');
      localStorage.setItem('theme', 'dark');
    }
    

    setTimeout(initFAQ, 100);
  }


  document.getElementById('themeDarkTop')?.addEventListener('click', () => setTheme('dark'));
  document.getElementById('themeLightTop')?.addEventListener('click', () => setTheme('light'));


  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  

  initFAQ();
});

/* ===== © 2026 ObiDev Studios ===== */
