(() => {
  'use strict';
  const menu = document.getElementById('guide-menu');
  const printButton = document.getElementById('print-guide');
  const practices = Array.from(document.querySelectorAll('[data-day]'));
  const progressLabel = document.getElementById('progress-label');
  const progressBar = document.getElementById('progress-bar');
  const storageNote = document.getElementById('storage-note');
  const resetButton = document.getElementById('reset-progress');
  const storageKey = 'eduardramos-del-conflicto-practicas-v1';
  let storageAvailable = true;
  let marked = [];

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) marked = saved.filter(n => Number.isInteger(n) && n >= 1 && n <= 7);
    localStorage.setItem(storageKey, JSON.stringify(marked));
  } catch (_) {
    storageAvailable = false;
  }

  function updateProgress() {
    const completed = practices.filter(input => input.checked).map(input => Number(input.dataset.day));
    progressBar.value = completed.length;
    progressLabel.textContent = `${completed.length} de 7 prácticas marcadas`;
    for (const input of practices) input.closest('.practice-day').classList.toggle('is-complete', input.checked);
    if (storageAvailable) {
      try { localStorage.setItem(storageKey, JSON.stringify(completed)); }
      catch (_) {
        storageAvailable = false;
        storageNote.textContent = 'Las marcas estarán disponibles mientras mantengas abierta esta página.';
      }
    }
  }

  practices.forEach(input => {
    input.checked = marked.includes(Number(input.dataset.day));
    input.closest('label').hidden = false;
    input.addEventListener('change', updateProgress);
  });
  document.getElementById('practice-progress').hidden = false;
  storageNote.hidden = false;
  resetButton.hidden = false;
  if (!storageAvailable) storageNote.textContent = 'Las marcas estarán disponibles mientras mantengas abierta esta página.';
  updateProgress();
  resetButton.addEventListener('click', () => {
    practices.forEach(input => { input.checked = false; });
    updateProgress();
  });

  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
  let previousDetails = [];
  window.addEventListener('beforeprint', () => {
    previousDetails = Array.from(document.querySelectorAll('details:not(.menu)')).map(el => [el, el.open]);
    previousDetails.forEach(([el]) => { el.open = true; });
    menu.open = false;
  });
  window.addEventListener('afterprint', () => {
    previousDetails.forEach(([el, open]) => { el.open = open; });
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });

  if ('IntersectionObserver' in window) {
    const navLinks = Array.from(document.querySelectorAll('.sidebar a'));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      }
    }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('section.chapter').forEach(section => observer.observe(section));
  }
})();
