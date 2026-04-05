function initMobileMenu(): void {
  const button = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  if (!button || !menu) return;

  let isOpen = false;

  function open(): void {
    isOpen = true;
    menu!.classList.remove('hidden');
    menu!.classList.add('menu-open');
    backdrop?.classList.remove('hidden');
    button!.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus first link
    const firstLink = menu!.querySelector('a');
    firstLink?.focus();
  }

  function close(): void {
    isOpen = false;
    menu!.classList.remove('menu-open');
    menu!.classList.add('hidden');
    backdrop?.classList.add('hidden');
    button!.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    button!.focus();
  }

  button.addEventListener('click', () => {
    if (isOpen) close(); else open();
  });

  backdrop?.addEventListener('click', close);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Focus trap
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !isOpen) return;
    const focusable = menu!.querySelectorAll<HTMLElement>('a, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);
