/* videos-render.js — renders the YouTube videos grid above chapter content.
 *
 * Reads window.VIDEOS (from videos.js) and window.CURRENT_CHAPTER, picks
 * videos for that chapter, and inserts a section with thumbnails + titles
 * directly under <header class="topbar">.
 *
 * Each card is a plain <a> opening YouTube in a new tab — no iframes are
 * loaded on page render (keeps page weight tiny; iframes would block paint).
 */
(function () {
  function init() {
    var num = window.CURRENT_CHAPTER;
    var all = window.VIDEOS || [];
    if (typeof num !== 'number' || all.length === 0) return;

    // Pick videos matching this chapter; section videos first, reviews after.
    var mine = all.filter(function (v) { return v.chapter === num; });
    if (mine.length === 0) return;
    mine.sort(function (a, b) {
      if (a.review !== b.review) return a.review ? 1 : -1;
      return a.title.localeCompare(b.title);
    });

    // Strip the "AASU/ENG207 - " prefix for cleaner display.
    function clean(t) {
      return t.replace(/^AASU\/ENG207\s*-?\s*/i, '').trim();
    }

    var section = document.createElement('section');
    section.className = 'video-section';
    section.innerHTML =
      '<h2>📺 Video Reviews</h2>' +
      '<div class="video-grid"></div>';

    var grid = section.querySelector('.video-grid');
    // Two rows, row-major (L→R, then wrap to next row). Column count = ⌈N/2⌉.
    var cols = Math.ceil(mine.length / 2);
    var cardW = window.matchMedia('(max-width: 600px)').matches ? 175 : 210;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', ' + cardW + 'px)';
    mine.forEach(function (v) {
      var a = document.createElement('a');
      a.className = 'video-card' + (v.review ? ' is-review' : '');
      a.href = 'https://www.youtube.com/watch?v=' + v.id;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML =
        '<div class="thumb">' +
          '<img loading="lazy" src="https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg" alt="">' +
          '<span class="play">▶</span>' +
          (v.review ? '<span class="review-tag">Review</span>' : '') +
        '</div>' +
        '<div class="vtitle">' + escapeHtml(clean(v.title)) + '</div>';
      grid.appendChild(a);
    });

    var main = document.querySelector('main');
    if (main && main.firstChild) main.insertBefore(section, main.firstChild);
    else if (main) main.appendChild(section);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
