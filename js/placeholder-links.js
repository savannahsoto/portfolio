/* This template ships with placeholder hrefs ("#") for links you haven't
   filled in yet (GitHub, LinkedIn, project repos...). Left alone, href="#"
   silently jerks the page to the top on click, which reads as a dead link.
   This intercepts those clicks and explains what's going on instead. */
(function () {
  let toast;
  let hideTimer;

  function showPlaceholderToast() {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = 'This is a placeholder link — add your real URL in js/data.js or the HTML.';
    toast.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && a.getAttribute('href') === '#') {
      e.preventDefault();
      showPlaceholderToast();
    }
  });
})();
