const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const menuBtn = $('#menuBtn');
const nav = $('#nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
$$('#nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

const scrollLine = $('#scrollLine');
const updateScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  scrollLine.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
};
addEventListener('scroll', updateScroll, {passive:true});
addEventListener('resize', updateScroll);
updateScroll();

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    entry.target.style.transitionDelay = `${Math.min(i * 40, 160)}ms`;
    entry.target.classList.add('in');
    observer.unobserve(entry.target);
  });
}, {threshold:0.12});
$$('.reveal').forEach(el => observer.observe(el));

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer:fine)').matches;

if (finePointer && !reduced) {
  const glow = $('#cursorGlow');
  addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, {passive:true});

  $$('[data-tilt]').forEach(card => {
    const max = Number(card.dataset.max || 5);
    let raf;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(1200px) rotateX(${(-y*max).toFixed(2)}deg) rotateY(${(x*max).toFixed(2)}deg) translateZ(0)`;
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });

  $$('.magnet').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * .08;
      const y = (e.clientY - r.top - r.height/2) * .08;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}

const hero = $('.scene');
if (finePointer && !reduced && hero) {
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    hero.style.transform = `rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`;
  });
  hero.addEventListener('pointerleave', () => hero.style.transform = '');
}
