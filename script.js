const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const progress = document.getElementById('progress');
const updateProgress = () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progress) progress.style.width = `${pct}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const canTilt = window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canTilt) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const max = Number(card.dataset.maxTilt || 5);
    let raf = 0;

    const move = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rx = (-y * max).toFixed(2);
      const ry = (x * max).toFixed(2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
    };

    const leave = () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    };

    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
  });

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.07;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.07;
      el.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
