/**
 * Creation Stats - Live metrics dashboard
 */
const GENERATED_PROMPTS_KEY = 'beyond-ai-lab-generated-count';
const PROMPTS_PATH = './data/prompts.json';
const IMAGES_PATH  = './data/images.json';
const SONGS_PATH   = './data/songs.json';
const STORIES_PATH = './data/stories.json';
let AI_SONGS_COUNT = 0;
fetch('songs.json').then(r=>r.json()).then(data=>{if(Array.isArray(data)){AI_SONGS_COUNT=data.length;const el=document.getElementById('statSongCount');if(el)el.textContent=String(AI_SONGS_COUNT);}}).catch(()=>{});

/**
 * Featured Works - Artworks from Visual Lab marked as featured
 */
const ARTWORK_METADATA_KEY = 'beyond-ai-lab-artwork-metadata';
const ARTWORK_CUSTOM_KEY = 'beyond-ai-lab-artwork-custom';
const GALLERY_IMAGES = [
  'ai_girl_01.png', 'ai_girl_02.png', 'ai_girl_03.png', 'ai_girl_04.jpg', 'ai_girl_05.jpg', 'ai_girl_06.jpg',
  'ai_girl_07.jpg', 'ai_girl_08.jpg', 'ai_girl_09.jpg', 'ai_girl_10.jpg', 'ai_girl_11.jpg', 'ai_girl_12.jpg',
  'ai_girl_13.jpg', 'ai_girl_14.jpg', 'ai_girl_15.jpg', 'ai_girl_16.jpg', 'ai_girl_17.jpg', 'ai_girl_18.jpg',
  'ai_girl_bohemian_01.png', 'ai_girl_bohemian_02.png', 'ai_girl_coffee-01.jpg', 'ai_girl_coffee-02.jpg',
  'ai_girl_european_01.png', 'ai_girl_european_02.png', 'interior_modern_01.jpg', 'interior_modern_02.jpg',
  'scifi_city_01.jpg', 'scifi_city_02.jpg', 'warrior_snow_01.jpg', 'warrior_snow_02.jpg', 'warrior_snow_03.jpg', 'warrior_snow_04.jpg'
];
const CATEGORY_DISPLAY = { female: 'AI Girl', warrior: 'Fantasy Warrior', scifi: 'SciFi Visual', interior: 'Interior Design', ai: 'AI Girl' };
const TITLE_FORMAT = { ai: 'AI', girl: 'Girl', warrior: 'Warrior', scifi: 'SciFi', coffee: 'Coffee', bohemian: 'Bohemian', european: 'European' };

function getArtworkOverridesForFeatured() {
  try {
    const raw = localStorage.getItem(ARTWORK_METADATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (_) {}
  return {};
}

function getCustomArtworksForFeatured() {
  try {
    const raw = localStorage.getItem(ARTWORK_CUSTOM_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

function formatTitleForFeatured(filename) {
  const name = String(filename).replace(/\.(jpeg|jpg|png|webp)$/i, '');
  const words = name.split(/[_-]/);
  return words.map((w) => {
    const lower = w.toLowerCase();
    return TITLE_FORMAT[lower] || (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }).join(' ');
}

function getCategoryFromFilenameForFeatured(filename) {
  const lower = String(filename).replace(/\.(jpeg|jpg|png|webp)$/i, '').toLowerCase();
  if (/ai_girl|^female|^ai/.test(lower)) return 'ai';
  if (/sci-fi|scifi|sci_fi/.test(lower)) return 'scifi';
  if (/warrior/.test(lower)) return 'warrior';
  if (/interior/.test(lower)) return 'interior';
  return 'image';
}

function getFeaturedArtworks() {
  const overrides = getArtworkOverridesForFeatured();
  const custom = getCustomArtworksForFeatured();
  const result = [];
  custom.forEach((a) => {
    if (overrides[a.id]?.deleted) return;
    const o = overrides[a.id] || {};
    const featured = o.featured ?? a.featured ?? false;
    if (!featured) return;
    result.push({
      id: a.id,
      title: o.title ?? a.title ?? 'Untitled',
      category: o.category ?? a.category ?? 'AI Image',
      styleName: o.styleName ?? a.styleName ?? '',
      imagePath: a.imagePath
    });
  });
  GALLERY_IMAGES.forEach((id) => {
    if (overrides[id]?.deleted) return;
    const o = overrides[id] || {};
    if (!o.featured) return;
    const cat = getCategoryFromFilenameForFeatured(id);
    result.push({
      id,
      title: o.title ?? formatTitleForFeatured(id),
      category: o.category ?? CATEGORY_DISPLAY[cat] ?? 'AI Image',
      styleName: o.styleName ?? '',
      imagePath: `./images/gallery/${id}`
    });
  });
  return result.slice(0, 6);
}

function renderFeaturedWorks() {
  const grid = document.getElementById('featuredWorksGrid');
  if (!grid) return;
  const featured = getFeaturedArtworks();
  if (featured.length === 0) {
    grid.innerHTML = '<p class="featured-works-empty">No featured works selected yet.</p>';
    return;
  }
  grid.innerHTML = featured.map((a) => {
    const url = `visual-lab.html#artwork=${encodeURIComponent(a.id)}`;
    const stylePart = a.styleName ? `<span class="featured-works-style">${escapeHtml(a.styleName)}</span>` : '';
    return `
      <a href="${url}" class="featured-works-card" data-artwork-id="${escapeHtml(a.id)}">
        <div class="featured-works-image-wrap">
          <img src="${escapeHtml(a.imagePath)}" alt="${escapeHtml(a.title)}" loading="lazy">
        </div>
        <div class="featured-works-info">
          <h3 class="featured-works-title">${escapeHtml(a.title)}</h3>
          <span class="featured-works-category">${escapeHtml(a.category)}</span>
          ${stylePart}
          <span class="featured-works-cta">Open Visual Lab</span>
        </div>
      </a>
    `;
  }).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initFeaturedWorks() {
  const section = document.getElementById('featured-works');
  if (!section) return;
  renderFeaturedWorks();
}

function getGeneratedCount() {
  try {
    const v = sessionStorage.getItem(GENERATED_PROMPTS_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

function addGeneratedCount(n) {
  const v = getGeneratedCount() + n;
  sessionStorage.setItem(GENERATED_PROMPTS_KEY, String(v));
  return v;
}

function animateCounter(el, target, duration = 1200) {
  if (!el || typeof target !== 'number') return;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = String(current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function updateCreationStats(animate = false) {
  const libEl = document.getElementById('statLibraryCount');
  const favEl = document.getElementById('statFavoriteCount');
  const genEl = document.getElementById('statGeneratedCount');
  const visEl = document.getElementById('statVisualCount');
  const songEl = document.getElementById('statSongCount');

  const libCount = typeof getMergedLibrary !== 'undefined' ? getMergedLibrary().length : (typeof PROMPT_LIBRARY !== 'undefined' ? PROMPT_LIBRARY.length : 0);
  const favCount = typeof getFavorites !== 'undefined' ? getFavorites().size : 0;
  const genCount = getGeneratedCount();
  const visCount = document.querySelectorAll('.visual-card').length;
  const songCount = AI_SONGS_COUNT;

  if (animate) {
    if (libEl) animateCounter(libEl, libCount);
    if (favEl) animateCounter(favEl, favCount);
    if (genEl) animateCounter(genEl, genCount);
    if (visEl) animateCounter(visEl, visCount);
    if (songEl) animateCounter(songEl, songCount);
  } else {
    if (libEl) libEl.textContent = String(libCount);
    if (favEl) favEl.textContent = String(favCount);
    if (genEl) genEl.textContent = String(genCount);
    if (visEl) visEl.textContent = String(visCount);
    if (songEl) songEl.textContent = String(songCount);
  }
}

function initCreationStats() {
  const section = document.getElementById('creation-stats');
  if (!section) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          updateCreationStats(true);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px' }
  );

  observer.observe(section);
  updateCreationStats(false);
}

/**
 * filterVisuals - Filter visual cards by category with active button state
 */
function filterVisuals(category) {
  const cards = document.querySelectorAll('.visual-card');
  const btns = document.querySelectorAll('.visual-filter .filter-btn');

  btns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  cards.forEach((card) => {
    const match = category === 'all' || card.dataset.category === category;
    card.classList.toggle('visible', match);
    card.classList.toggle('hidden', !match);
  });
}

/**
 * Copy Prompt - Uses event delegation so dynamically added .copy-btn also work
 */
function initCopyButtons() {
  document.addEventListener('click', (e) => {
    if (!e.target.matches('.copy-btn')) return;
    const button = e.target;
    const card = button.closest('.generated-card, .library-card');
    const promptEl = card ? card.querySelector('.prompt-text') : button.parentElement.querySelector('.prompt-text');
    const prompt = promptEl ? promptEl.innerText : '';
    if (!prompt) return;

    navigator.clipboard.writeText(prompt).then(() => {
      button.innerText = 'Copied!';
      setTimeout(() => {
        button.innerText = 'Copy Prompt';
      }, 2000);
    });
  });
}

/**
 * Save to Library - Event delegation for .save-prompt-btn on generated cards
 */
function initSavePromptButtons() {
  document.addEventListener('click', (e) => {
    if (!e.target.matches('.save-prompt-btn')) return;
    const button = e.target;
    const card = button.closest('.generated-card');
    if (!card) return;
    const promptEl = card.querySelector('.prompt-text');
    const prompt = promptEl ? promptEl.innerText.trim() : '';
    if (!prompt) return;

    const styleName = card.dataset.style || '';
    const keyword = card.dataset.keyword || '';
    const title = `${styleName} – ${keyword}`.trim() || 'Generated Prompt';
    const category = getCategoryFromStyle(styleName);
    const tagWords = keyword.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
    const styleTags = styleName.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
    const tags = [...new Set([...tagWords, ...styleTags])];

    const existing = getSavedPrompts();
    const isDuplicate = existing.some((p) => p.prompt && p.prompt.trim() === prompt);
    if (isDuplicate) {
      button.innerText = 'Already Saved';
      setTimeout(() => { button.innerText = 'Save to Library'; }, 2000);
      return;
    }

    const id = 'saved-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    const item = { id, title, category, prompt, tags, source: 'generated' };
    savePromptToLibrary(item);

    button.innerText = 'Saved!';
    setTimeout(() => { button.innerText = 'Save to Library'; }, 2000);

    if (typeof renderPromptLibrary === 'function') renderPromptLibrary();
    if (typeof updateCreationStats === 'function') updateCreationStats(false);
  });
}

/**
 * Prompt Generator - Generate 5 styled prompts from keyword
 */
const PROMPT_TEMPLATES = [
  {
    name: 'Cinematic',
    template: 'A cinematic, ultra-detailed {keyword}, dramatic lighting, powerful composition, realistic textures, atmospheric depth, high-end movie still, visually striking'
  },
  {
    name: 'Fashion Editorial',
    template: 'A fashion editorial portrait of {keyword}, elegant styling, luxury aesthetic, soft natural lighting, magazine-quality photography, refined details, modern visual language'
  },
  {
    name: 'Sci-Fi',
    template: 'A futuristic sci-fi version of {keyword}, neon lighting, advanced technology, cyberpunk atmosphere, sleek design, high-detail digital art, immersive environment'
  },
  {
    name: 'Fantasy',
    template: 'A fantasy-style {keyword}, epic atmosphere, magical mood, rich environment details, dramatic fantasy lighting, highly detailed, legendary visual storytelling'
  },
  {
    name: 'Hyper-realistic',
    template: 'A hyper-realistic depiction of {keyword}, extremely detailed skin texture, natural lighting, realistic materials, lifelike depth, professional photography quality'
  }
];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function generatePromptsFromKeyword(keyword) {
  const k = keyword.trim();
  return PROMPT_TEMPLATES.map((t) => ({
    name: t.name,
    text: t.template.replace('{keyword}', k)
  }));
}

function initPromptGenerator() {
  const input = document.getElementById('promptKeyword');
  const btn = document.getElementById('generatePromptBtn');
  const output = document.getElementById('generatedPrompts');

  if (!input || !btn || !output) return;

  btn.addEventListener('click', () => {
    const keyword = input.value.trim();
    if (!keyword) {
      input.classList.add('input-error');
      input.placeholder = 'Please enter a keyword first';
      input.focus();
      setTimeout(() => {
        input.classList.remove('input-error');
        input.placeholder = 'Enter a keyword, e.g. female warrior';
      }, 2000);
      return;
    }

    const prompts = generatePromptsFromKeyword(keyword);
    output.innerHTML = prompts
      .map(
        (p) => `
      <div class="generated-card" data-style="${escapeHtml(p.name)}" data-keyword="${escapeHtml(keyword)}">
        <h3>${escapeHtml(p.name)}</h3>
        <pre class="prompt-text">${escapeHtml(p.text)}</pre>
        <div class="generated-card-actions">
          <button type="button" class="copy-btn">Copy Prompt</button>
          <button type="button" class="save-prompt-btn">Save to Library</button>
        </div>
      </div>
    `
      )
      .join('');

    addGeneratedCount(5);
    if (typeof updateCreationStats === 'function') updateCreationStats(false);

    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}

/**
 * Prompt Library - Searchable, filterable prompt library with favorites
 */
const PROMPT_LIBRARY = [
  { id: 0, title: 'Sunlit Morning Girl', category: 'portrait', prompt: 'A hyper-realistic portrait of a joyful young woman in soft morning sunlight, golden hour warmth, natural skin texture, delicate freckles, wind in hair, cinematic shallow depth of field, 8K, photorealistic.', tags: ['female', 'sunlight', 'portrait'] },
  { id: 1, title: 'Fashion Editorial Noir', category: 'fashion', prompt: 'A fashion editorial portrait, high contrast black and white, dramatic lighting, luxury aesthetic, editorial magazine quality, sharp details, elegant composition.', tags: ['fashion', 'black', 'white', 'editorial'] },
  { id: 2, title: 'Cyberpunk Street Samurai', category: 'scifi', prompt: 'A futuristic sci-fi portrait of a samurai in neon-lit cyberpunk city, rain-slicked streets, holographic advertisements, cinematic lighting, cyberpunk atmosphere, high-detail digital art.', tags: ['cyberpunk', 'neon', 'samurai'] },
  { id: 3, title: 'Elven Forest Guardian', category: 'fantasy', prompt: 'A fantasy-style elven warrior in mystical forest, epic atmosphere, magical mood, rich environment details, dramatic fantasy lighting, highly detailed, legendary visual storytelling.', tags: ['fantasy', 'elf', 'forest'] },
  { id: 4, title: 'Studio Portrait Elegance', category: 'portrait', prompt: 'Professional studio portrait, soft diffused lighting, clean background, refined skin texture, natural makeup, editorial quality, 85mm lens, shallow depth of field.', tags: ['studio', 'portrait', 'elegant'] },
  { id: 5, title: 'Runway Fashion Moment', category: 'fashion', prompt: 'A fashion editorial shot of a model on runway, dramatic lighting, luxury aesthetic, motion blur, magazine-quality photography, high-end fashion.', tags: ['fashion', 'runway', 'editorial'] },
  { id: 6, title: 'Space Station Interior', category: 'scifi', prompt: 'A futuristic sci-fi interior of a space station, holographic displays, clean design, advanced technology, cinematic lighting, immersive environment.', tags: ['scifi', 'space', 'interior'] },
  { id: 7, title: 'Dragon Rider Epic', category: 'fantasy', prompt: 'A fantasy-style dragon rider soaring over mountains, epic atmosphere, magical mood, rich environment, dramatic fantasy lighting, highly detailed.', tags: ['fantasy', 'dragon', 'epic'] },
  { id: 8, title: 'Golden Hour Portrait', category: 'portrait', prompt: 'A hyper-realistic portrait in golden hour sunlight, warm tones, natural skin texture, soft bokeh background, cinematic composition, 8K photorealistic.', tags: ['portrait', 'golden', 'hour'] },
  { id: 9, title: 'Luxury Brand Campaign', category: 'fashion', prompt: 'A fashion editorial for luxury brand campaign, elegant styling, soft natural lighting, magazine-quality photography, refined details, modern visual language.', tags: ['fashion', 'luxury', 'campaign'] },
  { id: 10, title: 'Neon City Explorer', category: 'scifi', prompt: 'A futuristic sci-fi portrait in neon-lit city, cyberpunk atmosphere, rain reflections, advanced technology, sleek design, immersive environment.', tags: ['scifi', 'neon', 'cyberpunk'] },
  { id: 11, title: 'Mystic Sorceress', category: 'fantasy', prompt: 'A fantasy-style sorceress with magical aura, epic atmosphere, rich environment details, dramatic fantasy lighting, highly detailed, legendary visual storytelling.', tags: ['fantasy', 'magic', 'sorceress'] }
];

const FAVORITES_KEY = 'beyond-ai-lab-prompts-favorites';
const SAVED_PROMPTS_KEY = 'beyond-ai-lab-saved-prompts';
const COLLECTIONS_KEY = 'beyond-ai-lab-prompt-collections';

function getSavedPrompts() {
  try {
    const raw = localStorage.getItem(SAVED_PROMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePromptToLibrary(item) {
  const saved = getSavedPrompts();
  saved.push(item);
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(saved));
}

function addPromptsToSaved(items) {
  const saved = getSavedPrompts();
  saved.push(...items);
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(saved));
}

function getExistingPromptTexts() {
  const library = getMergedLibrary();
  return new Set(library.map((p) => (p.prompt || '').trim()).filter(Boolean));
}

function getCategoryFromStyle(styleName) {
  const s = (styleName || '').toLowerCase();
  if (/cinematic|hyper-realistic|hyperrealistic/.test(s)) return 'portrait';
  if (/fashion|editorial/.test(s)) return 'fashion';
  if (/sci-fi|scifi|scifi/.test(s)) return 'scifi';
  if (/fantasy/.test(s)) return 'fantasy';
  return 'portrait';
}

function getMergedLibrary() {
  const saved = getSavedPrompts();
  return [...PROMPT_LIBRARY, ...saved];
}

function getPromptSortOrder() {
  const sel = document.getElementById('promptSortSelect');
  return sel?.value || 'newest';
}

function getSortedLibrary() {
  const library = getMergedLibrary();
  const order = getPromptSortOrder();

  if (order === 'newest') {
    const builtIn = library.filter((p) => !p.source || p.source === 'built-in');
    const saved = library.filter((p) => p.source && p.source !== 'built-in');
    return [...[...saved].reverse(), ...builtIn];
  }
  if (order === 'title') {
    return [...library].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }
  if (order === 'category') {
    return [...library].sort((a, b) => {
      const c = (a.category || '').localeCompare(b.category || '');
      return c !== 0 ? c : (a.title || '').localeCompare(b.title || '');
    });
  }
  return library;
}

function isEditablePrompt(p) {
  return p.source && p.source !== 'built-in';
}

function deletePromptFromSaved(id) {
  const saved = getSavedPrompts().filter((p) => String(p.id) !== String(id));
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(saved));
}

function updatePromptInSaved(id, updates) {
  const saved = getSavedPrompts();
  const idx = saved.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return;
  saved[idx] = { ...saved[idx], ...updates };
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(saved));
}

function setSavedPrompts(items) {
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(items));
}

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function setFavorites(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
}

function toggleFavorite(id) {
  const favs = getFavorites();
  if (favs.has(id)) favs.delete(id);
  else favs.add(id);
  setFavorites(favs);
  return favs.has(id);
}

function isFavorite(id) {
  return getFavorites().has(id);
}

function renderPromptLibrary() {
  const grid = document.getElementById('promptLibraryGrid');
  const search = document.getElementById('promptSearch');
  const filterBtns = document.querySelectorAll('.prompt-filter-btn');
  const activeFilter = [...filterBtns].find((b) => b.classList.contains('active'))?.dataset.filter || 'all';
  const query = (search?.value || '').trim().toLowerCase();
  const favs = getFavorites();
  const library = getSortedLibrary();

  const filtered = library.filter((p) => {
    const matchSearch = !query ||
      p.title.toLowerCase().includes(query) ||
      p.prompt.toLowerCase().includes(query) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)));
    const matchCategory = activeFilter === 'all' || activeFilter === 'favorites'
      ? (activeFilter === 'favorites' ? favs.has(p.id) : true)
      : p.category === activeFilter;
    return matchSearch && matchCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="prompt-library-empty">No prompts match your search or filter.</div>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => {
        const isGenerated = p.source === 'generated';
        const isImported = p.source === 'imported';
        const isBuiltIn = !p.source || p.source === 'built-in';
        const badge = isGenerated ? ' <span class="library-source-badge">Generated</span>' : (isImported ? ' <span class="library-source-badge">Imported</span>' : (isBuiltIn ? ' <span class="library-source-badge library-source-badge--readonly">Built-in</span>' : ''));
        const editDeleteBtns = isEditablePrompt(p) ? `
        <button type="button" class="edit-prompt-btn" data-id="${escapeHtml(String(p.id))}">Edit</button>
        <button type="button" class="delete-prompt-btn" data-id="${escapeHtml(String(p.id))}">Delete</button>` : '';
        return `
    <div class="library-card" data-category="${escapeHtml(p.category)}" data-tags="${escapeHtml((p.tags || []).join(' '))}" data-id="${escapeHtml(String(p.id))}">
      <div class="library-card-top">
        <h3>${escapeHtml(p.title)}${badge}</h3>
        <button type="button" class="favorite-btn ${isFavorite(p.id) ? 'favorited' : ''}" data-id="${escapeHtml(String(p.id))}" aria-label="Toggle favorite">${isFavorite(p.id) ? '♥' : '♡'}</button>
      </div>
      <span class="library-category">${escapeHtml((p.category || '').charAt(0).toUpperCase() + (p.category || '').slice(1))}</span>
      <pre class="prompt-text">${escapeHtml(p.prompt)}</pre>
      <div class="library-card-actions">
        <button type="button" class="copy-btn">Copy Prompt</button>
        <button type="button" class="add-to-collection-btn" data-id="${escapeHtml(String(p.id))}" title="Add to collection">+ Collection</button>${editDeleteBtns}
      </div>
    </div>
  `;
      }
    )
    .join('');
}

function initPromptLibrary() {
  const search = document.getElementById('promptSearch');
  const filterBtns = document.querySelectorAll('.prompt-filter-btn');
  const grid = document.getElementById('promptLibraryGrid');

  if (!grid) return;

  renderPromptLibrary();

  search?.addEventListener('input', () => renderPromptLibrary());

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderPromptLibrary();
    });
  });

  grid.addEventListener('click', (e) => {
    if (e.target.matches('.favorite-btn')) {
      e.preventDefault();
      const rawId = e.target.dataset.id;
      if (rawId === undefined) return;
      const id = /^\d+$/.test(String(rawId)) ? Number(rawId) : rawId;
      toggleFavorite(id);
      renderPromptLibrary();
      if (typeof updateCreationStats === 'function') updateCreationStats(false);
      return;
    }
    if (e.target.matches('.delete-prompt-btn')) {
      e.preventDefault();
      const id = e.target.dataset.id;
      if (!id) return;
      deletePromptFromSaved(id);
      renderPromptLibrary();
      if (typeof updateCreationStats === 'function') updateCreationStats(false);
      showToast('Deleted');
      return;
    }
    if (e.target.matches('.edit-prompt-btn')) {
      e.preventDefault();
      const id = e.target.dataset.id;
      if (!id) return;
      openEditPromptModal(id);
      return;
    }
    if (e.target.matches('.add-to-collection-btn')) {
      e.preventDefault();
      const id = e.target.dataset.id;
      if (!id) return;
      openAddToCollectionModal(id);
      return;
    }
  });

  document.getElementById('promptSortSelect')?.addEventListener('change', () => renderPromptLibrary());

  initPromptLibraryManagement();
  initPromptLibraryExport();
}

function showManagementFeedback(btn, message) {
  const original = btn.textContent;
  btn.textContent = message;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 2000);
}

function showToast(message) {
  let el = document.getElementById('promptLibraryToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'promptLibraryToast';
    el.className = 'prompt-library-toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('prompt-library-toast--visible');
  clearTimeout(el._toastTimer);
  el._toastTimer = setTimeout(() => {
    el.classList.remove('prompt-library-toast--visible');
  }, 2000);
}

function initPromptLibraryManagement() {
  const clearImportedBtn = document.getElementById('clearImportedBtn');
  const clearSavedBtn = document.getElementById('clearSavedBtn');

  clearImportedBtn?.addEventListener('click', () => {
    if (!confirm('Remove all imported prompts? This cannot be undone.')) return;
    const saved = getSavedPrompts().filter((p) => p.source !== 'imported');
    setSavedPrompts(saved);
    renderPromptLibrary();
    if (typeof updateCreationStats === 'function') updateCreationStats(false);
    showManagementFeedback(clearImportedBtn, 'Cleared');
  });

  clearSavedBtn?.addEventListener('click', () => {
    if (!confirm('Remove all saved prompts (generated and other non-imported)? This cannot be undone.')) return;
    const saved = getSavedPrompts().filter((p) => p.source === 'imported');
    setSavedPrompts(saved);
    renderPromptLibrary();
    if (typeof updateCreationStats === 'function') updateCreationStats(false);
    showManagementFeedback(clearSavedBtn, 'Cleared');
  });
}

function openEditPromptModal(id) {
  const library = getMergedLibrary();
  const p = library.find((item) => String(item.id) === String(id));
  if (!p || !isEditablePrompt(p)) return;

  const modal = document.getElementById('editPromptModal');
  document.getElementById('editPromptTitle').value = p.title || '';
  document.getElementById('editPromptCategory').value = p.category || '';
  document.getElementById('editPromptTags').value = (p.tags || []).join(', ');
  document.getElementById('editPromptText').value = p.prompt || '';
  modal.dataset.editId = id;
  modal.classList.add('edit-prompt-modal--open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeEditPromptModal() {
  const modal = document.getElementById('editPromptModal');
  modal?.classList.remove('edit-prompt-modal--open');
  modal?.setAttribute('aria-hidden', 'true');
  delete modal?.dataset.editId;
}

function initEditPromptModal() {
  const modal = document.getElementById('editPromptModal');
  const form = document.getElementById('editPromptForm');
  const cancelBtn = document.getElementById('editPromptCancelBtn');
  const backdrop = modal?.querySelector('.edit-prompt-modal-backdrop');

  cancelBtn?.addEventListener('click', closeEditPromptModal);
  backdrop?.addEventListener('click', closeEditPromptModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('edit-prompt-modal--open')) {
      closeEditPromptModal();
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = modal?.dataset.editId;
    if (!id) return;

    const title = document.getElementById('editPromptTitle').value.trim();
    const category = document.getElementById('editPromptCategory').value.trim();
    const tagsStr = document.getElementById('editPromptTags').value.trim();
    const prompt = document.getElementById('editPromptText').value.trim();

    if (!title || !category || !prompt) return;

    const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const p = getMergedLibrary().find((item) => String(item.id) === String(id));
    if (!p) return;

    updatePromptInSaved(id, { title, category, tags, prompt });
    closeEditPromptModal();
    renderPromptLibrary();
    if (typeof updateCreationStats === 'function') updateCreationStats(false);
  });
}

/**
 * Export / Backup - Download prompt library as JSON, CSV, or TXT
 */
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportLibraryAsJSON() {
  const library = getMergedLibrary();
  const data = library.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    tags: p.tags || [],
    source: p.source || 'built-in',
    prompt: p.prompt
  }));
  const content = JSON.stringify(data, null, 2);
  downloadFile('beyond-ai-lab-prompts.json', content, 'application/json');
}

function exportLibraryAsCSV() {
  const library = getMergedLibrary();
  const escapeCsv = (val) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const rows = [
    ['id', 'title', 'category', 'tags', 'source', 'prompt'].join(','),
    ...library.map((p) =>
      [
        escapeCsv(p.id),
        escapeCsv(p.title),
        escapeCsv(p.category),
        escapeCsv((p.tags || []).join(',')),
        escapeCsv(p.source || 'built-in'),
        escapeCsv(p.prompt)
      ].join(',')
    )
  ];
  const content = rows.join('\n');
  downloadFile('beyond-ai-lab-prompts.csv', content, 'text/csv');
}

function exportLibraryAsTXT() {
  const library = getMergedLibrary();
  const sep = '----------------------';
  const lines = library.map((p) => {
    const tags = (p.tags || []).join(', ');
    return `Title: ${p.title || ''}
Category: ${p.category || ''}
Tags: ${tags}
Source: ${p.source || 'built-in'}

Prompt:
${p.prompt || ''}

${sep}`;
  });
  const content = lines.join('\n\n');
  downloadFile('beyond-ai-lab-prompts.txt', content, 'text/plain');
}

function showExportFeedback(btn, originalLabel) {
  btn.textContent = 'Downloaded!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = originalLabel;
    btn.disabled = false;
  }, 2000);
}

function initPromptLibraryExport() {
  const jsonBtn = document.getElementById('exportJsonBtn');
  const csvBtn = document.getElementById('exportCsvBtn');
  const txtBtn = document.getElementById('exportTxtBtn');

  jsonBtn?.addEventListener('click', () => {
    exportLibraryAsJSON();
    showExportFeedback(jsonBtn, 'Export JSON');
  });
  csvBtn?.addEventListener('click', () => {
    exportLibraryAsCSV();
    showExportFeedback(csvBtn, 'Export CSV');
  });
  txtBtn?.addEventListener('click', () => {
    exportLibraryAsTXT();
    showExportFeedback(txtBtn, 'Export TXT');
  });

  initPromptLibraryImport();
}

/**
 * Import - Load prompts from JSON file and merge into saved prompts
 */
function validateImportItem(item, index = 0) {
  if (!item || typeof item !== 'object') return null;
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  const category = typeof item.category === 'string' ? item.category.trim() : '';
  const prompt = typeof item.prompt === 'string' ? item.prompt.trim() : '';
  if (!title || !category || !prompt) return null;

  let tags = item.tags;
  if (!Array.isArray(tags)) tags = [];
  tags = tags.filter((t) => typeof t === 'string').map((t) => String(t).trim()).filter(Boolean);

  const source = typeof item.source === 'string' ? item.source.trim() || 'imported' : 'imported';
  const id = 'imported-' + Date.now() + '-' + index + '-' + Math.random().toString(36).slice(2, 9);

  return { id, title, category, tags, source, prompt };
}

function importPromptsFromJSON(fileContent) {
  let data;
  try {
    data = JSON.parse(fileContent);
  } catch {
    return { success: false, imported: 0 };
  }
  if (!Array.isArray(data)) return { success: false, imported: 0 };

  const existingTexts = getExistingPromptTexts();
  const toAdd = [];
  let idx = 0;

  for (const item of data) {
    const validated = validateImportItem(item, idx);
    if (!validated) continue;
    if (existingTexts.has(validated.prompt)) continue;
    existingTexts.add(validated.prompt);
    toAdd.push(validated);
    idx += 1;
  }

  if (toAdd.length > 0) addPromptsToSaved(toAdd);
  return { success: true, imported: toAdd.length };
}

function initPromptLibraryImport() {
  const fileInput = document.getElementById('importPromptFile');
  const importBtn = document.getElementById('importJsonBtn');

  if (!fileInput || !importBtn) return;

  importBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content !== 'string') {
        importBtn.textContent = 'Import Failed';
        importBtn.disabled = true;
        setTimeout(() => { importBtn.textContent = 'Import JSON'; importBtn.disabled = false; }, 2000);
        return;
      }

      const result = importPromptsFromJSON(content);
      if (!result.success) {
        importBtn.textContent = 'Import Failed';
        importBtn.disabled = true;
        setTimeout(() => { importBtn.textContent = 'Import JSON'; importBtn.disabled = false; }, 2000);
        return;
      }

      if (result.imported === 0) {
        importBtn.textContent = 'No New Prompts';
        importBtn.disabled = true;
        setTimeout(() => { importBtn.textContent = 'Import JSON'; importBtn.disabled = false; }, 2000);
      } else {
        importBtn.textContent = 'Imported: ' + result.imported;
        importBtn.disabled = true;
        setTimeout(() => { importBtn.textContent = 'Import JSON'; importBtn.disabled = false; }, 2000);
      }

      renderPromptLibrary();
      if (typeof updateCreationStats === 'function') updateCreationStats(false);
    };
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Prompt Collections - Group prompts into named bundles
 */
function getCollections() {
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCollections(items) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(items));
}

function getPromptById(id) {
  const library = getMergedLibrary();
  return library.find((p) => String(p.id) === String(id));
}

function createCollection(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return { success: false, reason: 'empty' };
  const collections = getCollections();
  const exists = collections.some((c) => (c.name || '').toLowerCase() === trimmed.toLowerCase());
  if (exists) return { success: false, reason: 'duplicate' };
  const id = 'collection-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  const coll = { id, name: trimmed, promptIds: [], createdAt: Date.now() };
  collections.push(coll);
  setCollections(collections);
  return { success: true, collection: coll };
}

function getCollectionById(id) {
  return getCollections().find((c) => c.id === id);
}

function addPromptToCollection(collectionId, promptId) {
  const collections = getCollections();
  const coll = collections.find((c) => c.id === collectionId);
  if (!coll) return;
  const ids = coll.promptIds || [];
  if (ids.some((x) => String(x) === String(promptId))) return;
  coll.promptIds = [...ids, promptId];
  setCollections(collections);
}

function updateCollection(id, updates) {
  const collections = getCollections();
  const idx = collections.findIndex((c) => c.id === id);
  if (idx === -1) return;
  collections[idx] = { ...collections[idx], ...updates };
  setCollections(collections);
}

function deleteCollection(id) {
  setCollections(getCollections().filter((c) => c.id !== id));
}

let selectedCollectionId = null;

function renderCollectionsList() {
  const list = document.getElementById('collectionsList');
  if (!list) return;
  const collections = getCollections();
  if (collections.length === 0) {
    list.innerHTML = '<p class="collections-list-empty">No collections yet.</p>';
    return;
  }
  list.innerHTML = collections
    .map(
      (c) => `
    <button type="button" class="collection-list-item ${c.id === selectedCollectionId ? 'selected' : ''}" data-id="${escapeHtml(c.id)}">
      <span class="collection-list-name">${escapeHtml(c.name)}</span>
      <span class="collection-list-count">${(c.promptIds || []).length}</span>
    </button>
  `
    )
    .join('');
  list.querySelectorAll('.collection-list-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCollectionId = btn.dataset.id;
      renderCollectionsList();
      renderCollectionDetail();
    });
  });
}

function renderCollectionDetail() {
  const panel = document.getElementById('collectionDetail');
  if (!panel) return;
  if (!selectedCollectionId) {
    panel.innerHTML = '<p class="collection-empty">Select a collection to view prompts.</p>';
    return;
  }
  const coll = getCollectionById(selectedCollectionId);
  if (!coll) {
    panel.innerHTML = '<p class="collection-empty">Collection not found.</p>';
    return;
  }
  const promptIds = coll.promptIds || [];
  const prompts = promptIds
    .map((id) => getPromptById(id))
    .filter(Boolean);

  const promptCards = prompts
    .map(
      (p) => `
    <div class="collection-prompt-card">
      <h4>${escapeHtml(p.title)}</h4>
      <pre class="prompt-text">${escapeHtml(p.prompt)}</pre>
      <button type="button" class="export-btn collection-prompt-copy">Copy</button>
    </div>
  `
    )
    .join('');

  panel.innerHTML = `
    <div class="collection-detail-header">
      <h3>${escapeHtml(coll.name)}</h3>
      <span class="collection-detail-count">${prompts.length} prompt${prompts.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="collection-detail-actions">
      <button type="button" class="export-btn collection-action-btn" id="collectionCopyAllBtn">Copy All Prompts</button>
      <button type="button" class="export-btn collection-action-btn" id="collectionExportTxtBtn">Export TXT</button>
      <button type="button" class="export-btn collection-action-btn" id="collectionRenameBtn">Rename</button>
      <button type="button" class="export-btn collection-action-btn collection-delete-btn" id="collectionDeleteBtn">Delete</button>
    </div>
    <div class="collection-detail-prompts">
      ${promptCards || '<p class="collection-empty">No prompts in this collection.</p>'}
    </div>
  `;

  panel.querySelectorAll('.collection-prompt-copy').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const p = prompts[i];
      if (p) navigator.clipboard.writeText(p.prompt);
      showToast('Copied');
    });
  });

  document.getElementById('collectionCopyAllBtn')?.addEventListener('click', () => {
    const text = prompts.map((p) => `--- ${p.title} ---\n${p.prompt}`).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('Copied all');
  });

  document.getElementById('collectionExportTxtBtn')?.addEventListener('click', () => {
    const text = prompts.map((p) => `--- ${p.title} ---\n${p.prompt}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (coll.name || 'collection').replace(/\s+/g, '-') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported');
  });

  document.getElementById('collectionRenameBtn')?.addEventListener('click', () => {
    const newName = prompt('Rename collection:', coll.name);
    if (newName === null) return;
    const trimmed = newName.trim();
    if (!trimmed) return;
    const collections = getCollections();
    const exists = collections.some((c) => c.id !== coll.id && (c.name || '').toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      showToast('Name already exists');
      return;
    }
    updateCollection(coll.id, { name: trimmed });
    renderCollectionsList();
    renderCollectionDetail();
    showToast('Renamed');
  });

  document.getElementById('collectionDeleteBtn')?.addEventListener('click', () => {
    if (!confirm('Delete this collection? This cannot be undone.')) return;
    deleteCollection(coll.id);
    selectedCollectionId = null;
    renderCollectionsList();
    renderCollectionDetail();
    showToast('Deleted');
  });
}

function openAddToCollectionModal(promptId) {
  const modal = document.getElementById('addToCollectionModal');
  const list = document.getElementById('addToCollectionList');
  const empty = document.getElementById('addToCollectionEmpty');
  modal.dataset.promptId = promptId;
  modal.classList.add('add-to-collection-modal--open');
  modal.setAttribute('aria-hidden', 'false');

  const collections = getCollections();
  if (collections.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.innerHTML = collections
      .map(
        (c) => {
          const ids = c.promptIds || [];
          const alreadyIn = ids.some((x) => String(x) === String(promptId));
          return `
        <button type="button" class="add-to-collection-option ${alreadyIn ? 'disabled' : ''}" data-id="${escapeHtml(c.id)}" ${alreadyIn ? 'disabled' : ''}>
          ${escapeHtml(c.name)} (${ids.length})
          ${alreadyIn ? ' ✓' : ''}
        </button>
      `;
        }
      )
      .join('');
    list.querySelectorAll('.add-to-collection-option:not(.disabled)').forEach((btn) => {
      btn.addEventListener('click', () => {
        addPromptToCollection(btn.dataset.id, promptId);
        closeAddToCollectionModal();
        renderCollectionsList();
        if (selectedCollectionId === btn.dataset.id) renderCollectionDetail();
        showToast('Added');
      });
    });
  }
}

function closeAddToCollectionModal() {
  const modal = document.getElementById('addToCollectionModal');
  modal?.classList.remove('add-to-collection-modal--open');
  modal?.setAttribute('aria-hidden', 'true');
  delete modal?.dataset.promptId;
}

function initPromptCollections() {
  const createInput = document.getElementById('newCollectionName');
  const createBtn = document.getElementById('createCollectionBtn');
  const addCancelBtn = document.getElementById('addToCollectionCancelBtn');
  const addBackdrop = document.querySelector('.add-to-collection-modal-backdrop');

  createBtn?.addEventListener('click', () => {
    const name = createInput?.value?.trim() || '';
    const result = createCollection(name);
    if (result.success) {
      createInput.value = '';
      renderCollectionsList();
      showToast('Created');
    } else if (result.reason === 'duplicate') {
      showToast('Name already exists');
    }
  });

  createInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') createBtn?.click();
  });

  addCancelBtn?.addEventListener('click', closeAddToCollectionModal);
  addBackdrop?.addEventListener('click', closeAddToCollectionModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('addToCollectionModal')?.classList.contains('add-to-collection-modal--open')) {
      closeAddToCollectionModal();
    }
  });

  renderCollectionsList();
  renderCollectionDetail();

  const selectCollId = sessionStorage.getItem('beyond-ai-lab-select-collection');
  if (selectCollId) {
    sessionStorage.removeItem('beyond-ai-lab-select-collection');
    selectedCollectionId = selectCollId;
    renderCollectionsList();
    renderCollectionDetail();
    const sect = document.getElementById('prompt-collections');
    if (sect) sect.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function highlightPromptCard(promptId) {
  const grid = document.getElementById('promptLibraryGrid');
  const card = grid?.querySelector(`.library-card[data-id="${CSS.escape(String(promptId))}"]`);
  if (!card) {
    const sect = document.getElementById('prompt-library');
    if (sect) sect.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('library-card--highlight');
  setTimeout(() => card.classList.remove('library-card--highlight'), 2000);
}

function initNav() {
  const path = window.location.pathname || '';
  const base = path.split('/').pop() || '';
  const pageKey = base === '' || base === 'index.html' ? 'index' : base.replace(/\.html$/, '');
  document.querySelectorAll('.site-nav-link, .nav-links a').forEach((a) => {
    const navPage = a.getAttribute('data-nav-page');
    const href = (a.getAttribute('href') || '').replace(/^\.\//, '').split('?')[0];
    const hrefKey = href === '' || href === 'index.html' ? 'index' : href.replace(/\.html$/, '');
    const isActive = navPage ? navPage === pageKey : hrefKey === pageKey;
    a.classList.toggle('is-active', isActive);
    a.classList.toggle('nav-active', isActive);
  });
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
}

function initLatestAdditions() {
  const section = document.getElementById('latest-additions');
  if (!section) return;

  const truncate = (typeof truncateText === 'function' ? truncateText : function (str, len) { if (!str) return ''; var s = String(str).trim().replace(/\n/g, ' '); return s.length <= len ? s : s.slice(0, len) + '...'; });
  const sortByCreatedAt = (typeof sortByCreatedAtDesc === 'function' ? sortByCreatedAtDesc : function (list) { if (!Array.isArray(list)) return []; return list.slice().sort(function (a, b) { var da = (a.createdAt || '').toString(); var db = (b.createdAt || '').toString(); if (!da && !db) return 0; if (!da) return 1; if (!db) return -1; return da > db ? -1 : da < db ? 1 : 0; }); });
  const escape = (typeof escapeHtml === 'function' ? escapeHtml : function (str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); });

  function renderPrompts(list) {
    const el = document.getElementById('latestAdditionsPromptsList');
    if (!el) return;
    if (!Array.isArray(list) || list.length === 0) {
      el.innerHTML = '<div class="latest-additions-empty">No prompts yet.</div>';
      return;
    }
    const top = sortByCreatedAt(list).slice(0, 2);
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const summary = truncate(item.prompt, 100);
      const date = item.createdAt || '';
      const link = `prompt-library.html?prompt=${encodeURIComponent(item.id || '')}`;
      return `<article class="latest-additions-card card">
        <span class="latest-additions-type">Prompt</span>
        <h4 class="latest-additions-card-title card-title">${escape(title)}</h4>
        ${summary ? `<p class="latest-additions-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="latest-additions-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="latest-additions-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function renderImages(list) {
    const el = document.getElementById('latestAdditionsImagesList');
    if (!el) return;
    if (!Array.isArray(list) || list.length === 0) {
      el.innerHTML = '<div class="latest-additions-empty">No images yet.</div>';
      return;
    }
    const top = sortByCreatedAt(list).slice(0, 2);
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const summary = truncate(item.mood || item.prompt, 100);
      const date = item.createdAt || '';
      const promptId = item.promptId || '';
      const link = promptId ? `image-library.html?prompt=${encodeURIComponent(promptId)}` : 'image-library.html';
      return `<article class="latest-additions-card card">
        <span class="latest-additions-type">Image</span>
        <h4 class="latest-additions-card-title card-title">${escape(title)}</h4>
        ${summary ? `<p class="latest-additions-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="latest-additions-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="latest-additions-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function renderSongs(list) {
    const el = document.getElementById('latestAdditionsSongsList');
    if (!el) return;
    if (!Array.isArray(list) || list.length === 0) {
      el.innerHTML = '<div class="latest-additions-empty">No songs yet.</div>';
      return;
    }
    const top = sortByCreatedAt(list).slice(0, 2);
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const subtitle = item.subtitle || '';
      const summary = truncate(item.lyrics || item.style, 100);
      const date = item.createdAt || '';
      const link = 'music-library.html';
      return `<article class="latest-additions-card card">
        <span class="latest-additions-type">Song</span>
        <h4 class="latest-additions-card-title card-title">${escape(title)}</h4>
        ${subtitle ? `<span class="latest-additions-card-subtitle card-subtitle">${escape(subtitle)}</span>` : ''}
        ${summary ? `<p class="latest-additions-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="latest-additions-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="latest-additions-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function renderStories(list) {
    const el = document.getElementById('latestAdditionsStoriesList');
    if (!el) return;
    if (!Array.isArray(list) || list.length === 0) {
      el.innerHTML = '<div class="latest-additions-empty">No stories yet.</div>';
      return;
    }
    const top = sortByCreatedAt(list).slice(0, 2);
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const subtitle = item.subtitle || '';
      const summary = truncate(item.summary || item.content, 100);
      const date = item.createdAt || '';
      const link = 'story-library.html';
      return `<article class="latest-additions-card card">
        <span class="latest-additions-type">Story</span>
        <h4 class="latest-additions-card-title card-title">${escape(title)}</h4>
        ${subtitle ? `<span class="latest-additions-card-subtitle card-subtitle">${escape(subtitle)}</span>` : ''}
        ${summary ? `<p class="latest-additions-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="latest-additions-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="latest-additions-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function setFallback(type) {
    const ids = { prompts: 'latestAdditionsPromptsList', images: 'latestAdditionsImagesList', songs: 'latestAdditionsSongsList', stories: 'latestAdditionsStoriesList' };
    const el = document.getElementById(ids[type]);
    if (el) el.innerHTML = '<div class="latest-additions-empty">Unable to load.</div>';
  }

  Promise.all([
    fetch(PROMPTS_PATH).then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch(IMAGES_PATH).then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch(SONGS_PATH).then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch(STORIES_PATH).then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (results) {
    var prompts = Array.isArray(results[0]) ? results[0] : null;
    var images = Array.isArray(results[1]) ? results[1] : null;
    var songs = Array.isArray(results[2]) ? results[2] : null;
    var stories = Array.isArray(results[3]) ? results[3] : null;
    renderPrompts(prompts);
    renderImages(images);
    renderSongs(songs);
    renderStories(stories);
    if (!Array.isArray(prompts)) setFallback('prompts');
    if (!Array.isArray(images)) setFallback('images');
    if (!Array.isArray(songs)) setFallback('songs');
    if (!Array.isArray(stories)) setFallback('stories');
  }).catch(function () {
    setFallback('prompts');
    setFallback('images');
    setFallback('songs');
    setFallback('stories');
  });
}

function initArchiveStats() {
  const section = document.getElementById('archive-stats');
  if (!section) return;

  const elIds = {
    prompts: 'archiveStatsPrompts',
    images: 'archiveStatsImages',
    songs: 'archiveStatsSongs',
    stories: 'archiveStatsStories'
  };

  function setCount(type, count) {
    const el = document.getElementById(elIds[type]);
    if (el) el.textContent = count != null ? String(count) : '—';
  }

  function setFallback(type) {
    const el = document.getElementById(elIds[type]);
    if (el) el.textContent = '—';
  }

  Promise.all([
    fetch(PROMPTS_PATH).then((r) => r.json()).catch(() => null),
    fetch(IMAGES_PATH).then((r) => r.json()).catch(() => null),
    fetch(SONGS_PATH).then((r) => r.json()).catch(() => null),
    fetch(STORIES_PATH).then((r) => r.json()).catch(() => null)
  ]).then(([prompts, images, songs, stories]) => {
    setCount('prompts', Array.isArray(prompts) ? prompts.length : null);
    setCount('images', Array.isArray(images) ? images.length : null);
    setCount('songs', Array.isArray(songs) ? songs.length : null);
    setCount('stories', Array.isArray(stories) ? stories.length : null);
  }).catch(() => {
    setFallback('prompts');
    setFallback('images');
    setFallback('songs');
    setFallback('stories');
  });
}

function initFeaturedFavorites() {
  const section = document.getElementById('featured-favorites');
  if (!section) return;

  const PROMPTS_PATH = './data/prompts.json';
  const IMAGES_PATH = './data/images.json';
  const SONGS_PATH = './data/songs.json';
  const STORIES_PATH = './data/stories.json';

  const truncate = (typeof truncateText === 'function' ? truncateText : function (str, len) { if (!str) return ''; var s = String(str).trim().replace(/\n/g, ' '); return s.length <= len ? s : s.slice(0, len) + '...'; });
  const sortByCreatedAt = (typeof sortByCreatedAtDesc === 'function' ? sortByCreatedAtDesc : function (list) { if (!Array.isArray(list)) return []; return list.slice().sort(function (a, b) { var da = (a.createdAt || '').toString(); var db = (b.createdAt || '').toString(); if (!da && !db) return 0; if (!da) return 1; if (!db) return -1; return da > db ? -1 : da < db ? 1 : 0; }); });
  const escape = (typeof escapeHtml === 'function' ? escapeHtml : function (str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); });

  function filterFavorites(list) {
    if (!Array.isArray(list)) return [];
    return list.filter((item) => item.favorite === true);
  }

  function renderPrompts(list) {
    const el = document.getElementById('featuredFavoritesPromptsList');
    if (!el) return;
    const favorites = filterFavorites(list);
    const top = sortByCreatedAt(favorites).slice(0, 2);
    if (top.length === 0) {
      el.innerHTML = '<div class="featured-favorites-empty">No favorites yet.</div>';
      return;
    }
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const summary = truncate(item.prompt, 100);
      const date = item.createdAt || '';
      const link = `prompt-library.html?prompt=${encodeURIComponent(item.id || '')}`;
      return `<article class="featured-favorites-card card">
        <span class="featured-favorites-type">Prompt</span>
        <h4 class="featured-favorites-card-title card-title">${escape(title)}</h4>
        ${summary ? `<p class="featured-favorites-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="featured-favorites-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="featured-favorites-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function renderImages(list) {
    const el = document.getElementById('featuredFavoritesImagesList');
    if (!el) return;
    const favorites = filterFavorites(list);
    const top = sortByCreatedAt(favorites).slice(0, 2);
    if (top.length === 0) {
      el.innerHTML = '<div class="featured-favorites-empty">No favorites yet.</div>';
      return;
    }
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const summary = truncate(item.mood || item.prompt, 100);
      const date = item.createdAt || '';
      const promptId = item.promptId || '';
      const link = promptId ? `image-library.html?prompt=${encodeURIComponent(promptId)}` : 'image-library.html';
      return `<article class="featured-favorites-card card">
        <span class="featured-favorites-type">Image</span>
        <h4 class="featured-favorites-card-title card-title">${escape(title)}</h4>
        ${summary ? `<p class="featured-favorites-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="featured-favorites-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="featured-favorites-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function renderSongs(list) {
    const el = document.getElementById('featuredFavoritesSongsList');
    if (!el) return;
    const favorites = filterFavorites(list);
    const top = sortByCreatedAt(favorites).slice(0, 2);
    if (top.length === 0) {
      el.innerHTML = '<div class="featured-favorites-empty">No favorites yet.</div>';
      return;
    }
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const subtitle = item.subtitle || '';
      const summary = truncate(item.lyrics || item.style, 100);
      const date = item.createdAt || '';
      const link = 'music-library.html';
      return `<article class="featured-favorites-card card">
        <span class="featured-favorites-type">Song</span>
        <h4 class="featured-favorites-card-title card-title">${escape(title)}</h4>
        ${subtitle ? `<span class="featured-favorites-card-subtitle card-subtitle">${escape(subtitle)}</span>` : ''}
        ${summary ? `<p class="featured-favorites-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="featured-favorites-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="featured-favorites-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function renderStories(list) {
    const el = document.getElementById('featuredFavoritesStoriesList');
    if (!el) return;
    const favorites = filterFavorites(list);
    const top = sortByCreatedAt(favorites).slice(0, 2);
    if (top.length === 0) {
      el.innerHTML = '<div class="featured-favorites-empty">No favorites yet.</div>';
      return;
    }
    el.innerHTML = top.map((item) => {
      const title = item.title || 'Untitled';
      const subtitle = item.subtitle || '';
      const summary = truncate(item.summary || item.content, 100);
      const date = item.createdAt || '';
      const link = 'story-library.html';
      return `<article class="featured-favorites-card card">
        <span class="featured-favorites-type">Story</span>
        <h4 class="featured-favorites-card-title card-title">${escape(title)}</h4>
        ${subtitle ? `<span class="featured-favorites-card-subtitle card-subtitle">${escape(subtitle)}</span>` : ''}
        ${summary ? `<p class="featured-favorites-card-text card-text">${escape(summary)}</p>` : ''}
        ${date ? `<span class="featured-favorites-card-date card-meta">${escape(date)}</span>` : ''}
        <a href="${escape(link)}" class="featured-favorites-card-link btn btn-secondary">View</a>
      </article>`;
    }).join('');
  }

  function setFallback(type) {
    const ids = { prompts: 'featuredFavoritesPromptsList', images: 'featuredFavoritesImagesList', songs: 'featuredFavoritesSongsList', stories: 'featuredFavoritesStoriesList' };
    const el = document.getElementById(ids[type]);
    if (el) el.innerHTML = '<div class="featured-favorites-empty">No favorites yet.</div>';
  }

  Promise.all([
    fetch(PROMPTS_PATH).then((r) => r.json()).catch(() => null),
    fetch(IMAGES_PATH).then((r) => r.json()).catch(() => null),
    fetch(SONGS_PATH).then((r) => r.json()).catch(() => null),
    fetch(STORIES_PATH).then((r) => r.json()).catch(() => null)
  ]).then(([prompts, images, songs, stories]) => {
    renderPrompts(Array.isArray(prompts) ? prompts : null);
    renderImages(Array.isArray(images) ? images : null);
    renderSongs(Array.isArray(songs) ? songs : null);
    renderStories(Array.isArray(stories) ? stories : null);
    if (!Array.isArray(prompts)) setFallback('prompts');
    if (!Array.isArray(images)) setFallback('images');
    if (!Array.isArray(songs)) setFallback('songs');
    if (!Array.isArray(stories)) setFallback('stories');
  }).catch(() => {
    setFallback('prompts');
    setFallback('images');
    setFallback('songs');
    setFallback('stories');
  });
}

function initContinueCreating() {
  const section = document.getElementById('continue-creating');
  const contentEl = document.getElementById('continueCreatingContent');
  if (!section || !contentEl) return;

  const DRAFT_TYPE_KEY = 'addEntryDraftType';
  const DRAFT_DATA_KEY = 'addEntryDraftData';
  const VALID_TYPES = ['prompt', 'image', 'song', 'story'];
  const TYPE_LABELS = { prompt: 'Prompt', image: 'Image', song: 'Song', story: 'Story' };

  var truncate = (typeof truncateText === 'function' ? truncateText : function (str, len) { if (!str) return ''; var s = String(str).trim().replace(/\n/g, ' '); return s.length <= len ? s : s.slice(0, len) + '...'; });
  var escape = (typeof escapeHtml === 'function' ? escapeHtml : function (str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); });

  function getDraftSummary(type, data) {
    if (!data || typeof data !== 'object') return '';
    if (type === 'prompt') return truncate(data.prompt, 100);
    if (type === 'image') return truncate(data.prompt || [data.folder, data.file].filter(Boolean).join(' / '), 100);
    if (type === 'song') return truncate(data.lyrics || data.style, 100);
    if (type === 'story') return truncate(data.summary || data.content, 100);
    return '';
  }

  function getDraft() {
    try {
      const savedType = localStorage.getItem(DRAFT_TYPE_KEY);
      const savedDataRaw = localStorage.getItem(DRAFT_DATA_KEY);
      if (!savedType || VALID_TYPES.indexOf(savedType) === -1) return null;
      let data = null;
      if (savedDataRaw) {
        data = JSON.parse(savedDataRaw);
        if (!data || typeof data !== 'object') data = null;
      }
      return { type: savedType, data: data || {} };
    } catch (e) {
      return null;
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_TYPE_KEY);
      localStorage.removeItem(DRAFT_DATA_KEY);
    } catch (e) {}
    render();
  }

  function render() {
    const draft = getDraft();
    if (!draft) {
      contentEl.innerHTML = '<div class="continue-creating-empty">No active draft right now.</div>' +
        '<div class="continue-creating-actions">' +
        '<a href="add-entry.html" class="continue-creating-link btn btn-secondary">Start New Entry</a>' +
        '</div>';
      return;
    }
    const type = draft.type;
    const data = draft.data;
    const title = (data.title || '').toString().trim() || 'Untitled';
    const createdAt = (data.createdAt || '').toString().trim();
    const summary = getDraftSummary(type, data);
    const continueUrl = `add-entry.html?type=${encodeURIComponent(type)}`;

    contentEl.innerHTML = '<div class="continue-creating-card">' +
      '<span class="continue-creating-type">' + escape(TYPE_LABELS[type] || type) + '</span>' +
      '<h3 class="continue-creating-card-title">' + escape(title) + '</h3>' +
      (createdAt ? '<span class="continue-creating-card-date">' + escape(createdAt) + '</span>' : '') +
      (summary ? '<p class="continue-creating-card-text">' + escape(summary) + '</p>' : '') +
      '<div class="continue-creating-actions">' +
      '<a href="' + escape(continueUrl) + '" class="continue-creating-link btn btn-primary">Continue Editing</a>' +
      '<button type="button" class="continue-creating-button btn btn-danger-subtle" id="continueCreatingClearBtn">Clear Draft</button>' +
      '</div>' +
      '</div>';

    const clearBtn = document.getElementById('continueCreatingClearBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearDraft);
  }

  render();
}

function initRecentActivity() {
  const section = document.getElementById('recent-activity');
  const listEl = document.getElementById('recentActivityList');
  if (!section || !listEl) return;

  const DRAFT_TYPE_KEY = 'addEntryDraftType';
  const DRAFT_DATA_KEY = 'addEntryDraftData';
  const VALID_TYPES = ['prompt', 'image', 'song', 'story'];
  const PROMPTS_PATH = './data/prompts.json';
  const IMAGES_PATH = './data/images.json';
  const SONGS_PATH = './data/songs.json';
  const STORIES_PATH = './data/stories.json';

  var escape = (typeof escapeHtml === 'function' ? escapeHtml : function (str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); });
  var getLatest = (typeof getLatestWithDate === 'function' ? getLatestWithDate : function (list) { if (!Array.isArray(list) || list.length === 0) return null; var best = null; var bestDate = ''; list.forEach(function (item) { var d = (item.createdAt || '').toString().trim(); if (!d) return; if (!best || d > bestDate) { best = item; bestDate = d; } }); return best; });

  function getDraft() {
    try {
      const savedType = localStorage.getItem(DRAFT_TYPE_KEY);
      const savedDataRaw = localStorage.getItem(DRAFT_DATA_KEY);
      if (!savedType || VALID_TYPES.indexOf(savedType) === -1) return null;
      let data = null;
      if (savedDataRaw) {
        data = JSON.parse(savedDataRaw);
        if (!data || typeof data !== 'object') data = null;
      }
      return { type: savedType, data: data || {} };
    } catch (e) {
      return null;
    }
  }

  function render(prompts, images, songs, stories) {
    const draft = getDraft();
    const items = [];

    if (draft) {
      const title = (draft.data.title || '').toString().trim() || 'Untitled';
      items.push({
        label: 'Draft in progress',
        text: title,
        date: '',
        link: `add-entry.html?type=${encodeURIComponent(draft.type)}`,
        linkText: 'Continue'
      });
    }

    const latestPrompt = getLatest(Array.isArray(prompts) ? prompts : []);
    if (latestPrompt) {
      const title = (latestPrompt.title || '').toString().trim() || 'Untitled';
      const link = `prompt-library.html?prompt=${encodeURIComponent(latestPrompt.id || '')}`;
      items.push({
        label: 'Latest Prompt',
        text: title,
        date: (latestPrompt.createdAt || '').toString().trim(),
        link: link,
        linkText: 'View'
      });
    }

    const latestImage = getLatest(Array.isArray(images) ? images : []);
    if (latestImage) {
      const title = (latestImage.title || '').toString().trim() || 'Untitled';
      const promptId = (latestImage.promptId || '').toString().trim();
      const link = promptId ? `image-library.html?prompt=${encodeURIComponent(promptId)}` : 'image-library.html';
      items.push({
        label: 'Latest Image',
        text: title,
        date: (latestImage.createdAt || '').toString().trim(),
        link: link,
        linkText: 'View'
      });
    }

    const latestSong = getLatest(Array.isArray(songs) ? songs : []);
    if (latestSong) {
      const title = (latestSong.title || '').toString().trim() || 'Untitled';
      items.push({
        label: 'Latest Song',
        text: title,
        date: (latestSong.createdAt || '').toString().trim(),
        link: 'music-library.html',
        linkText: 'View'
      });
    }

    const latestStory = getLatest(Array.isArray(stories) ? stories : []);
    if (latestStory) {
      const title = (latestStory.title || '').toString().trim() || 'Untitled';
      items.push({
        label: 'Latest Story',
        text: title,
        date: (latestStory.createdAt || '').toString().trim(),
        link: 'story-library.html',
        linkText: 'View'
      });
    }

    if (items.length === 0) {
      listEl.innerHTML = '<div class="recent-activity-empty">No recent activity.</div>';
      return;
    }

    listEl.innerHTML = items.map((item) => {
      return '<div class="recent-activity-item">' +
        '<span class="recent-activity-label">' + escape(item.label) + '</span>' +
        '<span class="recent-activity-text">' + escape(item.text) + '</span>' +
        (item.date ? '<span class="recent-activity-date">' + escape(item.date) + '</span>' : '') +
        '<a href="' + escape(item.link) + '" class="recent-activity-link btn btn-secondary">' + escape(item.linkText) + ' →</a>' +
        '</div>';
    }).join('');
  }

  Promise.all([
    fetch(PROMPTS_PATH).then((r) => r.json()).catch(() => null),
    fetch(IMAGES_PATH).then((r) => r.json()).catch(() => null),
    fetch(SONGS_PATH).then((r) => r.json()).catch(() => null),
    fetch(STORIES_PATH).then((r) => r.json()).catch(() => null)
  ]).then(([prompts, images, songs, stories]) => {
    render(prompts, images, songs, stories);
  }).catch(() => {
    render(null, null, null, null);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  filterVisuals('all');
  initCopyButtons();
  initSavePromptButtons();
  initCreationStats();
  initFeaturedWorks();
  initPromptGenerator();
  initPromptLibrary();
  initEditPromptModal();
  initPromptCollections();
  initLatestAdditions();
  initArchiveStats();
  initFeaturedFavorites();
  initContinueCreating();
  initRecentActivity();

  const highlightId = sessionStorage.getItem('beyond-ai-lab-highlight-prompt');
  if (highlightId) {
    sessionStorage.removeItem('beyond-ai-lab-highlight-prompt');
    setTimeout(() => highlightPromptCard(highlightId), 400);
  }
});
