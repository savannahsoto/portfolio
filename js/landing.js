/* No cursor-trail sparkles on the cover — sparkles.js is still loaded here
   only so the Konami easter egg's confetti works. */

window.addEventListener('DOMContentLoaded', () => {
  const enterLink = document.getElementById('enterLink');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Cross-document view transitions animate the navigation themselves; the
  // pagereveal event is a reliable proxy for that support. When present, we let
  // the browser drive the transition (crossfade + name morph) and don't animate
  // in JS. Otherwise we run the fallback exit fade below.
  const hasViewTransitions = 'onpagereveal' in window;

  enterLink?.addEventListener('click', (e) => {
    const dest = enterLink.getAttribute('href');

    // Flag the arrival so the home page can play its fallback entrance stagger.
    try { sessionStorage.setItem('coverEnter', '1'); } catch (_) {}

    // View-transition browsers (and reduced-motion) navigate normally — don't
    // preventDefault, or the cross-document transition won't fire.
    if (hasViewTransitions || reduceMotion) return;

    // Fallback: lift-and-fade the cover, then navigate.
    e.preventDefault();
    document.body.classList.add('cover-leaving');
    setTimeout(() => { window.location.href = dest; }, 380);
  });
});
