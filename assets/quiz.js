/* Simple quiz interaction — click an option to reveal answer */
(function () {
  function reveal(card) {
    card.classList.add('revealed');
  }

  // Inject a "Show answer" button into each .exercise so the answer/output
  // is hidden by default and revealed on click.
  function injectExerciseButtons() {
    document.querySelectorAll('.exercise').forEach(function (ex) {
      if (ex.querySelector('.show-answer-btn')) return;
      var hasHidden = ex.querySelector('.answer-box, .output, .answer-line, pre.answer-code');
      if (!hasHidden) return;
      var btn = document.createElement('button');
      btn.className = 'show-answer-btn';
      btn.type = 'button';
      btn.textContent = 'Show answer';
      ex.appendChild(btn);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectExerciseButtons);
  } else {
    injectExerciseButtons();
  }

  document.addEventListener('click', function (e) {
    // Show-answer for exercises
    var showBtn = e.target.closest('.show-answer-btn');
    if (showBtn) {
      var ex = showBtn.closest('.exercise');
      if (ex) ex.classList.add('revealed');
      return;
    }

    const card = e.target.closest('.quiz-card');
    if (!card) return;
    if (card.classList.contains('revealed')) return;

    const opt = e.target.closest('.opt');
    const btn = e.target.closest('.reveal-btn');

    if (opt) {
      card.querySelectorAll('.opt.selected').forEach(function (o) {
        o.classList.remove('selected');
      });
      opt.classList.add('selected');
      reveal(card);
      return;
    }
    if (btn) reveal(card);
  });

  // Keyboard 1-9 to pick an option in the focused card (when only one is on screen).
  // Skipped if user is typing.
  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key < '1' || e.key > '9') return;
    // Pick the card whose center is nearest the viewport center
    const cards = Array.from(document.querySelectorAll('.quiz-card:not(.revealed)'));
    if (!cards.length) return;
    const vh = window.innerHeight;
    const center = vh / 2;
    let best = null, bestDist = Infinity;
    cards.forEach(function (c) {
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const cy = (r.top + r.bottom) / 2;
      const d = Math.abs(cy - center);
      if (d < bestDist) { bestDist = d; best = c; }
    });
    if (!best) return;
    const idx = parseInt(e.key, 10) - 1;
    const opts = best.querySelectorAll('.opt');
    if (opts[idx]) {
      e.preventDefault();
      opts[idx].click();
    }
  });
})();
