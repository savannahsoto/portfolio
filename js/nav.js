/* Shared across portfolio.html, projects.html, writing.html: mobile index
   toggle and the back-to-top button. */
function initSharedNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const toTop = document.getElementById('toTop');

  navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('open')));

  function onScroll() {
    toTop?.classList.toggle('show', window.scrollY > 500);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
