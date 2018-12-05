/**
Time to improve the polymer.

One of the unit types is causing problems; it's preventing the polymer from collapsing as much as it should. Your goal is to figure out which unit type is causing the most problems, remove all instances of it (regardless of polarity), fully react the remaining polymer, and measure its length.

For example, again using the polymer dabAcCaCBAcCcaDA from above:

Removing all A/a units produces dbcCCBcCcD. Fully reacting this polymer produces dbCBcD, which has length 6.
Removing all B/b units produces daAcCaCAcCcaDA. Fully reacting this polymer produces daCAcaDA, which has length 8.
Removing all C/c units produces dabAaBAaDA. Fully reacting this polymer produces daDA, which has length 4.
Removing all D/d units produces abAcCaCBAcCcaA. Fully reacting this polymer produces abCBAc, which has length 6.
In this example, removing all C/c units was best, producing the answer 4.

What is the length of the shortest polymer you can produce by removing all units of exactly one type and fully reacting the result?
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');

// because I can never remember what the ascii codes for a and A are...
const la = 'a'.charCodeAt(0);
const ua = 'A'.charCodeAt(0);

const reABC = [...Array(26).keys()] // [0..26]
  .map(i => [String.fromCharCode(la + i), String.fromCharCode(ua + i)]) // [['a', 'A'], ['b', 'B']...]
  .map(([l, u]) => new RegExp(`(?:${l}|${u})`, 'g')) // [/(?:a|A)/g, /(?:b|B)/g, ...]

const reStr = [...Array(26).keys()] // [0..26]
  .map(i => [String.fromCharCode(la + i), String.fromCharCode(ua + i)]) // [['a', 'A'], ['b', 'B']...]
  .map(([l, u]) => `${l}${u}|${u}${l}`) // ['aA|Aa','bB|Bb',...]
  .join('|'); // 'aA|Aa|bB|Bb...'

const re = new RegExp(`(?:${reStr})`, 'g');
const reducePolymer = (compound) => {
  while(compound.length > (compound = compound.replace(re, '')).length) {}
  return compound;
}

const improvedReducePloymer = (compound) => {
  let min = compound;
  for(alpha of reABC) {
    const newCompound = compound.replace(alpha,'');
    const reduced = reducePolymer(newCompound);
    if (reduced.length < min.length) {
      min = reduced;
    }
  }
  return min;
}

assert(improvedReducePloymer('dabAcCaCBAcCcaDA') === 'daDA');

console.log(improvedReducePloymer(input).length);