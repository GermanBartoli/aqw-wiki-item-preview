import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const sandbox = { URL };
sandbox.globalThis = sandbox;
runInNewContext(readFileSync('src/core/item-page.js', 'utf8'), sandbox);
const { articleUrl, parseItem } = sandbox.AqwWikiItem;

test('solo acepta artículos de la misma wiki', () => {
  assert.equal(articleUrl('/adept-of-awe#male', 'https://aqwwiki.wikidot.com'), 'https://aqwwiki.wikidot.com/adept-of-awe');
  assert.equal(articleUrl('https://otro.example/item', 'https://aqwwiki.wikidot.com'), null);
  assert.equal(articleUrl('/system:page-tags/tag/armor', 'https://aqwwiki.wikidot.com'), null);
});

function parser({ labels, images }) {
  return class {
    parseFromString() {
      return {
        querySelector(selector) {
          if (selector === '#page-title') return { textContent: 'Adept of Awe' };
          if (selector !== '#page-content') return null;
          return {
            textContent: labels,
            querySelectorAll: () => images.map(source => ({
              getAttribute: () => source,
              closest: () => null
            }))
          };
        }
      };
    }
  };
}

test('omite el icono de AC y toma la imagen del objeto', () => {
  const result = parseItem('', 'https://aqwwiki.wikidot.com/adept-of-awe', parser({
    labels: 'Price: 0 AC Sellback: 0 AC',
    images: ['https://aqwwiki.wdfiles.com/local--files/image-tags/aclarge.png', 'https://i.imgur.com/7pkwSZJ.png']
  }));
  assert.equal(result.source, 'https://i.imgur.com/7pkwSZJ.png');
  assert.equal(result.title, 'Adept of Awe');
});

test('no muestra imágenes de páginas que no son fichas de objetos', () => {
  const result = parseItem('', 'https://aqwwiki.wikidot.com/trissa-s-shop', parser({
    labels: 'Name Requirements Price',
    images: ['https://i.imgur.com/example.png']
  }));
  assert.equal(result, null);
});
