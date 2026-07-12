/* Konami code: ↑ ↑ ↓ ↓ ← → ← → B A */
(function () {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let idx = 0;

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = seq[idx];
    if (key === expected) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        triggerKonami();
      }
    } else {
      idx = key === seq[0] ? 1 : 0;
    }
  });

  function triggerKonami() {
    if (window.confettiBurst) window.confettiBurst();
    showModal();
  }

  function showModal() {
    let modal = document.getElementById('konamiModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'konamiModal';
      modal.className = 'konami-modal';
      modal.innerHTML = `
        <div class="konami-card">
          <p class="index-tag"><span class="num">Easter egg</span> Found</p>
          <h3>You found the secret.</h3>
          <p>Most people skim a portfolio — you went digging for easter eggs. That kind of curiosity
          is exactly what I bring to debugging circuits (and code) at 2am.</p>
          <button class="btn btn-primary" id="konamiClose">Back to the archive</button>
        </div>`;
      document.body.appendChild(modal);
      modal.querySelector('#konamiClose').addEventListener('click', () => modal.classList.remove('show'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }
    modal.classList.add('show');
  }
})();
