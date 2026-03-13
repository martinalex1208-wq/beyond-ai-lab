/**
 * Beyond AI Lab - Shared JavaScript Helpers
 * Non-breaking, compatible with plain script loading.
 */
(function (global) {
  'use strict';

  /**
   * Safely fetch JSON and return array. Returns [] on failure or if not array.
   * @param {string} url
   * @returns {Promise<Array>}
   */
  function fetchJsonArray(url) {
    return fetch(url)
      .then(function (res) { return res.json(); })
      .catch(function () { return null; })
      .then(function (data) {
        return Array.isArray(data) ? data : [];
      });
  }

  /**
   * Sort items by createdAt descending (newest first).
   * @param {Array} items
   * @returns {Array}
   */
  function sortByCreatedAtDesc(items) {
    if (!Array.isArray(items)) return [];
    return items.slice().sort(function (a, b) {
      var da = (a.createdAt || '').toString();
      var db = (b.createdAt || '').toString();
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da > db ? -1 : da < db ? 1 : 0;
    });
  }

  /**
   * Sort items by createdAt ascending (oldest first).
   * @param {Array} items
   * @returns {Array}
   */
  function sortByCreatedAtAsc(items) {
    if (!Array.isArray(items)) return [];
    return items.slice().sort(function (a, b) {
      var da = (a.createdAt || '').toString();
      var db = (b.createdAt || '').toString();
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da < db ? -1 : da > db ? 1 : 0;
    });
  }

  /**
   * Truncate text with ellipsis.
   * @param {string} text
   * @param {number} maxLength
   * @returns {string}
   */
  function truncateText(text, maxLength) {
    if (!text) return '';
    var s = String(text).trim().replace(/\n/g, ' ');
    return s.length <= maxLength ? s : s.slice(0, maxLength) + '...';
  }

  /**
   * Format series slug to label (e.g. female-portrait → Female Portrait).
   * @param {string} series
   * @returns {string}
   */
  function formatSeriesLabel(series) {
    if (!series) return '';
    return String(series).replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /**
   * Split mood string into array (e.g. "warm, poetic, intimate" → ["warm","poetic","intimate"]).
   * @param {string|Array} mood
   * @returns {Array<string>}
   */
  function splitMood(mood) {
    if (Array.isArray(mood)) return mood.map(function (m) { return String(m).trim(); }).filter(Boolean);
    if (!mood) return [];
    return String(mood).split(/[,·|]/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /**
   * Ensure tags is array. Returns [] if not.
   * @param {*} tags
   * @returns {Array}
   */
  function getSafeTags(tags) {
    if (Array.isArray(tags)) return tags;
    return [];
  }

  /**
   * Check if value is valid YYYY-MM-DD date string.
   * @param {*} value
   * @returns {boolean}
   */
  function isValidDateString(value) {
    if (value === undefined || value === null) return false;
    var s = String(value).trim();
    if (!s) return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(s);
  }

  /**
   * Get latest item by createdAt from list.
   * @param {Array} list
   * @returns {Object|null}
   */
  function getLatestWithDate(list) {
    if (!Array.isArray(list) || list.length === 0) return null;
    var best = null;
    var bestDate = '';
    list.forEach(function (item) {
      var d = (item.createdAt || '').toString().trim();
      if (!d) return;
      if (!best || d > bestDate) {
        best = item;
        bestDate = d;
      }
    });
    return best;
  }

  /**
   * Escape HTML for safe insertion.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Expose to global (window)
  global.fetchJsonArray = fetchJsonArray;
  global.sortByCreatedAtDesc = sortByCreatedAtDesc;
  global.sortByCreatedAtAsc = sortByCreatedAtAsc;
  global.truncateText = truncateText;
  global.formatSeriesLabel = formatSeriesLabel;
  global.splitMood = splitMood;
  global.getSafeTags = getSafeTags;
  global.isValidDateString = isValidDateString;
  global.getLatestWithDate = getLatestWithDate;
  global.escapeHtml = escapeHtml;

})(typeof window !== 'undefined' ? window : this);
