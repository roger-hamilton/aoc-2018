/**
The Elves managed to locate the chimney-squeeze prototype fabric for Santa's suit (thanks to someone who helpfully wrote its box IDs on the wall of the warehouse in the middle of the night). Unfortunately, anomalies are still affecting them - nobody can even agree on how to cut the fabric.

The whole piece of fabric they're working on is a very large square - at least 1000 inches on each side.

Each Elf has made a claim about which area of fabric would be ideal for Santa's suit. All claims have an ID and consist of a single rectangle with edges parallel to the edges of the fabric. Each claim's rectangle is defined as follows:

The number of inches between the left edge of the fabric and the left edge of the rectangle.
The number of inches between the top edge of the fabric and the top edge of the rectangle.
The width of the rectangle in inches.
The height of the rectangle in inches.
A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3 inches from the left edge, 2 inches from the top edge, 5 inches wide, and 4 inches tall. Visually, it claims the square inches of fabric represented by # (and ignores the square inches of fabric represented by .) in the diagram below:

...........
...........
...#####...
...#####...
...#####...
...#####...
...........
...........
...........
The problem is that many of the claims overlap, causing two or more claims to cover part of the same areas. For example, consider the following claims:

#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
Visually, these claim the following areas:

........
...2222.
...2222.
.11XX22.
.11XX22.
.111133.
.111133.
........
The four square inches marked with X are claimed by both 1 and 2. (Claim 3, while adjacent to the others, does not overlap either of them.)

If the Elves all proceed with their own plans, none of them will have enough fabric. How many square inches of fabric are within two or more claims?
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

  const fillClaim = ({ x, y, h, w }) => {
    for(let i = x; i < x + w; i++) {
      for(let j = y; j < y + h; j++) {
        sheet[i][j]++;
      }
    }
  }

  claims.forEach(fillClaim);
  let overlap = 0;
  for(let i = 0; i < maxW; i++) {
    for(let j = 0; j < maxH; j++) {
      if (sheet[i][j] > 1) overlap++;
    }
  }
  return overlap;
}

const test1 = `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`.split('\n').map(parseLine);

assert(findOverlap(test1) === 4)

console.log(findOverlap(claims));