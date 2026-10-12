(() => {
  'use strict';

  const cache = new Map();

  function load(url) {
    if (!cache.has(url)) {
      const pending = fetch(url, { credentials: 'same-origin' })
        .then(response => response.ok && response.headers.get('content-type')?.includes('text/html') ? response.text() : null)
        .then(html => html ? AqwWikiItem.parseItem(html, url) : null)
        .catch(() => null);
      cache.set(url, pending);
      if (cache.size > 100) cache.delete(cache.keys().next().value);
    }
    return cache.get(url);
  }

  globalThis.AqwWikiLoader = Object.freeze({ load });
})();
