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

  const sliceSequence = document.querySelector('[data-slice-sequence]');
  if (sliceSequence && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const leftPanel = sliceSequence.querySelector('.slice-panel-left');
    const rightPanel = sliceSequence.querySelector('.slice-panel-right');
    const firstBlade = sliceSequence.querySelector('.slice-blade-one');
    const secondBlade = sliceSequence.querySelector('.slice-blade-two');
    const scrollHint = sliceSequence.querySelector('.slice-scroll-hint');
    const clamp = (value) => Math.max(0, Math.min(1, value));
    const smooth = (start, end, value) => {
      const t = clamp((value - start) / (end - start));
      return t * t * (3 - 2 * t);
    };
    let target = 0;
    let current = 0;
    let frame = 0;

    const getProgress = () => {
      const distance = Math.max(1, sliceSequence.offsetHeight - window.innerHeight);
      return clamp(-sliceSequence.getBoundingClientRect().top / distance);
    };
    const renderSlice = () => {
      const split = smooth(0.23, 0.82, current);
      const firstCut = smooth(0.02, 0.48, current);
      const secondCut = smooth(0.16, 0.62, current);
      leftPanel.style.transform = `translate3d(${-110 * split}%, 0, 0)`;
      rightPanel.style.transform = `translate3d(${110 * split}%, 0, 0)`;
      firstBlade.style.transform = `translate3d(${-30 + 170 * firstCut}vw, 0, 0) rotate(13deg)`;
      secondBlade.style.transform = `translate3d(${30 - 170 * secondCut}vw, 0, 0) rotate(-13deg)`;
      firstBlade.style.opacity = String(Math.sin(Math.PI * firstCut) * 0.9);
      secondBlade.style.opacity = String(Math.sin(Math.PI * secondCut) * 0.9);
      scrollHint.style.opacity = String(1 - smooth(0, 0.22, current));
    };
    const animateSlice = () => {
      frame = 0;
      const difference = target - current;
      current = Math.abs(difference) < 0.001 ? target : current + difference * 0.22;
      renderSlice();
      if (current !== target) frame = window.requestAnimationFrame(animateSlice);
    };
    const queueSlice = () => {
      target = getProgress();
      if (!frame) frame = window.requestAnimationFrame(animateSlice);
    };

    document.documentElement.classList.add('slice-ready');
    target = getProgress();
    current = target;
    renderSlice();
    window.addEventListener('scroll', queueSlice, { passive: true });
    window.addEventListener('resize', queueSlice, { passive: true });
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
