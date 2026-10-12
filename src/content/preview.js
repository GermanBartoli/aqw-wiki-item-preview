(() => {
  'use strict';

  const article = document.querySelector('#page-content');
  if (!article) return;

  const preview = document.createElement('div');
  preview.className = 'aqw-preview';
  preview.setAttribute('role', 'tooltip');
  const image = document.createElement('img');
  image.className = 'aqw-preview__image';
  image.alt = '';
  const title = document.createElement('div');
  title.className = 'aqw-preview__title';
  preview.append(image, title);
  document.body.append(preview);

  let currentLink = null;
  let timer = null;
  let request = 0;
  let pointerX = 0;
  let pointerY = 0;

  function place() {
    const gap = 14;
    const width = preview.offsetWidth;
    const height = preview.offsetHeight;
    const left = Math.min(pointerX + gap, innerWidth - width - 8);
    const top = pointerY + gap + height <= innerHeight ? pointerY + gap : pointerY - height - gap;
    preview.style.left = `${Math.max(8, left)}px`;
    preview.style.top = `${Math.max(8, top)}px`;
  }

  function hide() {
    clearTimeout(timer);
    currentLink = null;
    request++;
    preview.removeAttribute('data-visible');
    image.removeAttribute('src');
  }

  article.addEventListener('pointerover', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || link === currentLink) return;
    hide();
    const url = AqwWikiItem.articleUrl(link.href, location.origin);
    if (!url) return;
    currentLink = link;
    pointerX = event.clientX;
    pointerY = event.clientY;
    const id = request;
    timer = setTimeout(async () => {
      const item = await AqwWikiLoader.load(url);
      if (!item || id !== request || currentLink !== link) return;
      image.onload = () => {
        if (id !== request) return;
        preview.dataset.visible = 'true';
        place();
      };
      image.onerror = () => {
        if (id === request) hide();
      };
      title.textContent = item.title;
      image.src = item.source;
    }, 250);
  });

  article.addEventListener('pointermove', event => {
    if (!currentLink) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (preview.dataset.visible === 'true') place();
  });

  article.addEventListener('pointerout', event => {
    if (currentLink && event.target.closest?.('a[href]') === currentLink && !currentLink.contains(event.relatedTarget)) hide();
  });
  addEventListener('scroll', hide, { passive: true });
  addEventListener('blur', hide);
})();
