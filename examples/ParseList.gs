/**
 * ParseList.gs (example)
 *
 * One function for every cell that holds several values. Use it everywhere,
 * and show its result in the dry run so a person can see how a cell was read.
 */

function parseList_(cell) {
  if (cell === null || cell === undefined) return [];
  var seen = {};
  var out = [];
  String(cell).split(/[,;\n]+/).forEach(function (piece) {
    var item = piece.trim();
    if (!item) return;                 // "A,,B" and a trailing comma
    var key = item.toUpperCase();
    if (seen[key]) return;             // "A, a" is one item
    seen[key] = true;
    out.push(item);
  });
  return out;
}

/** Run from the editor. Throws on the first failure. */
function testParseList() {
  var cases = [
    ['',                 []],
    [null,               []],
    ['A',                ['A']],
    ['A,B',              ['A', 'B']],
    ['A, B',             ['A', 'B']],
    [' A ,B , C ',       ['A', 'B', 'C']],
    ['A,B,C,D,E,F',      ['A', 'B', 'C', 'D', 'E', 'F']],
    ['A, B, C, D, E, F', ['A', 'B', 'C', 'D', 'E', 'F']],
    ['A,,B,',            ['A', 'B']],
    ['A; B\nC',          ['A', 'B', 'C']],
    ['A, a, A',          ['A']],
    [101,                ['101']]
  ];
  cases.forEach(function (c) {
    var got = JSON.stringify(parseList_(c[0]));
    var want = JSON.stringify(c[1]);
    if (got !== want) {
      throw new Error('parseList_(' + JSON.stringify(c[0]) + ') gave ' + got + ', expected ' + want);
    }
  });
  Logger.log('parseList_: ' + cases.length + ' cases passed');
}
