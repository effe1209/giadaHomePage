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

ScrollTrigger.matchMedia({
  // 👉 Mobile
  "(max-width: 768px)": function () {
    const blocks = gsap.utils.toArray(".plant-block");
    const yOffset = 80;

    blocks.forEach((block, i) => {
      gsap.set(block, {
        y: 0,
        opacity: 0.5,
        zIndex: blocks.length - i,
        position: "absolute",
        top: -200,
        left: 0,
        right: 0,
      });

      gsap.to(block, {
        y: i * yOffset,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-wrapper",
          start: "top top+=100",
          end: "bottom top+=600",
          scrub: true,
          markers: false, // per debug
          onUpdate: (self) => {
            const progress = self.progress;
            const threshold = i * 0.15;
            const fadeIn = Math.min(Math.max((progress - threshold) * 4, 0), 1);
            gsap.set(block, { opacity: fadeIn });
          }
        }
      });
    });
  },

  // 👉 Desktop
  "(min-width: 769px)": function () {
    const blocks = gsap.utils.toArray(".plant-block");
    const yOffset = 150;

    blocks.forEach((block, i) => {
      gsap.set(block, {
        y: 0,
        opacity: 0.5,
        zIndex: blocks.length - i,
        position: "absolute",
        top: -300,
        left: 0,
        right: 0,
      });

      gsap.to(block, {
        y: i * yOffset,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-wrapper",
          start: "top top+=400",
          end: "bottom top+=550",
          scrub: true,
          markers: false, // per debug
          onUpdate: (self) => {
            const progress = self.progress;
            const threshold = i * 0.15;
            const fadeIn = Math.min(Math.max((progress - threshold) * 4, 0), 1);
            gsap.set(block, { opacity: fadeIn });
          }
        }
      });
    });
  }
});



const MIN_DISPLAY_TIME = 2000;
const preloader = document.getElementById('preloader');
const imageContainer = document.getElementById('image-container');
const circle = document.getElementById('circle');
const startTime = Date.now();

// Precarica manualmente l'immagine
const bgImage = new Image();
bgImage.src = '.././assets/caric.png';

// Funzione da eseguire quando tutto è pronto
function startAnimations() {
  // 1. Avvia cerchio
  circle.classList.add('start');

  // 2. Dopo che il cerchio ha quasi finito (2s animazione), fai partire le altre
  setTimeout(() => {
    document.querySelector('.diagonal-line')?.classList.add('fade');
    imageContainer.classList.add('explode');

    // 3. Dopo animazione explode, rimuovi il preloader
    const explodeDuration = 1000;
    setTimeout(() => {
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = '0';

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, explodeDuration);
  }, 2000); // Match con la durata animazione cerchio
}

// Controlla che **entrambe** le condizioni siano soddisfatte
function tryStart() {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

  setTimeout(() => {
    if (bgImage.complete) {
      startAnimations();
    } else {
      bgImage.onload = startAnimations;
    }
  }, remaining);
}

// Inizia quando window è caricato
window.addEventListener('load', tryStart);
