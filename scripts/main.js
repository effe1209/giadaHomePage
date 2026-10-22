const revealItems = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const unfoldTrack = document.querySelector('[data-unfold]');

if (unfoldTrack) {
  const layers = [
    { element: unfoldTrack.querySelector('.unfold-roof'), lift: -104, tilt: -15 },
    { element: unfoldTrack.querySelector('.unfold-interior'), lift: 0, tilt: 0 },
    { element: unfoldTrack.querySelector('.unfold-grounds'), lift: 116, tilt: 10 },
  ];
  const steps = [...unfoldTrack.querySelectorAll('[data-step]')];
  let scrollFrame = null;

  const renderUnfold = (progress) => {
    const opening = progress * progress * (3 - 2 * progress);
    const compact = window.matchMedia('(max-width: 620px)').matches;
    const distanceScale = compact ? 0.56 : 1;

    layers.forEach(({ element, lift, tilt }) => {
      const offset = lift * distanceScale * opening;
      const angle = tilt * opening;
      const scale = element.classList.contains('unfold-roof')
        ? 1 - opening * 0.025
        : 1 + opening * 0.012;
      element.style.transform = `translate3d(0, ${offset}px, 0) rotateX(${angle}deg) scale(${scale})`;

      const caption = element.querySelector('figcaption');
      caption.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.12) * 3.2)));
    });

    const activeStep = progress < 0.38 ? 0 : progress < 0.72 ? 1 : 2;
    steps.forEach((step, index) => {
      if (index === activeStep) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  const updateUnfold = () => {
    scrollFrame = null;
    const rect = unfoldTrack.getBoundingClientRect();
    const range = unfoldTrack.offsetHeight - window.innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 1;
    renderUnfold(reduceMotion ? 1 : progress);
  };

  const requestUnfoldUpdate = () => {
    if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(updateUnfold);
  };

  updateUnfold();
  if (!reduceMotion) {
    window.addEventListener('scroll', requestUnfoldUpdate, { passive: true });
    window.addEventListener('resize', requestUnfoldUpdate);
  }
}
