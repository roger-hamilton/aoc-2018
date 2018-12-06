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

// this is painfully slow but it works
const calcRegionClosestToAll = (lines, minDist) => {
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

const test1 = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`.split('\n').map(line => re.exec(line).groups);

// assert(calcRegionClosestToAll(test1, 32) === 16);

console.log(calcRegionClosestToAll(lines, 10000));
