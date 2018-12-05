/**
You've managed to sneak in to the prototype suit manufacturing lab. The Elves are making decent progress, but are still struggling with the suit's size reduction capabilities.

While the very latest in 1518 alchemical technology might have solved their problem eventually, you can do better. You scan the chemical composition of the suit's material and discover that it is formed by extremely long polymers (one of which is available as your puzzle input).

The polymer is formed by smaller units which, when triggered, react with each other such that two adjacent units of the same type and opposite polarity are destroyed. Units' types are represented by letters; units' polarity is represented by capitalization. For instance, r and R are units with the same type but opposite polarity, whereas r and s are entirely different types and do not react.

For example:

In aA, a and A react, leaving nothing behind.
In abBA, bB destroys itself, leaving aA. As above, this then destroys itself, leaving nothing.
In abAB, no two adjacent units are of the same type, and so nothing happens.
In aabAAB, even though aa and AA are of the same type, their polarities match, and so nothing happens.
Now, consider a larger example, dabAcCaCBAcCcaDA:

dabAcCaCBAcCcaDA  The first 'cC' is removed.
dabAaCBAcCcaDA    This creates 'Aa', which is removed.
dabCBAcCcaDA      Either 'cC' or 'Cc' are removed (the result is the same).
dabCBAcaDA        No further actions can be taken.
After all possible reactions, the resulting polymer contains 10 units.

How many units remain after fully reacting the polymer you scanned? (Note: in this puzzle and others, the input is large; if you copy/paste your input, make sure you get the whole thing.)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');

// because I can never remember what the ascii codes for a and A are...
const la = 'a'.charCodeAt(0);
const ua = 'A'.charCodeAt(0);


const reStr = [...Array(26).keys()] // [0..26]
  .map(i => [String.fromCharCode(la + i), String.fromCharCode(ua + i)]) // [['a', 'A'], ['b', 'B']...]
  .map(([l, u]) => `${l}${u}|${u}${l}`) // ['aA|Aa','bB|Bb',...]
  .join('|'); // 'aA|Aa|bB|Bb...'

const re = new RegExp(`(?:${reStr})`, 'g');

const reducePolymer = (compound) => {
  while(compound.length > (compound = compound.replace(re, '')).length) {}
  return compound;
}

assert(reducePolymer('dabAcCaCBAcCcaDA') === 'dabCBAcaDA');

console.log(reducePolymer(input).length);

