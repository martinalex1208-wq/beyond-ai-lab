/**
 * Music Lab - Song Gallery with Category Filter
 * Beyond AI Lab v2
 *
 * To add your real songs: Edit the SONGS array below.
 * Each song needs: title, category, description, link, cover
 * - cover: image URL, or leave empty for placeholder
 * - link: URL to listen (e.g. Spotify, YouTube), or "#" for placeholder
 */

const SONGS = [
  {
    title: 'Hearts in Harmony',
    category: 'charity',
    description: '溫暖人心的公益主題曲，傳遞希望與關懷。',
    link: '#',
    cover: ''
  },
  {
    title: 'Open Road',
    category: 'cycling',
    description: '騎行時的節奏感，自由馳騁的暢快旋律。',
    link: '#',
    cover: ''
  },
  {
    title: 'Side by Side',
    category: 'friendship',
    description: '獻給摯友的輕快小品，紀念一起走過的日子。',
    link: '#',
    cover: ''
  },
  {
    title: 'Everyday Moments',
    category: 'life',
    description: '捕捉日常生活中的美好與感動。',
    link: '#',
    cover: ''
  },
  {
    title: 'Rise Again',
    category: 'inspirational',
    description: '激勵人心的勵志旋律，突破困境的力量。',
    link: '#',
    cover: ''
  },
  {
    title: 'Digital Dreams',
    category: 'experimental',
    description: '探索 AI 音樂的邊界，電子與古典的融合。',
    link: '#',
    cover: ''
  },
  {
    title: 'Light the Way',
    category: 'charity',
    description: '為弱勢發聲，用音樂點亮黑暗。',
    link: '#',
    cover: ''
  },
  {
    title: 'Wind in My Hair',
    category: 'cycling',
    description: '迎風前行的輕快節奏，享受速度與自由。',
    link: '#',
    cover: ''
  },
  {
    title: 'Together We Stand',
    category: 'friendship',
    description: '友誼萬歲，夥伴們並肩前行的主題曲。',
    link: '#',
    cover: ''
  },
  {
    title: 'Seasons of Change',
    category: 'life',
    description: '人生如四季流轉，接納變化與成長。',
    link: '#',
    cover: ''
  },
  {
    title: 'Beyond Limits',
    category: 'inspirational',
    description: '突破自我，超越想像的極限。',
    link: '#',
    cover: ''
  },
  {
    title: 'Neural Symphony',
    category: 'experimental',
    description: 'AI 神經網路生成的實驗性交響樂。',
    link: '#',
    cover: ''
  }
];

/** Category display names (for UI) */
const CATEGORY_LABELS = {
  charity: 'Charity',
  cycling: 'Cycling',
  friendship: 'Friendship',
  life: 'Life',
  inspirational: 'Inspirational',
  experimental: 'Experimental'
};

function renderSongCard(song) {
  const coverStyle = song.cover
    ? `style="background-image: url('${song.cover}'); background-size: cover;"`
    : '';
  const coverClass = song.cover ? 'song-cover song-cover--image' : 'song-cover';
  const listenEl = song.link && song.link !== '#'
    ? `<a href="${song.link}" class="btn-listen" target="_blank" rel="noopener">Listen</a>`
    : `<button type="button" class="btn-listen">Listen</button>`;

  return `
    <article class="song-card" data-category="${song.category}">
      <div class="${coverClass}" ${coverStyle} aria-hidden="true"></div>
      <div class="song-info">
        <span class="song-category">${CATEGORY_LABELS[song.category] || song.category}</span>
        <h3 class="song-title">${song.title}</h3>
        <p class="song-desc">${song.description}</p>
        ${listenEl}
      </div>
    </article>
  `;
}

function renderSongGrid() {
  const grid = document.getElementById('song-grid');
  if (!grid) return;

  grid.innerHTML = SONGS.map(renderSongCard).join('');
}

function init() {
  renderSongGrid();

  const filterBtns = document.querySelectorAll('.filter-btn');
  const songGrid = document.getElementById('song-grid');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const songCards = songGrid.querySelectorAll('.song-card');
      songCards.forEach((card) => {
        const category = card.dataset.category;
        const match = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
