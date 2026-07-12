/* Thin fixed bar under the top of the viewport showing scroll progress
   through the current page — a nod to a printed magazine's page marker. */
function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  function update() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
