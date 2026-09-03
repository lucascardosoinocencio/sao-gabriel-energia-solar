/* São Gabriel Energia Solar - interações e animações de scroll */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------------
   Utilitário: debounce
--------------------------------------------------------------- */
function debounce(fn, delay) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ---------------------------------------------------------------
   Efeito de digitação no headline do hero
--------------------------------------------------------------- */
(function typewriterHero() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const words = ['economia real', 'menos gastos', 'conta menor', 'dinheiro no bolso', 'mais economia'];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = words[0];
    return;
  }

  const TYPE_SPEED = 75;
  const DELETE_SPEED = 40;
  const PAUSE_FULL_WORD = 1800;
  const PAUSE_EMPTY = 400;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];
    let delay;

    if (!deleting) {
      charIndex += 1;
      el.textContent = word.slice(0, charIndex);
      delay = TYPE_SPEED;
      if (charIndex === word.length) {
        deleting = true;
        delay = PAUSE_FULL_WORD;
      }
    } else {
      charIndex -= 1;
      el.textContent = word.slice(0, charIndex);
      delay = DELETE_SPEED;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = PAUSE_EMPTY;
      }
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, TYPE_SPEED);
})();

/* ---------------------------------------------------------------
   Header: sombra ao rolar + menu mobile
--------------------------------------------------------------- */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 30);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ---------------------------------------------------------------
   FAQ: acordeão
--------------------------------------------------------------- */
document.querySelectorAll('.faq__item').forEach((item) => {
  const question = item.querySelector('.faq__question');
  question.addEventListener('click', () => {
    const alreadyOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item.open').forEach((open) => open.classList.remove('open'));
    if (!alreadyOpen) item.classList.add('open');
  });
});

/* ---------------------------------------------------------------
   Calculadora de economia
--------------------------------------------------------------- */
const billInput = document.getElementById('billInput');
const calcMonthly = document.getElementById('calcMonthly');
const calcYearly = document.getElementById('calcYearly');
const SAVINGS_RATE = 0.9;

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

billInput.addEventListener('input', () => {
  const bill = parseFloat(billInput.value) || 0;
  const monthly = bill * SAVINGS_RATE;
  calcMonthly.textContent = formatBRL(monthly);
  calcYearly.textContent = formatBRL(monthly * 12);
});

/* ---------------------------------------------------------------
   Animações de scroll (GSAP + ScrollTrigger)
--------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsapReady = window.gsap && window.ScrollTrigger;

if (gsapReady) {
  gsap.registerPlugin(ScrollTrigger);
}

/* Barra de progresso: acompanha 1:1 o scroll da página, mantida mesmo
   com prefers-reduced-motion porque não gera movimento autônomo. */
if (gsapReady) {
  gsap.to('#scrollProgress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });
}

if (gsapReady && !prefersReducedMotion) {
  /* Entrada do hero ao carregar a página */
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.badge', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero__title', { opacity: 0, y: 30, duration: 0.7 }, '-=0.35')
    .from('.hero__subtitle', { opacity: 0, y: 24, duration: 0.7 }, '-=0.45')
    .from('.hero__cta .btn', { opacity: 0, y: 20, duration: 0.6, stagger: 0.12 }, '-=0.4')
    .from('.trust__item', { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, '-=0.3');

  /* Parallax do fundo do hero, escala fixa para não revelar bordas */
  gsap.set('.hero__img', { scale: 1.15, transformOrigin: 'center center' });
  gsap.to('.hero__img', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* Parallax da faixa de impacto (foto da usina solar) */
  gsap.set('.impact__img', { scale: 1.2, transformOrigin: 'center center' });
  gsap.to('.impact__img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.impact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* Reveal com stagger para grupos de elementos */
  const staggerGroups = [
    { container: '.services__grid', items: '.card' },
    { container: '.why__list', items: '.why__list li' },
    { container: '.steps__grid', items: '.step' },
    { container: '.faq__list', items: '.faq__item' },
    { container: '.brands__row', items: '.brand-chip' },
  ];

  staggerGroups.forEach(({ container, items }) => {
    const containerEl = document.querySelector(container);
    if (!containerEl) return;
    gsap.from(items, {
      opacity: 0,
      y: 36,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerEl,
        start: 'top 82%',
      },
    });
  });

  /* Reveal simples para títulos de seção e blocos isolados */
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });

  /* Galeria: profundidade alternada por item, só transform */
  document.querySelectorAll('.gallery__item').forEach((item, index) => {
    const offset = index % 2 === 0 ? -28 : 28;
    gsap.fromTo(item, { y: 0 }, {
      y: offset,
      ease: 'none',
      scrollTrigger: {
        trigger: '.gallery',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  /* Card CTA final e blob: leve escala ao entrar em cena */
  gsap.from('.final-cta__content', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.final-cta',
      start: 'top 75%',
    },
  });

  /* Hover com GSAP nos elementos que também recebem animação de
     entrada por scroll (evita duas fontes controlando "transform") */
  function hoverLift(selector, y) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('mouseenter', () => gsap.to(el, { y, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }));
      el.addEventListener('mouseleave', () => gsap.to(el, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }));
    });
  }
  hoverLift('.card', -8);
  hoverLift('.step', -6);

  gsap.set('.brand-chip__shine', { x: -40, rotation: 20 });
  document.querySelectorAll('.brand-chip').forEach((chip) => {
    const shine = chip.querySelector('.brand-chip__shine');
    chip.addEventListener('mouseenter', () => {
      gsap.to(chip, { y: -6, scale: 1.05, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      if (shine) {
        gsap.fromTo(shine, { x: -40, rotation: 20 }, { x: 260, rotation: 20, duration: 0.7, ease: 'power1.out', overwrite: 'auto' });
      }
    });
    chip.addEventListener('mouseleave', () => {
      gsap.to(chip, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    });
  });

  /* Resize: recalcula posições e medidas de forma otimizada */
  window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
  }, 200));
}
