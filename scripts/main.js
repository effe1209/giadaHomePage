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
    opacity: 1,
    zIndex: blocks.length - i,
    position: "absolute",
    top: -250,
    left: 0,
    right: 0,
  });

  gsap.to(block, {
    y: i * 150,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".projects-wrapper",
      start: "top top+=100",
      end: "bottom top+=400",
      scrub: true,
      markers: true, // Imposta a true per debug
    }
  });
});








