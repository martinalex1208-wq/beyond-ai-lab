/**
 * Beyond AI Lab - Library Core Helpers
 * Shared logic for prompt-library, image-library, music-library, story-library.
 * Non-breaking: use typeof fn === 'function' ? fn : fallback when consuming.
 */
(function (global) {
  'use strict';

  /**
   * Ensure value is array. Returns [] if not.
   * @param {*} value
   * @returns {Array}
   */
  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  /**
   * Normalize tag search input: trim + toLowerCase.
   * @param {string} value
   * @returns {string}
   */
  function normalizeTagSearch(value) {
    if (value == null) return '';
    return String(value).trim().toLowerCase();
  }

  /**
   * Check if any tag in tags array contains query (case-insensitive).
   * @param {Array} tags
   * @param {string} query - already normalized
   * @returns {boolean}
   */
  function matchesTagSearch(tags, query) {
    if (!query) return true;
    var arr = safeArray(tags);
    return arr.some(function (t) {
      return String(t).toLowerCase().indexOf(query) !== -1;
    });
  }

  /**
   * Sort library items by mode.
   * @param {Array} items
   * @param {string} mode - 'newest' | 'oldest' | 'title-az' | 'title-asc'
   * @returns {Array}
   */
  function sortLibraryItems(items, mode) {
    var list = safeArray(items).slice();
    var m = (mode || 'newest').toLowerCase();
    if (m === 'title-az' || m === 'title-asc') {
      list.sort(function (a, b) {
        var ta = (a.title || '').toLowerCase();
        var tb = (b.title || '').toLowerCase();
        return ta < tb ? -1 : ta > tb ? 1 : 0;
      });
    } else if (m === 'oldest') {
      list.sort(function (a, b) {
        var da = (a.createdAt || '').toString();
        var db = (b.createdAt || '').toString();
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return da < db ? -1 : da > db ? 1 : 0;
      });
    } else {
      list.sort(function (a, b) {
        var da = (a.createdAt || '').toString();
        var db = (b.createdAt || '').toString();
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return da > db ? -1 : da < db ? 1 : 0;
      });
    }
    return list;
  }

  /**
   * Get unique key for item: folder/file > id > series|title.
   * @param {Object} item
   * @returns {string}
   */
  function getItemUniqueKey(item) {
    if (!item) return '';
    var folder = (item.folder || '').toString().replace(/\/$/, '');
    var file = (item.file || '').toString();
    if (folder || file) return folder ? folder + '/' + file : file;
    var id = (item.id || '').toString().trim();
    if (id) return id;
    var series = (item.series || '').toString().trim();
    var title = (item.title || '').toString().trim();
    return series ? series + '|' + title : title || 'untitled';
  }

  /**
   * Get actual favorite state: localStorage overrides item.favorite.
   * @param {Object} item
   * @param {string} storageKey
   * @param {Function|string} [keyGetter] - optional: function(item)=>key or key string; else use getItemUniqueKey
   * @returns {boolean}
   */
  function getActualFavorite(item, storageKey, keyGetter) {
    if (!item) return false;
    var key = typeof keyGetter === 'function' ? keyGetter(item) : (typeof keyGetter === 'string' ? keyGetter : getItemUniqueKey(item));
    if (!key) return item.favorite === true;
    try {
      var raw = localStorage.getItem(storageKey);
      var stored = raw ? JSON.parse(raw) : {};
      if (stored.hasOwnProperty(key)) return stored[key] === true;
    } catch (e) {}
    return item.favorite === true;
  }

  /**
   * Build empty state HTML with CTA.
   * @param {string} message
   * @param {string} href
   * @param {string} label
   * @returns {string}
   */
  function buildLibraryEmptyState(message, href, label) {
    var m = (message || '').trim();
    var h = (href || '#').trim().replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    var l = (label || 'Add').trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return m + '<div class="library-empty-action"><a href="' + h + '" class="library-empty-action-link btn btn-secondary">' + l + '</a></div>';
  }

  /**
   * Format mood into tokens array (uses splitMood from helpers if available).
   * @param {string|Array} mood
   * @returns {Array<string>}
   */
  function formatMoodTokens(mood) {
    if (typeof splitMood === 'function') return splitMood(mood);
    if (Array.isArray(mood)) return mood.map(function (m) { return String(m).trim(); }).filter(Boolean);
    if (!mood) return [];
    return String(mood).split(/[,·|]/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /**
   * Check if item mood matches selected mood (comma-separated tokens).
   * @param {string|Array} itemMood
   * @param {string} selectedMood
   * @returns {boolean}
   */
  function matchMoodToken(itemMood, selectedMood) {
    if (!selectedMood || !String(selectedMood).trim()) return true;
    var tokens = formatMoodTokens(itemMood);
    var val = String(selectedMood).trim();
    return tokens.indexOf(val) !== -1;
  }

  // Expose to global (window)
  global.safeArray = safeArray;
  global.normalizeTagSearch = normalizeTagSearch;
  global.matchesTagSearch = matchesTagSearch;
  global.sortLibraryItems = sortLibraryItems;
  global.getItemUniqueKey = getItemUniqueKey;
  global.getActualFavorite = getActualFavorite;
  global.buildLibraryEmptyState = buildLibraryEmptyState;
  global.formatMoodTokens = formatMoodTokens;
  global.matchMoodToken = matchMoodToken;

})(typeof window !== 'undefined' ? window : this);
