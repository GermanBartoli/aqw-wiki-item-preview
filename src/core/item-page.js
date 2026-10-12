(() => {
  'use strict';

  function articleUrl(href, origin) {
    try {
      const url = new URL(href, origin);
      if (url.origin !== origin || !/^\/[a-z0-9][a-z0-9-]*\/?$/i.test(url.pathname)) return null;
      url.hash = '';
      url.search = '';
      return url.href;
    } catch {
      return null;
    }
  }

  function usableImage(img, origin) {
    const source = img.getAttribute('src');
    if (!source || img.closest('.collapsible-block')) return null;
    const url = new URL(source, origin);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    if (/\/local--files\/image-tags\/|\/local--files\/icons?\//i.test(url.pathname)) return null;
    if (/(?:^|[\/_-])(?:aclarge|acsmall|member|rare|legend|weapon|armor|helmet|cape|pet)_?table\./i.test(url.pathname)) return null;
    return url.href;
  }

  function parseItem(html, url, Parser = DOMParser) {
    const page = new Parser().parseFromString(html, 'text/html');
    const content = page.querySelector('#page-content');
    if (!content) return null;
    // Las fichas de objetos suelen tener Price, Sellback o Rarity; evita imágenes de tiendas y misiones.
    if (!/\b(?:Price|Sellback|Rarity):/i.test(content.textContent || '')) return null;
    for (const img of content.querySelectorAll('img')) {
      const source = usableImage(img, new URL(url).origin);
      if (source) {
        return {
          source,
          title: (page.querySelector('#page-title')?.textContent || new URL(url).pathname.slice(1).replaceAll('-', ' ')).trim()
        };
      }
    }
    return null;
  }

  globalThis.AqwWikiItem = Object.freeze({ articleUrl, parseItem });
})();
