// Fade-in semplice quando gli elementi entrano nel viewport
document.addEventListener('DOMContentLoaded', () => {
  const fadeInElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // smetti di osservare dopo la prima comparsa
      }
    });
  }, { threshold: 0.1 }); // si attiva appena il 10% è visibile

  fadeInElements.forEach(el => observer.observe(el));
});

const swiper = new Swiper('.swiper', {
  loop: true,
  effect: 'fade', // <--- EFFETTO FADE
  fadeEffect: {
    crossFade: true
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false
  },
  speed: 1000, // durata della transizione
});


gsap.registerPlugin(ScrollTrigger);

const blocks = gsap.utils.toArray(".plant-block");

blocks.forEach((block, i) => {
  gsap.set(block, {
    y: 0,
    opacity: 0.5,
    zIndex: blocks.length - i,
    position: "absolute",
    top: -300,
    left: 0,
    right: 0,
    effect: 'fade',
  });

  gsap.to(block, {
    y: i * 150,
    opacity: 1, // appare con lo scroll
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".projects-wrapper",
      start: "top top+=200",
      end: "bottom top+=820",
      scrub: true,
      markers: false, // Imposta a true per debug
      onUpdate: (self) => {
        // Calcola opacità dinamica per questo blocco
        const progress = self.progress; // tra 0 e 1
        const threshold = i * 0.15;     // ritardo basato su i
        const fadeIn = Math.min(Math.max((progress - threshold) * 4, 0), 1);
        gsap.set(block, { opacity: fadeIn });
      }
    }
  });
});








