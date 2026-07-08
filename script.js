(() => {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  const closeNav = () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('.sr-only').textContent = '打开导航';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open', !isOpen);
    navToggle.querySelector('.sr-only').textContent = isOpen ? '打开导航' : '关闭导航';
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeNav();
  });

  const qrModal = document.getElementById('qr-modal');
  const qrCloseButton = qrModal.querySelector('.qr-modal-close');
  let lastFocusedElement = null;

  const closeQrModal = () => {
    qrModal.classList.remove('open');
    qrModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('qr-modal-open');
    lastFocusedElement?.focus();
  };

  document.querySelectorAll('[data-open-lead-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      lastFocusedElement = document.activeElement;
      qrModal.classList.add('open');
      qrModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('qr-modal-open');
      qrCloseButton.focus();
    });
  });
  document.querySelectorAll('[data-close-qr-modal]').forEach((button) => button.addEventListener('click', closeQrModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && qrModal.classList.contains('open')) closeQrModal();
  });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -35px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  const navLinks = [...nav.querySelectorAll('a')];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-25% 0px -65%', threshold: 0 });
    observedSections.forEach((section) => navObserver.observe(section));
  }
})();
