/* ══════════════════════════════════════════
   ECH Myanmar — YouTube-style Video Page
══════════════════════════════════════════ */

const VIDEOS = [
  {
    id: 'nGKLLDA4OmI',
    cat: 'sdg',
    catLabel: 'SDG',
    title: 'UN Sustainable Development Goals (SDGs)',
    channel: 'United Nations',
    level: 'All Levels',
    duration: '0:46',
    durationFull: '46 sec',
  },
  {
 id: '2YjVDRv0fjw',
  cat: 'Cinematic',
  catLabel: 'Grammar',
  title: 'ECH UCSTgi Short Film',
  channel: 'ECH UCSTgi',
  level: '-',
  duration: '3:41',
  durationFull: '3 min',
},
  {
    id: 'FvnJ5PQEYhw',
    cat: 'listening',
    catLabel: 'Listening',
    title: 'English Listening Practice — Natural Conversations',
    channel: 'ECH Myanmar',
    level: 'Intermediate',
    duration: '30:00',
    durationFull: '30 min',
  },
  {
    id: '8ixFxoFZHzw',
    cat: 'grammar',
    catLabel: 'Grammar',
    title: 'English Grammar for Beginners — Complete Lesson',
    channel: 'ECH Myanmar',
    level: 'Beginner',
    duration: '45:00',
    durationFull: '45 min',
  },
  {
    id: 'o9tmHCVqWyY',
    cat: 'pronunciation',
    catLabel: 'Pronunciation',
    title: 'English Pronunciation — Fixing Common Mistakes',
    channel: 'ECH Myanmar',
    level: 'All Levels',
    duration: '15:00',
    durationFull: '15 min',
  },
];

/* ── LocalStorage ── */
const LS_LIKES = 'ech_likes';
const LS_SAVED = 'ech_saved';
const getLikes  = () => { try { return JSON.parse(localStorage.getItem(LS_LIKES) || '[]'); } catch { return []; } };
const getSaved  = () => { try { return JSON.parse(localStorage.getItem(LS_SAVED) || '[]'); } catch { return []; } };
const setLikes  = a  => localStorage.setItem(LS_LIKES, JSON.stringify(a));
const setSaved  = a  => localStorage.setItem(LS_SAVED, JSON.stringify(a));
const isLiked   = id => getLikes().includes(id);
const isSaved   = id => getSaved().includes(id);

function toggleLike(id) {
  const a = getLikes(), i = a.indexOf(id);
  if (i === -1) a.push(id); else a.splice(i, 1);
  setLikes(a);
  return i === -1;
}
function toggleSave(id) {
  const a = getSaved(), i = a.indexOf(id);
  if (i === -1) a.push(id); else a.splice(i, 1);
  setSaved(a);
  return i === -1;
}

/* ── State ── */
let activeFilter = 'all';
let searchQuery  = '';

/* ── DOM refs ── */
const grid       = document.getElementById('videoGrid');
const noResults  = document.getElementById('noResults');
const countEl    = document.getElementById('resultCount');
const searchInput= document.getElementById('searchInput');
const searchClear= document.getElementById('searchClear');

/* ── Hamburger ── */
const hamburger   = document.getElementById('hamburger');
const navDropdown = document.getElementById('navDropdown');
hamburger.addEventListener('click', () => {
  const open = navDropdown.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
navDropdown.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navDropdown.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !navDropdown.contains(e.target)) {
    navDropdown.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ── Search ── */
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  searchClear.classList.toggle('visible', searchQuery.length > 0);
  applyFilters();
});
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') clearSearch();
});
searchClear.addEventListener('click', clearSearch);
function clearSearch() {
  searchInput.value = '';
  searchQuery = '';
  searchClear.classList.remove('visible');
  searchInput.blur();
  applyFilters();
}

/* ── Filter pills ── */
document.querySelectorAll('.fpill').forEach(pill => {
  pill.addEventListener('click', () => {
    activeFilter = pill.dataset.filter;
    document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    pill.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    applyFilters();
  });
});

/* ── Apply filters ── */
function applyFilters() {
  let visible = 0;
  document.querySelectorAll('.vid-card').forEach(card => {
    const cat   = card.dataset.cat;
    const title = card.dataset.title.toLowerCase();
    const catOk   = activeFilter === 'all' || cat === activeFilter;
    const queryOk = !searchQuery || title.includes(searchQuery) || cat.includes(searchQuery);
    const show = catOk && queryOk;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  if (countEl) {
    countEl.innerHTML = `<strong>${visible}</strong> video${visible !== 1 ? 's' : ''}`;
  }
  noResults.classList.toggle('visible', visible === 0);
}

/* ── Build grid cards ── */
function buildCards() {
  VIDEOS.forEach(video => {
    const thumbUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
    const ytUrl    = `https://www.youtube.com/watch?v=${video.id}`;
    const liked    = isLiked(video.id);
    const saved    = isSaved(video.id);
    const initials = video.channel.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const card = document.createElement('div');
    card.className = 'vid-card fade-in';
    card.dataset.cat   = video.cat;
    card.dataset.title = video.title;
    card.dataset.id    = video.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Play: ' + video.title);

    card.innerHTML = `
      <div class="vid-thumb">
        <img class="thumb-img" src="${thumbUrl}" alt="${video.title}" loading="lazy" />
        <div class="duration-badge">${video.duration}</div>
        <div class="play-overlay" aria-hidden="true">
          <div class="play-circle-sm">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="card-actions">
          <button class="card-icon-btn card-like-btn ${liked ? 'liked' : ''}" data-id="${video.id}" aria-label="Like" title="Like" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <button class="card-icon-btn card-save-btn ${saved ? 'saved' : ''}" data-id="${video.id}" aria-label="Save" title="Watch Later" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24"><path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"/></svg>
          </button>
        </div>
      </div>
      <div class="vid-body">
        <div class="vid-avatar">${initials}</div>
        <div class="vid-text">
          <div class="vid-title">${video.title}</div>
          <div class="vid-channel">${video.channel}</div>
          <div class="vid-meta-row">${video.level} · ${video.durationFull}</div>
        </div>
      </div>
    `;

    /* Open modal on click/key */
    card.addEventListener('click', () => openModal(video));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(video); }
    });

    /* Card like */
    card.querySelector('.card-like-btn').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const nowLiked = toggleLike(video.id);
      btn.classList.toggle('liked', nowLiked);
      syncModalLike(video.id, nowLiked);
      showToast(nowLiked ? '❤️ Liked' : 'Removed from likes');
    });

    /* Card save */
    card.querySelector('.card-save-btn').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const nowSaved = toggleSave(video.id);
      btn.classList.toggle('saved', nowSaved);
      syncModalSave(video.id, nowSaved);
      showToast(nowSaved ? '🔖 Saved to Watch Later' : 'Removed from Watch Later');
    });

    grid.insertBefore(card, noResults);
  });
}

/* ── Featured bar like/save (first video) ── */
function initFeatured() {
  const video = VIDEOS[0];
  const likeBtn = document.getElementById('featuredLike');
  const saveBtn = document.getElementById('featuredSave');

  if (!likeBtn || !saveBtn) return;

  likeBtn.classList.toggle('liked', isLiked(video.id));
  saveBtn.classList.toggle('saved', isSaved(video.id));

  likeBtn.addEventListener('click', () => {
    const nowLiked = toggleLike(video.id);
    likeBtn.classList.toggle('liked', nowLiked);
    syncCardLike(video.id, nowLiked);
    showToast(nowLiked ? '❤️ Liked' : 'Removed from likes');
  });
  saveBtn.addEventListener('click', () => {
    const nowSaved = toggleSave(video.id);
    saveBtn.classList.toggle('saved', nowSaved);
    syncCardSave(video.id, nowSaved);
    showToast(nowSaved ? '🔖 Saved to Watch Later' : 'Removed from Watch Later');
  });
}

/* ── Sync helpers ── */
function syncCardLike(id, state) {
  document.querySelectorAll(`.card-like-btn[data-id="${id}"]`).forEach(b => b.classList.toggle('liked', state));
}
function syncCardSave(id, state) {
  document.querySelectorAll(`.card-save-btn[data-id="${id}"]`).forEach(b => b.classList.toggle('saved', state));
}
function syncModalLike(id, state) {
  const btn = document.getElementById('modalLike');
  if (btn && btn.dataset.id === id) btn.classList.toggle('liked', state);
  if (id === VIDEOS[0].id) document.getElementById('featuredLike')?.classList.toggle('liked', state);
}
function syncModalSave(id, state) {
  const btn = document.getElementById('modalSave');
  if (btn && btn.dataset.id === id) btn.classList.toggle('liked', state);
  if (id === VIDEOS[0].id) document.getElementById('featuredSave')?.classList.toggle('saved', state);
}

/* ── Modal ── */
const modalOverlay = document.getElementById('videoModal');
const modalBox     = document.getElementById('modalBox');
const modalIframe  = document.getElementById('modalIframe');
const modalLoader  = document.getElementById('modalLoader');
const modalClose   = document.getElementById('modalClose');
const modalTitle   = document.getElementById('modalTitle');
const modalMeta    = document.getElementById('modalMeta');
const modalYtLink  = document.getElementById('modalYtLink');
const modalLikeBtn = document.getElementById('modalLike');
const modalSaveBtn = document.getElementById('modalSave');

function openModal(video) {
  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
  const ytUrl    = `https://www.youtube.com/watch?v=${video.id}`;

  modalTitle.textContent = video.title;
  modalMeta.textContent  = `${video.channel} · ${video.level} · ${video.durationFull}`;
  modalYtLink.href       = ytUrl;

  modalLikeBtn.dataset.id = video.id;
  modalSaveBtn.dataset.id = video.id;
  modalLikeBtn.classList.toggle('liked', isLiked(video.id));
  modalSaveBtn.classList.toggle('saved', isSaved(video.id));

  modalLoader.classList.remove('hidden');
  modalIframe.src = '';

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    setTimeout(() => { modalIframe.src = embedUrl; }, 100);
  });

  modalClose.focus();
}

modalIframe.addEventListener('load', () => modalLoader.classList.add('hidden'));

function closeModal() {
  modalOverlay.classList.remove('open');
  modalIframe.src = '';
  modalLoader.classList.remove('hidden');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* Swipe down to close */
let touchStartY = 0;
modalBox.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
modalBox.addEventListener('touchend', e => {
  if (e.changedTouches[0].clientY - touchStartY > 80) closeModal();
}, { passive: true });

/* Modal like/save */
modalLikeBtn.addEventListener('click', () => {
  const id = modalLikeBtn.dataset.id;
  const nowLiked = toggleLike(id);
  modalLikeBtn.classList.toggle('liked', nowLiked);
  syncCardLike(id, nowLiked);
  if (id === VIDEOS[0].id) document.getElementById('featuredLike')?.classList.toggle('liked', nowLiked);
  showToast(nowLiked ? '❤️ Liked' : 'Removed from likes');
});
modalSaveBtn.addEventListener('click', () => {
  const id = modalSaveBtn.dataset.id;
  const nowSaved = toggleSave(id);
  modalSaveBtn.classList.toggle('saved', nowSaved);
  syncCardSave(id, nowSaved);
  if (id === VIDEOS[0].id) document.getElementById('featuredSave')?.classList.toggle('saved', nowSaved);
  showToast(nowSaved ? '🔖 Saved to Watch Later' : 'Removed from Watch Later');
});

/* ── Fade-in observer ── */
const fadeIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeIO.unobserve(e.target); }
  });
}, { threshold: 0.08 });

/* ── No results clear ── */
document.getElementById('noResultsBtn')?.addEventListener('click', () => {
  clearSearch();
  activeFilter = 'all';
  document.querySelectorAll('.fpill').forEach((p, i) => p.classList.toggle('active', i === 0));
  applyFilters();
});

/* ── Toast ── */
let toastTimer = null;
function showToast(msg) {
  let t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ── Init ── */
buildCards();
document.querySelectorAll('.vid-card.fade-in').forEach(el => fadeIO.observe(el));
const featuredWrap = document.querySelector('.featured-wrap');
if (featuredWrap) fadeIO.observe(featuredWrap);
applyFilters();
initFeatured();
