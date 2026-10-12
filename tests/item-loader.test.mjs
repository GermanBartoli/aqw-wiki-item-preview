import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('el hover y la columna comparten una sola consulta por artículo', async () => {
  let requests = 0;
  const sandbox = {
    fetch: async () => {
      requests++;
      return { ok: true, headers: { get: () => 'text/html' }, text: async () => '<article></article>' };
    },
    AqwWikiItem: { parseItem: () => ({ source: 'https://i.imgur.com/item.png', title: 'Objeto' }) }
  };
  sandbox.globalThis = sandbox;
  runInNewContext(readFileSync('src/content/item-loader.js', 'utf8'), sandbox);

  const url = 'https://aqwwiki.wikidot.com/adept-of-awe';
  const [column, hover] = await Promise.all([sandbox.AqwWikiLoader.load(url), sandbox.AqwWikiLoader.load(url)]);
  assert.equal(requests, 1);
  assert.equal(column.source, hover.source);
});
