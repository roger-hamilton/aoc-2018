/**
On the other hand, if the coordinates are safe, maybe the best you can do is try to find a region near as many coordinates as possible.

For example, suppose you want the sum of the Manhattan distance to all of the coordinates to be less than 32. For each location, add up the distances to all of the given coordinates; if the total of those distances is less than 32, that location is within the desired region. Using the same coordinates as above, the resulting region looks like this:

..........
.A........
..........
...###..C.
..#D###...
..###E#...
.B.###....
..........
..........
........F.
In particular, consider the highlighted location 4,3 located at the top middle of the region. Its calculation is as follows, where abs() is the absolute value function:

Distance to coordinate A: abs(4-1) + abs(3-1) =  5
Distance to coordinate B: abs(4-1) + abs(3-6) =  6
Distance to coordinate C: abs(4-8) + abs(3-3) =  4
Distance to coordinate D: abs(4-3) + abs(3-4) =  2
Distance to coordinate E: abs(4-5) + abs(3-5) =  3
Distance to coordinate F: abs(4-8) + abs(3-9) = 10
Total distance: 5 + 6 + 4 + 2 + 3 + 10 = 30
Because the total distance to all coordinates (30) is less than 32, the location is within the region.

This region, which also includes coordinates D and E, has a total size of 16.

Your actual region will need to be much larger than this example, though, instead including all locations with a total distance of less than 10000.

What is the size of the region containing all locations which have a total distance to all given coordinates of less than 10000?
 */


const fs = require('fs');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');

const re = /^(?<x>\d+), (?<y>\d+)$/

const lines = input.split('\n')
  .map(s => re.exec(s.trim()).groups)
  .map(({ x, y }, i) => ({ x: +x, y: +y }));

const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const calcDist = (x, y) => p => dist({ x, y}, p);

function* spiral(startX, startY) {
  let len = 1;
  let step = 0;
  const right = [1, 0];
  const left = [-1, 0];
  const up = [0, -1];
  const down = [0, 1];
  let dir = right;
  let x = startX;
  let y = startY;
  while(true) {
    yield [x, y, len];
    [x, y] = [x + dir[0], y + dir[1]];
    step++;
    if (step === len) {
      step = 0;
      switch (dir) {
        case right:
          dir = up;
          break;
        case up:
          dir = left;
          len++;
          break;
        case left:
          dir = down;
          break;
        case down:
          dir = right;
          len++;
          break;
      }
    }
  }
}

// this is painfully slow
const calcRegionClosestToAllSlow = (lines, minDist) => {
  const xs = lines.map(({ x }) => x);
  const ys = lines.map(({ y }) => y);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  let maxRx = minX + minDist;
  let maxRy = minY + minDist;
  let minRx = maxX - minDist;
  let minRy = maxY - minDist;

  let area = 0;
  const iter = (maxRx - minRx) * (maxRy - minRy);
  let count = 0;
  for(let x = minRx; x <= maxRx; x++) {
    for(let y = minRy; y <= maxRy; y++) {
      if (count % ~~(iter / 10000) === 0) {
        console.log(`${(100 * count / iter).toFixed(2)}%`);
      }
      const totalDist = _(lines).map(calcDist(x,y)).sum();
      if (totalDist < minDist) area++;
      count++;
    }
  }
  return area;
}

// this is much better
// start at center and spiral out
// until we have gone around once without
// finding a cell that matches the criteria
// (after finding the first matching cell)
const calcRegionClosestToAllFast = (lines, minDist) => {
  const xs = lines.map(({ x }) => x);
  const ys = lines.map(({ y }) => y);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  let count = 0;
  let area = 0;
  let toFarCount = 0;

  const maxIter = Math.max(maxX, maxY) ** 2;

  for(const [x, y, legLen] of spiral(~~(maxX / 2), ~~(maxY / 2))) {
    // if we have seen part of the area we are looking for
    // and we have gone around the spiral once
    // stop looking
    if (area && toFarCount > legLen * 4) break;
    // if we have covered 
    if (count > maxIter) break;
    if (_(lines).map(calcDist(x, y)).sum() < minDist) {
      area++;
      toFarCount = 0;
    }
    else {
      toFarCount++;
    }
    count++;
  }
  return area;
}

const test1 = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`.split('\n').map(line => re.exec(line).groups);

assert(calcRegionClosestToAllFast(test1, 32) === 16);

console.time('fast');
console.log(calcRegionClosestToAllFast(test1, 32));
console.timeEnd('fast');

console.time('slow');
console.log(calcRegionClosestToAllSlow(test1, 32));
console.timeEnd('slow');


console.time('fast');
console.log(calcRegionClosestToAllFast(lines, 10000));
console.timeEnd('fast');
