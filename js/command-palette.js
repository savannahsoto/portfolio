/* Cmd/Ctrl+K quick-jump palette. Lists the page sections only; the Projects
   and Written Works sections each get a collapsible dropdown to drill into the
   individual entries, while the section itself stays directly navigable. */
function initCommandPalette() {
  const overlay = document.getElementById('paletteOverlay');
  const input = document.getElementById('paletteInput');
  const resultsEl = document.getElementById('paletteResults');
  const trigger = document.getElementById('paletteTrigger');
  if (!overlay) return;

  const CHEVRON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Sections come from the index rail — its hrefs are already correct per page.
  const sections = [];
  document.querySelectorAll('.rail-list a').forEach((a) => {
    const label = a.querySelector('.rail-label')?.textContent.replace(/\s+/g, ' ').trim() || a.textContent.trim();
    const section = { label, href: a.getAttribute('href'), children: [] };
    if (/project/i.test(label) && typeof PROJECTS !== 'undefined') {
      section.children = PROJECTS.map((p) => ({ label: p.title, href: `projects.html#${p.id}` }));
    } else if (/writ/i.test(label) && typeof WRITINGS !== 'undefined') {
      section.children = WRITINGS.map((w) => ({ label: w.title, href: `writing.html#${w.id}` }));
    }
    sections.push(section);
  });

  const expanded = new Set(); // labels of sections the user has opened

  function render(rawQuery) {
    const q = (rawQuery || '').trim().toLowerCase();
    let html = '';

    sections.forEach((s) => {
      const labelMatch = s.label.toLowerCase().includes(q);
      const childMatches = s.children.filter((c) => c.label.toLowerCase().includes(q));
      if (q && !labelMatch && childMatches.length === 0) return;

      const hasChildren = s.children.length > 0;
      // Show the dropdown when a search matched children, or the user opened it.
      const showChildren = hasChildren && ((q && childMatches.length > 0) || (!q && expanded.has(s.label)));

      html += `<li class="palette-section">
        <a href="${s.href}" class="palette-link">${s.label}<span class="kind">Section</span></a>
        ${hasChildren ? `<button class="palette-expand${showChildren ? ' is-open' : ''}" data-section="${s.label}" aria-label="Toggle ${s.label} list" aria-expanded="${showChildren}">${CHEVRON}</button>` : ''}
      </li>`;

      if (showChildren) {
        const kids = q ? childMatches : s.children;
        html += `<li class="palette-children"><ul>${kids
          .map((c) => `<li><a href="${c.href}">${c.label}</a></li>`)
          .join('')}</ul></li>`;
      }
    });

    resultsEl.innerHTML = html || '<li class="palette-empty">No matches.</li>';
    resultsEl.querySelector('a')?.classList.add('active');
  }

  function open() {
    overlay.classList.add('open');
    input.value = '';
    expanded.clear();
    render('');
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    overlay.classList.remove('open');
  }

  trigger?.addEventListener('click', () => {
    overlay.classList.contains('open') ? close() : open();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    } else if (e.key === 'Escape') {
      close();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  resultsEl.addEventListener('click', (e) => {
    const expandBtn = e.target.closest('.palette-expand');
    if (expandBtn) {
      e.preventDefault();
      const key = expandBtn.dataset.section;
      expanded.has(key) ? expanded.delete(key) : expanded.add(key);
      render(input.value);
      return;
    }
    if (e.target.closest('a')) close(); // let the link navigate
  });

  input?.addEventListener('input', () => render(input.value));

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const active = resultsEl.querySelector('a');
      if (active) window.location.href = active.getAttribute('href');
    }
  });
}
