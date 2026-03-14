/**
 * Visual Lab - Category Filter & Lightbox
 * Beyond AI Lab v4
 */

const galleryImages = [
  "ai_girl_01.png",
  "ai_girl_02.png",
  "ai_girl_03.png",
  "ai_girl_04.jpg",
  "ai_girl_05.jpg",
  "ai_girl_06.jpg",
  "ai_girl_07.jpg",
  "ai_girl_08.jpg",
  "ai_girl_09.jpg",
  "ai_girl_10.jpg",
  "ai_girl_11.jpg",
  "ai_girl_12.jpg",
  "ai_girl_13.jpg",
  "ai_girl_14.jpg",
  "ai_girl_15.jpg",
  "ai_girl_16.jpg",
  "ai_girl_17.jpg",
  "ai_girl_18.jpg",
  "ai_girl_bohemian_01.png",
  "ai_girl_bohemian_02.png",
  "ai_girl_coffee-01.jpg",
  "ai_girl_coffee-02.jpg",
  "ai_girl_european_01.png",
  "ai_girl_european_02.png",
  "interior_modern_01.jpg",
  "interior_modern_02.jpg",
  "scifi_city_01.jpg",
  "scifi_city_02.jpg",
  "warrior_snow_01.jpg",
  "warrior_snow_02.jpg",
  "warrior_snow_03.jpg",
  "warrior_snow_04.jpg"
];

let currentSort = 'newest';
let currentFilter = 'all';
let currentLightboxIndex = 0;
let lightboxImages = [];

const TITLE_FORMAT = {
  ai: 'AI',
  girl: 'Girl',
  warrior: 'Warrior',
  scifi: 'SciFi',
  coffee: 'Coffee',
  bohemian: 'Bohemian',
  european: 'European'
};

const CATEGORY_DISPLAY = {
  portrait: 'Portrait',
  lifestyle: 'Lifestyle',
  cinematic: 'Cinematic',
  fantasy: 'Fantasy',
  experimental: 'Experimental'
};

const VISUAL_PROMPT_LINKS_KEY = 'beyond-ai-lab-visual-prompt-links';
const SAVED_PROMPTS_KEY = 'beyond-ai-lab-saved-prompts';
const COLLECTIONS_KEY = 'beyond-ai-lab-prompt-collections';
const ARTWORK_METADATA_KEY = 'beyond-ai-lab-artwork-metadata';
const ARTWORK_CUSTOM_KEY = 'beyond-ai-lab-artwork-custom';

const PROMPT_LIBRARY_BUILTIN = [
  { id: 0, title: 'Sunlit Morning Girl', category: 'portrait', prompt: 'A hyper-realistic portrait of a joyful young woman in soft morning sunlight...', tags: ['female', 'sunlight', 'portrait'] },
  { id: 1, title: 'Fashion Editorial Noir', category: 'fashion', prompt: 'A fashion editorial portrait, high contrast black and white...', tags: ['fashion', 'black', 'white', 'editorial'] },
  { id: 2, title: 'Cyberpunk Street Samurai', category: 'scifi', prompt: 'A futuristic sci-fi portrait of a samurai in neon-lit cyberpunk city...', tags: ['cyberpunk', 'neon', 'samurai'] },
  { id: 3, title: 'Elven Forest Guardian', category: 'fantasy', prompt: 'A fantasy-style elven warrior in mystical forest...', tags: ['fantasy', 'elf', 'forest'] },
  { id: 4, title: 'Studio Portrait Elegance', category: 'portrait', prompt: 'Professional studio portrait, soft diffused lighting...', tags: ['studio', 'portrait', 'elegant'] },
  { id: 5, title: 'Runway Fashion Moment', category: 'fashion', prompt: 'A fashion editorial shot of a model on runway...', tags: ['fashion', 'runway', 'editorial'] },
  { id: 6, title: 'Space Station Interior', category: 'scifi', prompt: 'A futuristic sci-fi interior of a space station...', tags: ['scifi', 'space', 'interior'] },
  { id: 7, title: 'Dragon Rider Epic', category: 'fantasy', prompt: 'A fantasy-style dragon rider soaring over mountains...', tags: ['fantasy', 'dragon', 'epic'] },
  { id: 8, title: 'Golden Hour Portrait', category: 'portrait', prompt: 'A hyper-realistic portrait in golden hour sunlight...', tags: ['portrait', 'golden', 'hour'] },
  { id: 9, title: 'Luxury Brand Campaign', category: 'fashion', prompt: 'A fashion editorial for luxury brand campaign...', tags: ['fashion', 'luxury', 'campaign'] },
  { id: 10, title: 'Neon City Explorer', category: 'scifi', prompt: 'A futuristic sci-fi portrait in neon-lit city...', tags: ['scifi', 'neon', 'cyberpunk'] },
  { id: 11, title: 'Mystic Sorceress', category: 'fantasy', prompt: 'A fantasy-style sorceress with magical aura...', tags: ['fantasy', 'magic', 'sorceress'] }
];

function getVisualLinks() {
  try {
    const raw = localStorage.getItem(VISUAL_PROMPT_LINKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setVisualLink(filename, data) {
  const links = getVisualLinks();
  links[filename] = data;
  localStorage.setItem(VISUAL_PROMPT_LINKS_KEY, JSON.stringify(links));
}

function removeVisualLink(filename) {
  const links = getVisualLinks();
  delete links[filename];
  localStorage.setItem(VISUAL_PROMPT_LINKS_KEY, JSON.stringify(links));
}

function getPromptById(id) {
  return getPromptByIdForLinks(id);
}

function getCollectionById(id) {
  return getCollectionByIdForLinks(id);
}

function getSavedPromptsForLinks() {
  try {
    const raw = localStorage.getItem(SAVED_PROMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getMergedLibraryForLinks() {
  return [...PROMPT_LIBRARY_BUILTIN, ...getSavedPromptsForLinks()];
}

function getPromptByIdForLinks(id) {
  const library = getMergedLibraryForLinks();
  const strId = String(id);
  return library.find((p) => String(p.id) === strId);
}

function getCollectionsForLinks() {
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getCollectionByIdForLinks(id) {
  return getCollectionsForLinks().find((c) => c.id === id);
}

// --- Artwork Manager ---
function getArtworkOverrides() {
  try {
    const raw = localStorage.getItem(ARTWORK_METADATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (_) {}
  return {};
}

function setArtworkOverride(id, data) {
  const overrides = getArtworkOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...data };
  localStorage.setItem(ARTWORK_METADATA_KEY, JSON.stringify(overrides));
}

function getCustomArtworks() {
  try {
    const raw = localStorage.getItem(ARTWORK_CUSTOM_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

function saveCustomArtwork(data) {
  const list = getCustomArtworks();
  const id = data.id || `custom-${Date.now()}`;
  const entry = { id, imagePath: data.imagePath, title: data.title, category: data.category || '', description: data.description || '', prompt: data.prompt || '', pinterest: data.pinterest || '', styleName: data.styleName || '', linkedPromptId: data.linkedPromptId || null, linkedCollectionId: data.linkedCollectionId || null, featured: !!data.featured };
  list.push(entry);
  localStorage.setItem(ARTWORK_CUSTOM_KEY, JSON.stringify(list));
  return id;
}

function softDeleteArtwork(id) {
  if (id.startsWith('custom-')) {
    const list = getCustomArtworks().filter((a) => a.id !== id);
    localStorage.setItem(ARTWORK_CUSTOM_KEY, JSON.stringify(list));
    const links = getVisualLinks();
    delete links[id];
    localStorage.setItem(VISUAL_PROMPT_LINKS_KEY, JSON.stringify(links));
  } else {
    setArtworkOverride(id, { deleted: true });
  }
}

function getCategoryClassForFilter(categoryLabel) {
  const s = (categoryLabel || '').toLowerCase();
  if (/portrait|ai girl|female|bohemian|european/.test(s)) return 'portrait';
  if (/lifestyle|cafe|street|coffee|interior|bookstore|park/.test(s)) return 'lifestyle';
  if (/cinematic|scifi|sci-fi|sci fi|neon|cyberpunk|film/.test(s)) return 'cinematic';
  if (/fantasy|warrior|dragon|mage|armor|mythical/.test(s)) return 'fantasy';
  if (/experimental|abstract|mixed/.test(s)) return 'experimental';
  return 'experimental';
}

function getArtworkList() {
  const overrides = getArtworkOverrides();
  const custom = getCustomArtworks();
  const builtIn = galleryImages.filter((f) => !overrides[f]?.deleted);
  const customFiltered = custom.filter((a) => !overrides[a.id]?.deleted);
  return builtIn.map((f) => ({ id: f, type: 'builtin' })).concat(customFiltered.map((a) => ({ id: a.id, type: 'custom' })));
}

function getMetadataForArtwork(id) {
  const overrides = getArtworkOverrides();
  const links = getVisualLinks();
  const link = links[id] || {};
  const custom = getCustomArtworks().find((a) => a.id === id);
  if (custom) {
    const o = overrides[id] || {};
    return {
      title: o.title ?? custom.title,
      category: o.category ?? custom.category,
      categoryLabel: o.category ?? custom.category,
      description: o.description ?? custom.description,
      prompt: o.prompt ?? custom.prompt,
      pinterest: o.pinterest ?? custom.pinterest,
      styleName: o.styleName ?? custom.styleName ?? link.styleName ?? '',
      imagePath: custom.imagePath,
      linkedPromptId: o.linkedPromptId ?? custom.linkedPromptId ?? link.promptId ?? '',
      linkedCollectionId: o.linkedCollectionId ?? custom.linkedCollectionId ?? link.collectionId ?? '',
      featured: o.featured ?? custom.featured ?? false
    };
  }
  const meta = getMetadataForFilename(id);
  const o = overrides[id] || {};
  return {
    title: o.title ?? meta.title,
    category: o.category ?? meta.category,
    categoryLabel: o.categoryLabel ?? meta.categoryLabel ?? meta.category,
    description: o.description ?? meta.description,
    prompt: o.prompt ?? meta.prompt,
    pinterest: o.pinterest ?? meta.pinterest,
    styleName: o.styleName ?? link.styleName ?? meta.styleName ?? '',
    imagePath: `./images/gallery/${id}`,
    linkedPromptId: o.linkedPromptId ?? link.promptId ?? '',
    linkedCollectionId: o.linkedCollectionId ?? link.collectionId ?? '',
    featured: o.featured ?? false
  };
}

function syncVisualLinkFromMetadata(id, meta) {
  if (meta.linkedPromptId) {
    setVisualLink(id, {
      promptId: /^\d+$/.test(meta.linkedPromptId) ? Number(meta.linkedPromptId) : meta.linkedPromptId,
      collectionId: meta.linkedCollectionId || undefined,
      styleName: meta.styleName || ''
    });
  } else {
    removeVisualLink(id);
  }
}

function getCategoryFromFilename(filename) {
  const name = filename.replace(/\.(jpeg|jpg|png|webp)$/i, '');
  const lower = name.toLowerCase();

  if (/warrior/.test(lower)) return 'fantasy';
  if (/sci-fi|scifi|sci_fi/.test(lower)) return 'cinematic';
  if (/coffee|interior/.test(lower)) return 'lifestyle';
  if (/ai_girl|^female|^ai|bohemian|european/.test(lower)) return 'portrait';

  return 'experimental';
}

function getCategoryCounts() {
  const counts = { all: 0, portrait: 0, lifestyle: 0, cinematic: 0, fantasy: 0, experimental: 0 };
  getArtworkList().forEach(({ id, type }) => {
    const meta = getMetadataForArtwork(id);
    const cat = type === 'builtin' ? getCategoryFromFilename(id) : getCategoryClassForFilter(meta.category);
    counts.all += 1;
    if (counts.hasOwnProperty(cat)) counts[cat] += 1;
  });
  return counts;
}

function updateFilterButtons() {
  const counts = getCategoryCounts();
  const labels = {
    all: `All (${counts.all})`,
    portrait: `Portrait (${counts.portrait || 0})`,
    lifestyle: `Lifestyle (${counts.lifestyle || 0})`,
    cinematic: `Cinematic (${counts.cinematic || 0})`,
    fantasy: `Fantasy (${counts.fantasy || 0})`,
    experimental: `Experimental (${counts.experimental || 0})`
  };
  document.querySelectorAll('.visual-filter button[data-category]').forEach((btn) => {
    const cat = btn.dataset.category;
    if (labels[cat] !== undefined) btn.textContent = labels[cat];
  });
}

function getCategoryDisplay(category) {
  return CATEGORY_DISPLAY[category] || 'Experimental';
}

function getMetadataForFilename(filename) {
  const title = formatTitle(filename);
  const category = getCategoryFromFilename(filename);
  const categoryLabel = getCategoryDisplay(category);
  const prompt = `A hyper-realistic ${title.toLowerCase()}, ${categoryLabel.toLowerCase()} style, professional photography quality, 8K, photorealistic, detailed textures, cinematic composition.`;
  const description = `A ${categoryLabel} artwork featuring ${title}. AI-generated visual with refined details and atmospheric depth.`;
  const pinterest = `${title} – ${categoryLabel} AI artwork with professional quality and elegant composition.`;
  return { title, category: categoryLabel, description, prompt, pinterest };
}

function formatTitle(filename) {
  let name = filename.replace(/\.(jpeg|jpg|png|webp)$/i, '');
  const words = name.split(/[_-]/);
  return words.map((w) => {
    const lower = w.toLowerCase();
    return TITLE_FORMAT[lower] || (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }).join(' ');
}

function getSortedArtworks() {
  const list = getArtworkList();
  const withTitle = list.map((a) => ({ ...a, title: getMetadataForArtwork(a.id).title }));
  if (currentSort === 'newest') return [...withTitle].reverse();
  if (currentSort === 'oldest') return withTitle;
  if (currentSort === 'az') {
    return [...withTitle].sort((a, b) => a.title.localeCompare(b.title));
  }
  return withTitle;
}

function getVisibleImages() {
  const sorted = getSortedArtworks();
  return sorted.filter((a) => {
    const meta = getMetadataForArtwork(a.id);
    const cat = a.type === 'builtin' ? getCategoryFromFilename(a.id) : getCategoryClassForFilter(meta.category);
    if (currentFilter === 'all') return true;
    return cat === currentFilter;
  }).map((a) => a.id);
}

function changeSort(sortType) {
  currentSort = sortType;
  renderGallery();
  filterSelection(currentFilter);
  bindLightbox();
}

function bindLightbox() {
  const images = document.querySelectorAll('.visual-gallery img');
  const visible = getVisibleImages();
  images.forEach((img) => {
    const id = img.dataset.id || img.getAttribute('data-id') || (img.src && img.src.split('/').pop());
    const idx = visible.indexOf(id);
    if (idx === -1) return;
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightboxByIndex(idx);
    });
  });
}

function renderGallery() {
  const gallery = document.querySelector('.visual-gallery');
  if (!gallery) return;

  gallery.innerHTML = '';

  const sorted = getSortedArtworks();
  sorted.forEach((a) => {
    const meta = getMetadataForArtwork(a.id);
    const category = a.type === 'builtin' ? getCategoryFromFilename(a.id) : getCategoryClassForFilter(meta.category);
    const categoryLabel = meta.categoryLabel || meta.category || getCategoryDisplay(category);
    const card = `
      <div class="gallery-item ${category}"
           data-id="${escapeAttr(a.id)}"
           data-filename="${escapeAttr(a.id)}"
           data-title="${escapeAttr(meta.title)}"
           data-description="${escapeAttr(meta.description)}"
           data-prompt="${escapeAttr(meta.prompt)}"
           data-pinterest="${escapeAttr(meta.pinterest)}"
           data-category-label="${escapeAttr(categoryLabel)}"
           data-linked-prompt-id="${escapeAttr(meta.linkedPromptId || '')}"
           data-linked-collection-id="${escapeAttr(meta.linkedCollectionId || '')}"
           data-style-name="${escapeAttr(meta.styleName || '')}">
        <img src="${escapeAttr(meta.imagePath)}" alt="${escapeAttr(meta.title)}" data-id="${escapeAttr(a.id)}">
        <div class="gallery-info">
          <h3>${escapeAttr(meta.title)}</h3>
          <span class="visual-category">${escapeAttr(categoryLabel)}</span>
        </div>
        <div class="gallery-item-actions">
          <button type="button" class="artwork-action-btn artwork-edit-btn" data-id="${escapeAttr(a.id)}" title="Edit Artwork">Edit</button>
          <button type="button" class="artwork-action-btn artwork-delete-btn" data-id="${escapeAttr(a.id)}" title="Delete Artwork">Delete</button>
          <button type="button" class="artwork-action-btn artwork-relink-btn" data-id="${escapeAttr(a.id)}" title="Relink Prompt">Relink</button>
        </div>
      </div>
    `;
    gallery.insertAdjacentHTML('beforeend', card);
  });
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function updateLightboxCounter() {
  const el = document.getElementById('lightbox-counter');
  if (el && lightboxImages.length > 0) {
    el.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
  }
}

function getCurrentLightboxMetadata() {
  const id = lightboxImages[currentLightboxIndex];
  const meta = getMetadataForArtwork(id);
  return { ...meta, filename: id };
}

function updateLightboxMetadata() {
  const meta = getCurrentLightboxMetadata();
  const linkedPrompt = meta.linkedPromptId ? getPromptById(meta.linkedPromptId) : null;
  const linkedCollection = meta.linkedCollectionId ? getCollectionById(meta.linkedCollectionId) : null;
  const linkedPromptTitle = linkedPrompt ? linkedPrompt.title : (meta.linkedPromptId ? 'Not found' : 'Not linked');
  const linkedCollectionName = linkedCollection ? linkedCollection.name : (meta.linkedCollectionId ? 'Not found' : '—');

  const catEl = document.getElementById('lightbox-category');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-description');
  const promptEl = document.getElementById('lightbox-prompt');
  const pinterestEl = document.getElementById('lightbox-pinterest');

  if (catEl) catEl.textContent = meta.category;
  if (titleEl) titleEl.textContent = meta.title;
  if (descEl) descEl.textContent = meta.description;
  if (promptEl) promptEl.textContent = meta.prompt;
  if (pinterestEl) pinterestEl.textContent = meta.pinterest || '—';

  const styleEl = document.getElementById('lightbox-style-name');
  const linkedPromptEl = document.getElementById('lightbox-linked-prompt');
  const linkedCollEl = document.getElementById('lightbox-linked-collection');
  const actionsEl = document.getElementById('lightbox-linked-actions');

  if (styleEl) styleEl.textContent = meta.styleName || '—';
  if (linkedPromptEl) linkedPromptEl.textContent = linkedPromptTitle;
  if (linkedCollEl) linkedCollEl.textContent = linkedCollectionName;

  if (actionsEl) {
    const hasLinkedPrompt = meta.linkedPromptId && linkedPrompt;
    const hasLinkedCollection = meta.linkedCollectionId && linkedCollection;
    let html = '<button type="button" class="lightbox-link-btn export-btn lightbox-link-to-prompt">Link to Prompt</button>';
    if (hasLinkedPrompt) {
      html += '<button type="button" class="lightbox-link-btn export-btn lightbox-linked-copy">Copy Linked Prompt</button>';
      html += '<button type="button" class="lightbox-link-btn export-btn lightbox-open-in-library">Open in Library</button>';
    }
    if (hasLinkedCollection) {
      html += '<button type="button" class="lightbox-link-btn export-btn lightbox-view-collection">View Collection</button>';
    }
    actionsEl.innerHTML = html;
  }
}

function openLightboxByIndex(index) {
  lightboxImages = getVisibleImages();
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = ((index % lightboxImages.length) + lightboxImages.length) % lightboxImages.length;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    const meta = getMetadataForArtwork(lightboxImages[currentLightboxIndex]);
    lightboxImg.src = meta.imagePath;
    lightboxImg.alt = meta.title;
    lightbox.style.display = 'flex';
    updateLightboxCounter();
    updateLightboxMetadata();
  }
}

function prevLightboxImage(e) {
  e.stopPropagation();
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  const img = document.getElementById('lightbox-img');
  const meta = getMetadataForArtwork(lightboxImages[currentLightboxIndex]);
  img.src = meta.imagePath;
  img.alt = meta.title;
  updateLightboxCounter();
  updateLightboxMetadata();
}

function nextLightboxImage(e) {
  e.stopPropagation();
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
  const img = document.getElementById('lightbox-img');
  const meta = getMetadataForArtwork(lightboxImages[currentLightboxIndex]);
  img.src = meta.imagePath;
  img.alt = meta.title;
  updateLightboxCounter();
  updateLightboxMetadata();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
  }
}

let currentArtworkForLink = null;

function openLinkToPromptModal(artworkId) {
  currentArtworkForLink = artworkId ?? (lightboxImages.length > 0 ? lightboxImages[currentLightboxIndex] : null);
  const modal = document.getElementById('linkPromptModal');
  const list = document.getElementById('linkPromptList');
  if (!modal || !list) return;
  const library = getMergedLibraryForLinks();
  const collections = getCollectionsForLinks();
  list.innerHTML = library.map((p) => {
    const inColl = collections.find((c) => (c.promptIds || []).some((id) => String(id) === String(p.id)));
    return `<button type="button" class="link-prompt-row" data-prompt-id="${escapeAttr(String(p.id))}" data-collection-id="${escapeAttr(inColl ? inColl.id : '')}">${escapeAttr(p.title || 'Untitled')}</button>`;
  }).join('');
  modal.classList.add('link-prompt-modal--open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeLinkToPromptModal() {
  const modal = document.getElementById('linkPromptModal');
  if (modal) {
    modal.classList.remove('link-prompt-modal--open');
    modal.setAttribute('aria-hidden', 'true');
  }
  currentArtworkForLink = null;
}

function openEditArtworkModal(id) {
  const modal = document.getElementById('editArtworkModal');
  if (!modal) return;
  const meta = getMetadataForArtwork(id);
  document.getElementById('editArtworkTitle').value = meta.title || '';
  document.getElementById('editArtworkCategory').value = meta.category || meta.categoryLabel || '';
  document.getElementById('editArtworkDescription').value = meta.description || '';
  document.getElementById('editArtworkPrompt').value = meta.prompt || '';
  document.getElementById('editArtworkPinterest').value = meta.pinterest || '';
  document.getElementById('editArtworkStyleName').value = meta.styleName || '';
  document.getElementById('editArtworkLinkedPromptId').value = meta.linkedPromptId || '';
  document.getElementById('editArtworkLinkedCollectionId').value = meta.linkedCollectionId || '';
  document.getElementById('editArtworkFeatured').checked = !!meta.featured;
  modal.dataset.editId = id;
  modal.classList.add('edit-artwork-modal--open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeEditArtworkModal() {
  const modal = document.getElementById('editArtworkModal');
  if (modal) {
    modal.classList.remove('edit-artwork-modal--open');
    modal.setAttribute('aria-hidden', 'true');
    delete modal.dataset.editId;
  }
}

function saveEditArtwork(e) {
  e.preventDefault();
  const modal = document.getElementById('editArtworkModal');
  const id = modal?.dataset.editId;
  if (!id) return;
  const data = {
    title: document.getElementById('editArtworkTitle').value.trim(),
    category: document.getElementById('editArtworkCategory').value.trim(),
    description: document.getElementById('editArtworkDescription').value.trim(),
    prompt: document.getElementById('editArtworkPrompt').value.trim(),
    pinterest: document.getElementById('editArtworkPinterest').value.trim(),
    styleName: document.getElementById('editArtworkStyleName').value.trim(),
    linkedPromptId: document.getElementById('editArtworkLinkedPromptId').value.trim() || null,
    linkedCollectionId: document.getElementById('editArtworkLinkedCollectionId').value.trim() || null,
    featured: document.getElementById('editArtworkFeatured').checked
  };
  if (id.startsWith('custom-')) {
    const custom = getCustomArtworks().find((a) => a.id === id);
    if (custom) {
      const list = getCustomArtworks().filter((a) => a.id !== id);
      list.push({ ...custom, ...data });
      localStorage.setItem(ARTWORK_CUSTOM_KEY, JSON.stringify(list));
    }
  } else {
    setArtworkOverride(id, data);
  }
  if (data.linkedPromptId) {
    syncVisualLinkFromMetadata(id, data);
  } else {
    removeVisualLink(id);
  }
  closeEditArtworkModal();
  renderGallery();
  updateFilterButtons();
  if (isLightboxOpen() && lightboxImages[currentLightboxIndex] === id) updateLightboxMetadata();
}

function openAddArtworkModal() {
  const modal = document.getElementById('addArtworkModal');
  if (!modal) return;
  document.getElementById('addArtworkForm').reset();
  modal.classList.add('edit-artwork-modal--open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeAddArtworkModal() {
  const modal = document.getElementById('addArtworkModal');
  if (modal) {
    modal.classList.remove('edit-artwork-modal--open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function saveAddArtwork(e) {
  e.preventDefault();
  const imagePath = document.getElementById('addArtworkImagePath').value.trim();
  const title = document.getElementById('addArtworkTitle').value.trim();
  if (!imagePath || !title) return;
  const data = {
    imagePath,
    title,
    category: document.getElementById('addArtworkCategory').value.trim(),
    description: document.getElementById('addArtworkDescription').value.trim(),
    prompt: document.getElementById('addArtworkPrompt').value.trim(),
    pinterest: document.getElementById('addArtworkPinterest').value.trim(),
    styleName: document.getElementById('addArtworkStyleName').value.trim(),
    featured: document.getElementById('addArtworkFeatured').checked
  };
  saveCustomArtwork(data);
  closeAddArtworkModal();
  renderGallery();
  updateFilterButtons();
}

function isLightboxOpen() {
  const lightbox = document.getElementById('lightbox');
  return lightbox && lightbox.style.display === 'flex';
}

function handleLightboxKeydown(e) {
  if (!isLightboxOpen()) return;
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevLightboxImage({ stopPropagation: () => {} });
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextLightboxImage({ stopPropagation: () => {} });
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closeLightbox();
  }
}

function handleLightboxWheel(e) {
  if (!isLightboxOpen()) return;
  e.preventDefault();
  if (e.deltaY < 0) {
    prevLightboxImage({ stopPropagation: () => {} });
  } else if (e.deltaY > 0) {
    nextLightboxImage({ stopPropagation: () => {} });
  }
}

function filterSelection(category) {
  currentFilter = category;
  const items = document.getElementsByClassName('gallery-item');
  for (let i = 0; i < items.length; i++) {
    const match = category === 'all' || items[i].classList.contains(category);
    items[i].style.display = match ? 'inline-block' : 'none';
  }

  const filterBtns = document.querySelectorAll('.visual-filter button');
  filterBtns.forEach((btn) => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.visual-filter button[data-category="${category}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function generateImage() {
  const prompt = document.getElementById('promptInput').value;
  const result = document.getElementById('generatedResult');
  result.innerHTML = `
<div class="generated-card">
<p>Prompt:</p>
<p>${prompt}</p>
<p>(AI generation simulation)</p>
</div>
`;
}

let _photoSeriesLightboxInitialized = false;

function initPhotoSeriesLightbox() {
  if (_photoSeriesLightboxInitialized) return;
  const grid = document.querySelector('.photo-series .photo-grid');
  const lightbox = document.getElementById('photoSeriesLightbox');
  const lightboxImg = document.getElementById('photoSeriesLightboxImg');
  const closeBtn = document.querySelector('.photo-series-lightbox-close');

  if (!grid || !lightbox || !lightboxImg || !closeBtn) {
    console.warn('Photo series lightbox elements not found');
    return;
  }
  _photoSeriesLightboxInitialized = true;

  grid.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('is-open');
  });

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('is-open');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('is-open');
    }
  });
}

function init() {
  renderGallery();

  const filterBtns = document.querySelectorAll('.filter-btn');
  const imageCards = document.querySelectorAll('.image-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      imageCards.forEach((card) => {
        const category = card.dataset.category;
        const match = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  updateFilterButtons();
  filterSelection('all');
  bindLightbox();

  const hash = window.location.hash || '';
  const artworkMatch = hash.match(/[#&]artwork=([^&]+)/);
  if (artworkMatch) {
    const targetId = decodeURIComponent(artworkMatch[1]);
    const visible = getVisibleImages();
    const idx = visible.indexOf(targetId);
    if (idx >= 0) {
      setTimeout(() => openLightboxByIndex(idx), 100);
    }
  }

  const lightboxCloseBtn = document.querySelector('.lightbox-close');
  if (lightboxCloseBtn) {
    lightboxCloseBtn.onclick = function (e) {
      e.stopPropagation();
      closeLightbox();
    };
  }

  document.getElementById('lightbox-copy-prompt')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const promptEl = document.getElementById('lightbox-prompt');
    const text = promptEl ? promptEl.innerText : '';
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = e.target;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy Prompt'; }, 2000);
      });
    }
  });

  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.lightbox-linked-copy, .lightbox-open-in-library, .lightbox-view-collection, .lightbox-link-to-prompt');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const artworkId = lightboxImages[currentLightboxIndex];
    if (!artworkId) return;
    const link = getVisualLinks()[artworkId] || {};
    const promptId = link.promptId;
    const collectionId = link.collectionId;
    const promptData = promptId ? getPromptById(promptId) : null;
    const collectionData = collectionId ? getCollectionById(collectionId) : null;

    if (btn.classList.contains('lightbox-linked-copy') && promptData?.prompt) {
      navigator.clipboard.writeText(promptData.prompt).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy Linked Prompt'; }, 2000);
      });
    } else if (btn.classList.contains('lightbox-open-in-library') && promptId) {
      sessionStorage.setItem('beyond-ai-lab-highlight-prompt', String(promptId));
      window.location.href = 'index.html#prompt-library';
    } else if (btn.classList.contains('lightbox-view-collection') && collectionId) {
      sessionStorage.setItem('beyond-ai-lab-select-collection', String(collectionId));
      window.location.href = 'index.html#prompt-collections';
    } else if (btn.classList.contains('lightbox-link-to-prompt')) {
      openLinkToPromptModal(artworkId);
    }
  });

  document.getElementById('linkPromptCloseBtn')?.addEventListener('click', closeLinkToPromptModal);
  document.getElementById('linkPromptModalBackdrop')?.addEventListener('click', closeLinkToPromptModal);
  document.getElementById('linkPromptUnlinkBtn')?.addEventListener('click', () => {
    const artworkId = currentArtworkForLink ?? lightboxImages[currentLightboxIndex];
    if (artworkId) {
      removeVisualLink(artworkId);
      closeLinkToPromptModal();
      currentArtworkForLink = null;
      updateLightboxMetadata();
      renderGallery();
    }
  });
  document.getElementById('linkPromptList')?.addEventListener('click', (e) => {
    const row = e.target.closest('[data-prompt-id]');
    if (!row) return;
    const promptId = row.dataset.promptId;
    const artworkId = currentArtworkForLink ?? lightboxImages[currentLightboxIndex];
    if (promptId && artworkId) {
      const promptData = getPromptById(promptId);
      const collectionId = promptData ? (row.dataset.collectionId || '') : '';
      setVisualLink(artworkId, {
        promptId: /^\d+$/.test(promptId) ? Number(promptId) : promptId,
        collectionId: collectionId || undefined,
        styleName: promptData?.category ? (promptData.category.charAt(0).toUpperCase() + promptData.category.slice(1)) : ''
      });
      closeLinkToPromptModal();
      currentArtworkForLink = null;
      updateLightboxMetadata();
      renderGallery();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('linkPromptModal')?.classList.contains('link-prompt-modal--open')) {
      closeLinkToPromptModal();
    }
    if (e.key === 'Escape' && document.getElementById('editArtworkModal')?.classList.contains('edit-artwork-modal--open')) {
      closeEditArtworkModal();
    }
    if (e.key === 'Escape' && document.getElementById('addArtworkModal')?.classList.contains('edit-artwork-modal--open')) {
      closeAddArtworkModal();
    }
  });

  document.getElementById('addArtworkBtn')?.addEventListener('click', openAddArtworkModal);
  document.getElementById('editArtworkForm')?.addEventListener('submit', saveEditArtwork);
  document.getElementById('editArtworkCancelBtn')?.addEventListener('click', closeEditArtworkModal);
  document.querySelector('#editArtworkModal .edit-artwork-modal-backdrop')?.addEventListener('click', closeEditArtworkModal);
  document.getElementById('addArtworkForm')?.addEventListener('submit', saveAddArtwork);
  document.getElementById('addArtworkCancelBtn')?.addEventListener('click', closeAddArtworkModal);
  document.querySelector('#addArtworkModal .edit-artwork-modal-backdrop')?.addEventListener('click', closeAddArtworkModal);

  document.querySelector('.visual-gallery')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.artwork-edit-btn');
    const deleteBtn = e.target.closest('.artwork-delete-btn');
    const relinkBtn = e.target.closest('.artwork-relink-btn');
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      openEditArtworkModal(editBtn.dataset.id);
    } else if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (confirm('Delete this artwork from the gallery? (Image file will not be removed)')) {
        softDeleteArtwork(deleteBtn.dataset.id);
        renderGallery();
        updateFilterButtons();
        if (isLightboxOpen() && lightboxImages[currentLightboxIndex] === deleteBtn.dataset.id) closeLightbox();
      }
    } else if (relinkBtn) {
      e.preventDefault();
      e.stopPropagation();
      openLinkToPromptModal(relinkBtn.dataset.id);
    }
  });

  document.addEventListener('keydown', handleLightboxKeydown);
  document.addEventListener('wheel', handleLightboxWheel, { passive: false });

  // Photo Series Lightbox (event delegation for stability)
  initPhotoSeriesLightbox();
}

document.addEventListener('DOMContentLoaded', init);

// 獨立初始化：不依賴 init()，確保 photo series lightbox 一定會被綁定
document.addEventListener('DOMContentLoaded', () => {
  initPhotoSeriesLightbox();
});
