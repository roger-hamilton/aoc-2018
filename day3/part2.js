/**
Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim. If you can somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!

For example, in the claims above, only claim 3 is intact after all claims are made.

What is the ID of the only claim that doesn't overlap?
*/

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const lines = input.split('\n').map(n => n.trim());

const parseLine = line => {
  const { id, x, y, w, h} = /^#(?<id>\d+)\s+@\s+(?<x>\d+),(?<y>\d+):\s+(?<w>\d+)x(?<h>\d+)$/.exec(line).groups;
  return { id: +id, x: +x, y: +y, w: +w, h: +h };
}

const claims = lines.map(parseLine);


const findOverlap = claims => {
  const maxW = Math.max(...claims.map(({ x, w }) => x + w)) + 1;
  const maxH = Math.max(...claims.map(({ y, h }) => y + h)) + 1;

  const sheet = [...Array(maxW)].map(() => Array(maxH).fill(0));

  const canidates = new Set(claims.map(({ id }) => id));

  const fillClaim = ({ id, x, y, h, w }) => {
    for(let i = x; i < x + w; i++) {
      for(let j = y; j < y + h; j++) {
        if (sheet[i][j] !== 0) {
          canidates.delete(sheet[i][j]);
          canidates.delete(id);
        }
        sheet[i][j] = id;
      }
    }
  }

  claims.forEach(fillClaim);
  
  return [...canidates][0];
}

console.log(findOverlap(claims));