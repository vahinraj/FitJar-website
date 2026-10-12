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
    const intact = sliceSequence.querySelector('.slice-intact');
    const halves = {
      upper: sliceSequence.querySelector('.slice-half-upper'),
      lower: sliceSequence.querySelector('.slice-half-lower'),
    };
    const panels = {
      top: sliceSequence.querySelector('.slice-panel-top'),
      right: sliceSequence.querySelector('.slice-panel-right'),
      bottom: sliceSequence.querySelector('.slice-panel-bottom'),
      left: sliceSequence.querySelector('.slice-panel-left'),
    };
    const firstEdges = sliceSequence.querySelectorAll('.slice-edge-first');
    const secondEdges = sliceSequence.querySelectorAll('.slice-panel .slice-edge-second');
    const scrollHint = sliceSequence.querySelector('.slice-scroll-hint');
    const clamp = value => Math.max(0, Math.min(1, value));
    const mix = (start, end, amount) => start + (end - start) * amount;
    const move = (element, x, y) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
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
      const firstCut = smooth(0.12, 0.30, current);
      const secondCut = smooth(0.43, 0.72, current);
      const firstOpened = current >= 0.12;
      const secondOpened = current >= 0.43;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const upperX = width * 0.038 * firstCut;
      const upperY = -height * 0.045 * firstCut;
      const lowerX = -upperX;
      const lowerY = -upperY;

      intact.style.opacity = firstOpened ? '0' : '1';
      halves.upper.style.opacity = firstOpened && !secondOpened ? '1' : '0';
      halves.lower.style.opacity = firstOpened && !secondOpened ? '1' : '0';
      move(halves.upper, upperX, upperY);
      move(halves.lower, lowerX, lowerY);

      Object.values(panels).forEach(panel => {
        panel.style.opacity = secondOpened && secondCut < 1 ? '1' : '0';
      });
      move(panels.top, mix(upperX, 0, secondCut), mix(upperY, -height * 1.2, secondCut));
      move(panels.right, mix(upperX, width * 1.2, secondCut), mix(upperY, 0, secondCut));
      move(panels.bottom, mix(lowerX, 0, secondCut), mix(lowerY, height * 1.2, secondCut));
      move(panels.left, mix(lowerX, -width * 1.2, secondCut), mix(lowerY, 0, secondCut));

      const firstGlow = smooth(0.12, 0.16, current) * (1 - smooth(0.29, 0.51, current));
      const secondGlow = smooth(0.43, 0.48, current) * (1 - smooth(0.59, 0.72, current));
      firstEdges.forEach(edge => {
        edge.style.strokeDashoffset = String(100 * (1 - smooth(0.12, 0.27, current)));
        edge.style.opacity = String(firstGlow);
      });
      secondEdges.forEach(edge => {
        edge.style.strokeDashoffset = String(100 * (1 - smooth(0.43, 0.58, current)));
        edge.style.opacity = String(secondGlow);
      });
      scrollHint.style.opacity = String(1 - smooth(0, 0.16, current));
    };
    const animateSlice = () => {
      frame = 0;
      const difference = target - current;
      current = Math.abs(difference) < 0.001 ? target : current + difference * 0.34;
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
