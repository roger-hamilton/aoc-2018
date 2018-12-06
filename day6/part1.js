/**
The device on your wrist beeps several times, and once again you feel like you're falling.

"Situation critical," the device announces. "Destination indeterminate. Chronal interference detected. Please specify new target coordinates."

The device then produces a list of coordinates (your puzzle input). Are they places it thinks are safe or dangerous? It recommends you check manual page 729. The Elves did not give you a manual.

If they're dangerous, maybe you can minimize the danger by finding the coordinate that gives the largest distance from the other points.

Using only the Manhattan distance, determine the area around each coordinate by counting the number of integer X,Y locations that are closest to that coordinate (and aren't tied in distance to any other coordinate).

Your goal is to find the size of the largest area that isn't infinite. For example, consider the following list of coordinates:

1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
If we name these coordinates A through F, we can draw them on a grid, putting 0,0 at the top left:

..........
.A........
..........
........C.
...D......
.....E....
.B........
..........
..........
........F.
This view is partial - the actual grid extends infinitely in all directions. Using the Manhattan distance, each location's closest coordinate can be determined, shown here in lowercase:

aaaaa.cccc
aAaaa.cccc
aaaddecccc
aadddeccCc
..dDdeeccc
bb.deEeecc
bBb.eeee..
bbb.eeefff
bbb.eeffff
bbb.ffffFf
Locations shown as . are equally far from two or more coordinates, and so they don't count as being closest to any.

In this example, the areas of coordinates A, B, C, and F are infinite - while not shown here, their areas extend forever outside the visible grid. However, the areas of coordinates D and E are finite: D is closest to 9 locations, and E is closest to 17 (both including the coordinate's location itself). Therefore, in this example, the size of the largest area is 17.

What is the size of the largest area that isn't infinite?
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


const createVoronoi = (lines) => {
  const maxX = Math.max(...lines.map(({ x }) => x));
  const maxY = Math.max(...lines.map(({ y }) => y));
  
  const grid = [...Array(maxX)].map(() => Array(maxY));
  
  const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  
  const calcDist = (x, y) => p => dist({ x, y}, p);
  for(let x = 0; x < grid.length; x++) {
    for(let y = 0; y < grid[x].length; y++) {
      const dists = lines.map(calcDist(x, y));
      const min = Math.min(...dists);
      const idx = dists.indexOf(min);
      if (dists.filter(n => n === min).length > 1) {
        grid[x][y] = '.';
      } else {
        grid[x][y] = idx;
      }
    }
  }
  return grid;
}

const calcLargestFinite = lines => {
  const grid = createVoronoi(lines);

  // exclude all #s around the edge as these are infinite
  const left = _.uniq(grid[0]);
  const right = _.uniq(grid[grid.length - 1]);
  const sides = _(grid).flatMap(row => [row[0], row[row.length - 1]]).value();

  const inf = _.uniq([...grid[0], ...grid[grid.length - 1], ...sides]);

  const maxArea = _(grid).flatten()
    .filter(n => !inf.includes(n))
    .groupBy()
    .map('length')
    .max();
  return maxArea;
}

const test1 = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`.split('\n').map(line => re.exec(line).groups);

assert(calcLargestFinite(test1) === 9);

console.log(calcLargestFinite(lines));