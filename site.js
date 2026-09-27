(() => {
  const showBodyError = () => {
    const loader = document.querySelector('#body-loading');
    if (loader?.isConnected) {
      loader.textContent = '3D preview unavailable';
      loader.classList.add('body-load-error');
    }
  };
  window.setTimeout(showBodyError, 8000);
  window.addEventListener('error', (event) => {
    if (String(event.filename || '').includes('body-model')) showBodyError();
  });
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links?.classList.toggle('open', open);
  });
  links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    links.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Open menu');
  }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px 40px 0px' });
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));
  }
  const navItems = document.querySelectorAll('.home-page .nav-links a[href^="#"]');
  if (navItems.length && 'IntersectionObserver' in window) {
    const sections = [...navItems].map(item => document.querySelector(item.getAttribute('href'))).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
  }
})();
