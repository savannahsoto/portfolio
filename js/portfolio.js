initSparkles({ every: 90 });

// The fallback arrival entrance is pure CSS (see [data-enter] in base.css),
// gated by the .arriving-from-cover class the head script set pre-paint. Once
// the stagger has played, drop the class so it can't affect later interactions.
if (document.documentElement.classList.contains('arriving-from-cover')) {
  setTimeout(() => document.documentElement.classList.remove('arriving-from-cover'), 900);
}

window.addEventListener('DOMContentLoaded', () => {
  initSharedNav();
  initProgressBar();
  initCommandPalette();
  initTerminal();

  // Featured/pinned items first, on the homepage.
  mountProjects(document.getElementById('projectList'), PROJECTS.filter((p) => p.pinned));
  mountWritings(document.getElementById('writingList'), WRITINGS.filter((w) => w.pinned));
  attachProjectBehaviors();
  observeReveal();

  // Index-rail highlight: follows scroll position, and also lights up whichever
  // section the mouse is hovering over (hover wins until the next scroll).
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('[data-nav]');
  function setActive(id) {
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  }
  function onScrollSpy() {
    let currentId = sections[0]?.id;
    const offset = 90;
    sections.forEach((sec) => {
      if (sec.getBoundingClientRect().top - offset <= 0) currentId = sec.id;
    });
    setActive(currentId);
  }
  document.addEventListener('scroll', onScrollSpy, { passive: true });
  sections.forEach((sec) => {
    sec.addEventListener('mouseenter', () => setActive(sec.id));
  });
  onScrollSpy();

  // copy email
  const copyBtn = document.getElementById('copyEmailBtn');
  const githubLink = document.getElementById('githubLink');
  const linkedinLink = document.getElementById('linkedinLink');
  const toast = document.getElementById('toast');
  const contact = typeof CONTACT !== 'undefined' ? CONTACT : {};
  const email = contact.email || '';

  if (copyBtn) {
    copyBtn.firstChild.textContent = email || 'Email coming soon';
  }
  if (githubLink && contact.github) {
    githubLink.href = contact.github;
  }
  if (linkedinLink && contact.linkedin) {
    linkedinLink.href = contact.linkedin;
  }

  copyBtn?.addEventListener('click', () => {
    if (!email) {
      toast.textContent = 'Add your email in js/data.js';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
      return;
    }
    navigator.clipboard?.writeText(email).catch(() => {});
    toast.textContent = 'Copied';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  });
});
