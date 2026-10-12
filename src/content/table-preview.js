(() => {
  'use strict';

  const article = document.querySelector('#page-content');
  if (!article) return;

  const queue = [];
  let active = 0;

  function drain() {
    while (active < 3 && queue.length) {
      const cell = queue.shift();
      if (!cell.isConnected) continue;

      active++;
      AqwWikiLoader.load(cell.dataset.url).then(item => {
        if (!cell.isConnected) return;
        if (!item) {
          cell.textContent = '—';
          return;
        }

        const link = document.createElement('a');
        link.href = cell.dataset.url;
        link.title = item.title;
        const image = document.createElement('img');
        image.alt = item.title;
        image.decoding = 'async';
        image.onerror = () => { cell.textContent = '—'; };
        image.src = item.source;
        link.append(image);
        cell.replaceChildren(link);
      }).finally(() => {
        active--;
        drain();
      });
    }
  }

  for (const table of article.querySelectorAll('table.wiki-content-table')) {
    const rows = [...table.rows];
    const headers = [...(rows[0]?.cells || [])];
    const nameIndex = headers.findIndex(cell => /^Name$/i.test(cell.textContent.trim()));
    if (nameIndex < 0 || !headers.some(cell => /^Price$/i.test(cell.textContent.trim()))) continue;

    const items = [];
    for (const row of rows.slice(1)) {
      if (row.cells.length !== headers.length) continue;
      const link = row.cells[nameIndex].querySelector('a[href]');
      const url = link && AqwWikiItem.articleUrl(link.href, location.origin);
      items.push({ row, url });
    }
    if (!items.some(item => item.url)) continue;

    const heading = document.createElement('th');
    heading.className = 'aqw-photo-heading';
    heading.scope = 'col';
    heading.textContent = 'Foto';
    headers[nameIndex].after(heading);

    for (const { row, url } of items) {
      const cell = document.createElement('td');
      cell.className = 'aqw-photo-cell';
      row.cells[nameIndex].after(cell);
      if (url) {
        cell.dataset.url = url;
        cell.textContent = '…';
        queue.push(cell);
      }
    }
  }

  drain();
})();
