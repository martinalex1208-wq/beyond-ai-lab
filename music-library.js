/**
 * Music Library - Dynamic song grid from songs.json
 * Beyond AI Lab
 *
 * Loads songs via fetch(), renders cards dynamically, supports search and filters.
 * Load More pagination for 300+ songs.
 */

const PAGE_SIZE = 12;
let allSongs = [];
let visibleCount = PAGE_SIZE;

function escapeHtml(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getUniqueTypes(songs) {
  const set = new Set();
  songs.forEach((s) => {
    if (s.type) set.add(s.type);
  });
  return Array.from(set).sort();
}

function getUniqueMoods(songs) {
  const set = new Set();
  songs.forEach((s) => {
    if (Array.isArray(s.mood)) {
      s.mood.forEach((m) => set.add(m));
    } else if (s.mood) {
      set.add(s.mood);
    }
  });
  return Array.from(set).sort();
}

function getFilteredSongs() {
  const search = (document.getElementById('musicSearch')?.value || '').trim().toLowerCase();
  const typeFilter = document.getElementById('typeFilter')?.value || '';
  const moodFilter = document.getElementById('moodFilter')?.value || '';
  const featuredOnly = document.getElementById('featuredOnly')?.checked || false;

  return allSongs.filter((song) => {
    if (featuredOnly && !song.featured) return false;
    if (typeFilter && song.type !== typeFilter) return false;
    if (moodFilter) {
      const moods = Array.isArray(song.mood) ? song.mood : (song.mood ? [song.mood] : []);
      if (!moods.includes(moodFilter)) return false;
    }
    if (search) {
      const searchable = [
        song.title,
        song.summary,
        song.type,
        ...(song.tags || []),
        ...(Array.isArray(song.mood) ? song.mood : (song.mood ? [song.mood] : []))
      ].join(' ').toLowerCase();
      if (!searchable.includes(search)) return false;
    }
    return true;
  });
}

function sortSongs(songs) {
  const sortValue = document.getElementById('sortSelect')?.value || 'newest';
  const arr = [...songs];

  if (sortValue === 'newest') {
    arr.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (sortValue === 'title') {
    arr.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }));
  } else if (sortValue === 'featured') {
    arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
  return arr;
}

function renderSongCard(song) {
  const coverStyle = song.coverImage
    ? `style="background-image: url('${escapeHtml(song.coverImage)}');"`
    : '';
  const coverClass = song.coverImage ? 'music-library-cover music-library-cover--image' : 'music-library-cover';
  const moodChips = Array.isArray(song.mood) ? song.mood : (song.mood ? [song.mood] : []);
  const moodHtml = moodChips.length
    ? moodChips.map((m) => `<span class="music-library-mood-chip">${escapeHtml(m)}</span>`).join('')
    : '';

  const listenBtn = song.sunoUrl && song.sunoUrl !== '#'
    ? `<a href="${escapeHtml(song.sunoUrl)}" class="music-library-btn music-library-btn--listen" target="_blank" rel="noopener">Listen on Suno</a>`
    : `<button type="button" class="music-library-btn music-library-btn--listen" disabled>Listen on Suno</button>`;

  const lyricsBtn = song.hasLyrics && song.lyricsPage
    ? `<a href="${escapeHtml(song.lyricsPage)}" class="music-library-btn music-library-btn--lyrics">View Lyrics</a>`
    : '';

  const badges = [];
  if (song.featured) badges.push('<span class="music-library-badge">Featured</span>');
  if (song.hasLyrics) badges.push('<span class="music-library-badge">Lyrics</span>');
  if (song.hasDetailPage) badges.push('<span class="music-library-badge">Detail</span>');
  const badgesHtml = badges.length ? `<div class="music-library-badges">${badges.join('')}</div>` : '';

  return `
    <article class="music-library-card" data-song-id="${escapeHtml(song.id || '')}">
      <div class="${coverClass}" ${coverStyle} aria-hidden="true"></div>
      <div class="music-library-card-info">
        <span class="music-library-type">${escapeHtml(song.type || '')}</span>
        ${badgesHtml}
        <h3 class="music-library-card-title">${escapeHtml(song.title || '')}</h3>
        <p class="music-library-card-summary">${escapeHtml(song.summary || '')}</p>
        ${moodHtml ? `<div class="music-library-mood-wrap">${moodHtml}</div>` : ''}
        <div class="music-library-card-actions">
          ${listenBtn}
          ${lyricsBtn}
        </div>
      </div>
    </article>
  `;
}

function renderGrid(filtered) {
  const grid = document.getElementById('musicLibraryGrid');
  const empty = document.getElementById('musicLibraryEmpty');
  const loadMoreWrap = document.getElementById('musicLibraryLoadMore');
  if (!grid || !empty) return;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  const toShow = filtered.slice(0, visibleCount);
  grid.innerHTML = toShow.map(renderSongCard).join('');

  if (loadMoreWrap) {
    loadMoreWrap.style.display = visibleCount < filtered.length ? 'block' : 'none';
  }
}

function populateFilters() {
  const types = getUniqueTypes(allSongs);
  const moods = getUniqueMoods(allSongs);

  const typeSelect = document.getElementById('typeFilter');
  const moodSelect = document.getElementById('moodFilter');
  if (!typeSelect || !moodSelect) return;

  types.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    typeSelect.appendChild(opt);
  });
  moods.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    moodSelect.appendChild(opt);
  });
}

function applyFilters() {
  visibleCount = PAGE_SIZE;
  const filtered = getFilteredSongs();
  const sorted = sortSongs(filtered);
  renderGrid(sorted);
}

function loadMore() {
  const filtered = getFilteredSongs();
  const sorted = sortSongs(filtered);
  visibleCount += PAGE_SIZE;
  renderGrid(sorted);
}

function init() {
  fetch('songs.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load songs');
      return res.json();
    })
    .then((data) => {
      allSongs = Array.isArray(data) ? data : [];
      populateFilters();
      applyFilters();
    })
    .catch((err) => {
      console.error('Music Library:', err);
      const grid = document.getElementById('musicLibraryGrid');
      const empty = document.getElementById('musicLibraryEmpty');
      if (grid) grid.innerHTML = '';
      if (empty) {
        empty.textContent = 'Unable to load songs. Please try again later.';
        empty.style.display = 'block';
      }
    });

  document.getElementById('musicSearch')?.addEventListener('input', applyFilters);
  document.getElementById('musicSearch')?.addEventListener('search', applyFilters);
  document.getElementById('typeFilter')?.addEventListener('change', applyFilters);
  document.getElementById('moodFilter')?.addEventListener('change', applyFilters);
  document.getElementById('featuredOnly')?.addEventListener('change', applyFilters);
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);
  document.getElementById('musicLibraryLoadMoreBtn')?.addEventListener('click', loadMore);
}

document.addEventListener('DOMContentLoaded', init);
