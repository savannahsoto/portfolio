/* Renders project + writing entries from js/data.js as a numbered editorial
   index list (not cards) — hairline dividers, thin-line icons, inline expand. */

const ICONS = {
  chip: '<rect x="7" y="7" width="10" height="10" rx="1" stroke-width="1.25"/><path d="M9 3.5v3M15 3.5v3M9 17.5v3M15 17.5v3M3.5 9h3M3.5 15h3M17.5 9h3M17.5 15h3" stroke-width="1.25" stroke-linecap="round"/>',
  layers: '<path d="M12 3l8 4-8 4-8-4 8-4z" stroke-width="1.25" stroke-linejoin="round"/><path d="M4 12l8 4 8-4M4 16l8 4 8-4" stroke-width="1.25" stroke-linejoin="round"/>',
  'layers-alt': '<rect x="4" y="4" width="16" height="16" rx="1" stroke-width="1.25"/><path d="M8 9h8M8 13h5" stroke-width="1.25" stroke-linecap="round"/>',
  clock: '<circle cx="12" cy="12" r="8.5" stroke-width="1.25"/><path d="M12 7.5v5l3.5 2" stroke-width="1.25" stroke-linecap="round"/>',
  home: '<path d="M4 11l8-6.5 8 6.5" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9.5h12V10" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>',
  robot: '<rect x="5" y="9" width="14" height="10" rx="1.5" stroke-width="1.25"/><path d="M9 14h.01M15 14h.01" stroke-width="2" stroke-linecap="round"/><path d="M12 9V5.5M9.5 5h5" stroke-width="1.25" stroke-linecap="round"/>',
  battery: '<rect x="3.5" y="8" width="15" height="8" rx="1.5" stroke-width="1.25"/><path d="M20.5 11v2" stroke-width="1.25" stroke-linecap="round"/><path d="M7 12h6" stroke-width="1.25" stroke-linecap="round"/>',
  'heart-chip': '<path d="M12 18.5s-6.3-3.8-6.3-8.6C5.7 6.8 7.8 5 9.9 5.7c.8.3 1.5.9 2.1 1.8.6-.9 1.3-1.5 2.1-1.8 2.1-.7 4.2 1.1 4.2 4.2 0 4.8-6.3 8.6-6.3 8.6z" stroke-width="1.25" stroke-linejoin="round"/>'
};

const EXTERNAL_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEVRON_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" stroke-linecap="round">${ICONS[name] || ICONS.chip}</svg>`;
}

function renderProjectCard(p, index) {
  const num = String(index + 1).padStart(2, '0');
  const pinNote = p.pinned ? `<span class="marginalia entry-pin">pinned</span>` : '';
  const tags = p.tags.map((t) => `<span class="tag">${t}</span>`).join('');
  const links = p.links
    .map((l) => `<a href="${l.url}" class="entry-link" target="_blank" rel="noopener">${l.label} ${EXTERNAL_ICON}</a>`)
    .join('');
  const iconMarkup = p.image
    ? `<img src="${p.image}" alt="" class="entry-thumb">`
    : svgIcon(p.icon);
  const challenge = p.back && p.back.challenge
    ? `<div class="entry-detail-challenge"><h4>The challenge</h4><p>${p.back.challenge}</p></div>`
    : '';

  return `
  <article class="entry-row" id="${p.id}" data-id="${p.id}">
    <button class="entry-head" aria-expanded="false">
      <span class="entry-num">P.${num}</span>
      <span class="entry-icon">${iconMarkup}</span>
      <span class="entry-title">
        ${p.title}
        ${pinNote}
      </span>
      <span class="entry-tags">${tags}</span>
      <span class="entry-chevron">${CHEVRON_ICON}</span>
    </button>
    <div class="entry-detail">
      <div class="entry-detail-inner">
        <p>${p.blurb}</p>
        ${challenge}
        <div class="entry-links">${links}</div>
      </div>
    </div>
  </article>`;
}

function renderWritingCard(w, index) {
  const num = String(index + 1).padStart(2, '0');
  const pinNote = w.pinned ? `<span class="marginalia entry-pin">pinned</span>` : '';
  return `
  <a href="${w.url}" class="entry-row entry-row-link" id="${w.id}" target="_blank" rel="noopener" data-id="${w.id}">
    <span class="entry-num">W.${num}</span>
    <span class="tag tag-type">${w.type}</span>
    <span class="entry-title">
      ${w.title}
      ${pinNote}
      <span class="entry-meta">${w.venue} · ${w.date}</span>
    </span>
    <span class="entry-blurb">${w.blurb}</span>
    <span class="entry-chevron">${EXTERNAL_ICON}</span>
  </a>`;
}

function mountProjects(container, list) {
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<p class="empty-entry">New projects coming soon.</p>';
    return;
  }
  container.innerHTML = list.map(renderProjectCard).join('');
}

function mountWritings(container, list) {
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<p class="empty-entry">New written works coming soon.</p>';
    return;
  }
  container.innerHTML = list.map(renderWritingCard).join('');
}

function attachProjectBehaviors(root = document) {
  root.querySelectorAll('.entry-head').forEach((head) => {
    head.addEventListener('click', () => {
      const row = head.closest('.entry-row');
      const isOpen = row.classList.toggle('open');
      head.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

function observeReveal(root = document) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  root.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
