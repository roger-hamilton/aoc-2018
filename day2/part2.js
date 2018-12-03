/**
Confident that your list of box IDs is complete, you're ready to find the boxes full of prototype fabric.

The boxes will have IDs which differ by exactly one character at the same position in both strings. For example, given the following box IDs:

abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz
The IDs abcde and axcye are close, but they differ by two characters (the second and fourth). However, the IDs fghij and fguij differ by exactly one character, the third (h and u). Those must be the correct boxes.

What letters are common between the two correct box IDs? (In the example above, this is found by removing the differing character from either ID, producing fgij.)
 */


const fs = require('fs');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const lines = input.split('\n').map(n => n.trim());


const diff = (l1, l2) => {
  let d = 0;
  for(const c in l1) {
    if (l1[c] !== l2[c]) d++;
  }
  d += Math.max(l2.length - l1.length, 0);
  return d;
}

const findWithDiff = lines => {
  for (let i = 0; i < lines.length; i++) {
    for(let j = i; j < lines.length; j++) {
      if (diff(lines[i], lines[j]) === 1) {
        return _([...lines[i]]).filter((c, i) => lines[j][i] === c).join('');
      }
    }
  }
}

const test1 = [
  'abcde',
  'fghij',
  'klmno',
  'pqrst',
  'fguij',
  'axcye',
  'wvxyz',
];

assert(findWithDiff(test1) === 'fgij');

console.log(findWithDiff(lines));