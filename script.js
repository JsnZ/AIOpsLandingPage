(() => {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const modal = document.getElementById('lead-modal');
  const form = document.getElementById('lead-form');
  const success = document.getElementById('form-success');
  let lastFocusedElement = null;

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

  document.querySelectorAll('.accordion-item h3 button').forEach((button) => {
    button.addEventListener('click', () => {
      const content = button.closest('.accordion-item').querySelector('.accordion-content');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      button.querySelector('b').textContent = isExpanded ? '+' : '−';
      content.hidden = isExpanded;
    });
  });

  const courseTabs = [...document.querySelectorAll('[data-course-tab]')];
  courseTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateCourseTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'ArrowRight'
        ? (index + 1) % courseTabs.length
        : (index - 1 + courseTabs.length) % courseTabs.length;
      courseTabs[nextIndex].focus();
      activateCourseTab(courseTabs[nextIndex]);
    });
  });

  function activateCourseTab(activeTab) {
    courseTabs.forEach((tab) => {
      const active = tab === activeTab;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.dataset.courseTab);
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  }

  const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    form.hidden = false;
    success.hidden = true;
    clearErrors();
    window.setTimeout(() => document.getElementById('name').focus(), 30);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    form.reset();
    clearErrors();
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll('[data-open-lead-modal]').forEach((button) => button.addEventListener('click', openModal));
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll(focusableSelector)].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const fields = {
    name: document.getElementById('name'),
    phone: document.getElementById('phone'),
    role: document.getElementById('role'),
    privacy: document.getElementById('privacy')
  };

  function setError(field, message) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    const error = field === fields.privacy
      ? document.querySelector('.privacy-error')
      : field.closest('.form-row').querySelector('.field-error');
    error.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll('.invalid').forEach((field) => {
      field.classList.remove('invalid');
      field.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
  }

  function validateForm() {
    clearErrors();
    let valid = true;
    if (!fields.name.value.trim()) {
      setError(fields.name, '请输入姓名');
      valid = false;
    }
    if (!/^1[3-9]\d{9}$/.test(fields.phone.value.trim())) {
      setError(fields.phone, '请输入有效的11位手机号');
      valid = false;
    }
    if (!fields.role.value) {
      setError(fields.role, '请选择当前岗位');
      valid = false;
    }
    if (!fields.privacy.checked) {
      setError(fields.privacy, '请确认演示表单说明');
      valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    form.hidden = true;
    success.hidden = false;
    success.querySelector('button').focus();
  });

  Object.values(fields).forEach((field) => {
    field.addEventListener(field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input', () => {
      field.classList.remove('invalid');
      field.removeAttribute('aria-invalid');
      const error = field === fields.privacy
        ? document.querySelector('.privacy-error')
        : field.closest('.form-row').querySelector('.field-error');
      error.textContent = '';
    });
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
  const observedSections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -65%', threshold: 0 });
    observedSections.forEach((section) => navObserver.observe(section));
  }
})();
