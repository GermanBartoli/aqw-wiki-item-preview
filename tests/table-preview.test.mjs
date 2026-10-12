import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

class Cell {
  constructor(text = '', link = null) {
    this.textContent = text;
    this.link = link;
    this.dataset = {};
    this.isConnected = true;
    this.children = [];
  }

  querySelector() { return this.link; }
  after(cell) {
    const index = this.row.cells.indexOf(this);
    this.row.cells.splice(index + 1, 0, cell);
    cell.row = this.row;
  }
  append(child) { this.children.push(child); }
  replaceChildren(...children) { this.children = children; }
}

function row(...cells) {
  const result = { cells };
  for (const cell of cells) cell.row = result;
  return result;
}

test('agrega la columna y carga todas las filas, incluso en pestañas ocultas', async () => {
  const header = () => row(new Cell(''), new Cell('Name'), new Cell('Requirements'), new Cell('Price'));
  const item = name => row(new Cell('icono'), new Cell(name, { href: `https://aqwwiki.wikidot.com/${name}` }), new Cell('requisito'), new Cell('0 AC'));
  const visibleTable = { rows: [header(), item('adept-of-awe'), item('apprentice-of-awe')] };
  const hiddenTable = { rows: [header(), item('adept-of-awe-hood')] };
  const calls = [];
  const sandbox = {
    location: { origin: 'https://aqwwiki.wikidot.com' },
    document: {
      querySelector: () => ({ querySelectorAll: () => [visibleTable, hiddenTable] }),
      createElement: () => new Cell()
    },
    AqwWikiItem: { articleUrl: href => href },
    AqwWikiLoader: {
      load: url => {
        calls.push(url);
        return Promise.resolve({ title: url.split('/').at(-1), source: 'https://i.imgur.com/example.png' });
      }
    }
  };
  sandbox.globalThis = sandbox;
  runInNewContext(readFileSync('src/content/table-preview.js', 'utf8'), sandbox);
  await new Promise(resolve => setImmediate(resolve));

  assert.equal(visibleTable.rows[0].cells[2].textContent, 'Foto');
  assert.equal(hiddenTable.rows[0].cells[2].textContent, 'Foto');
  assert.equal(calls.length, 3);
  for (const table of [visibleTable, hiddenTable]) {
    for (const dataRow of table.rows.slice(1)) {
      assert.equal(dataRow.cells.length, 5);
      assert.equal(dataRow.cells[2].children[0].children[0].src, 'https://i.imgur.com/example.png');
    }
  }
});
