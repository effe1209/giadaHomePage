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
    {
      element: unfoldTrack.querySelector('.unfold-roof'),
      from: -28, to: -128, tiltFrom: 0, tiltTo: -18,
      start: 0.03, end: 0.66, labelStart: 0.02, labelEnd: 0.29,
    },
    {
      element: unfoldTrack.querySelector('.unfold-interior'),
      from: 0, to: -4, tiltFrom: 0, tiltTo: -1,
      start: 0.18, end: 0.73, labelStart: 0.25, labelEnd: 0.52,
    },
    {
      element: unfoldTrack.querySelector('.unfold-grounds'),
      from: 28, to: 128, tiltFrom: 0, tiltTo: 12,
      start: 0.24, end: 0.84, labelStart: 0.48, labelEnd: 0.76,
    },
  ];
  const steps = [...unfoldTrack.querySelectorAll('[data-step]')];
  const unfoldStage = unfoldTrack.querySelector('.unfold-sticky');
  let scrollFrame = null;

  const phaseProgress = (progress, start, end) => {
    const phase = Math.min(1, Math.max(0, (progress - start) / (end - start)));
    return phase * phase * (3 - 2 * phase);
  };

  const renderUnfold = (progress) => {
    const compact = window.matchMedia('(max-width: 620px)').matches;
    const distanceScale = compact ? Math.min(0.62, window.innerHeight / 1000) : 1;

    layers.forEach(({ element, from, to, tiltFrom, tiltTo, start, end, labelStart, labelEnd }) => {
      const opening = phaseProgress(progress, start, end);
      const offset = (from + (to - from) * opening) * distanceScale;
      const angle = tiltFrom + (tiltTo - tiltFrom) * opening;
      const scale = element.classList.contains('unfold-roof')
        ? 1 - opening * 0.035
        : 1 + opening * 0.015;
      element.style.transform = `translate3d(0, ${offset}px, 0) rotateX(${angle}deg) scale(${scale})`;

      const caption = element.querySelector('figcaption');
      caption.style.opacity = String(phaseProgress(progress, labelStart, labelEnd));
    });

    const activeStep = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;
    steps.forEach((step, index) => {
      if (index === activeStep) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  const updateUnfold = () => {
    scrollFrame = null;
    const rect = unfoldTrack.getBoundingClientRect();
    const range = unfoldTrack.offsetHeight - unfoldStage.offsetHeight;
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
