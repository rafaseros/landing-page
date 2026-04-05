function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el: HTMLElement): void {
  const target = parseInt(el.dataset.counterTarget || '0', 10);
  const suffix = el.dataset.counterSuffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now: number): void {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutCubic(progress) * target);
    el.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initCounters(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll<HTMLElement>('[data-counter-target]');

  if (prefersReducedMotion) {
    counters.forEach(el => {
      el.textContent = (el.dataset.counterTarget || '0') + (el.dataset.counterSuffix || '');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initCounters);
