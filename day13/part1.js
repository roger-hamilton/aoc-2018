/**
A crop of this size requires significant logistics to transport produce, soil, fertilizer, and so on. The Elves are very busy pushing things around in carts on some kind of rudimentary system of tracks they've come up with.

Seeing as how cart-and-track systems don't appear in recorded history for another 1000 years, the Elves seem to be making this up as they go along. They haven't even figured out how to avoid collisions yet.

You map out the tracks (your puzzle input) and see where you can help.

Tracks consist of straight paths (| and -), curves (/ and \), and intersections (+). Curves connect exactly two perpendicular pieces of track; for example, this is a closed loop:

/----\
|    |
|    |
\----/
Intersections occur when two perpendicular paths cross. At an intersection, a cart is capable of turning left, turning right, or continuing straight. Here are two loops connected by two intersections:

/-----\
|     |
|  /--+--\
|  |  |  |
\--+--/  |
   |     |
   \-----/
Several carts are also on the tracks. Carts always face either up (^), down (v), left (<), or right (>). (On your initial map, the track under each cart is a straight path matching the direction the cart is facing.)

Each time a cart has the option to turn (by arriving at any intersection), it turns left the first time, goes straight the second time, turns right the third time, and then repeats those directions starting again with left the fourth time, straight the fifth time, and so on. This process is independent of the particular intersection at which the cart has arrived - that is, the cart has no per-intersection memory.

Carts all move at the same speed; they take turns moving a single step at a time. They do this based on their current location: carts on the top row move first (acting from left to right), then carts on the second row move (again from left to right), then carts on the third row, and so on. Once each cart has moved one step, the process repeats; each of these loops is called a tick.

For example, suppose there are two carts on a straight track:

|  |  |  |  |
v  |  |  |  |
|  v  v  |  |
|  |  |  v  X
|  |  ^  ^  |
^  ^  |  |  |
|  |  |  |  |
First, the top cart moves. It is facing down (v), so it moves down one square. Second, the bottom cart moves. It is facing up (^), so it moves up one square. Because all carts have moved, the first tick ends. Then, the process repeats, starting with the first cart. The first cart moves down, then the second cart moves up - right into the first cart, colliding with it! (The location of the crash is marked with an X.) This ends the second and last tick.

Here is a longer example:

/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   

/-->\        
|   |  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \->--/
  \------/   

/---v        
|   |  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-+>-/
  \------/   

/---\        
|   v  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-+->/
  \------/   

/---\        
|   |  /----\
| /->--+-\  |
| | |  | |  |
\-+-/  \-+--^
  \------/   

/---\        
|   |  /----\
| /-+>-+-\  |
| | |  | |  ^
\-+-/  \-+--/
  \------/   

/---\        
|   |  /----\
| /-+->+-\  ^
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /----<
| /-+-->-\  |
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /---<\
| /-+--+>\  |
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /--<-\
| /-+--+-v  |
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /-<--\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /<---\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-<--/
  \------/   

/---\        
|   |  v----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \<+--/
  \------/   

/---\        
|   |  /----\
| /-+--v-\  |
| | |  | |  |
\-+-/  ^-+--/
  \------/   

/---\        
|   |  /----\
| /-+--+-\  |
| | |  X |  |
\-+-/  \-+--/
  \------/   
After following their respective paths for a while, the carts eventually crash. To help prevent crashes, you'd like to know the location of the first crash. Locations are given in X,Y coordinates, where the furthest left column is X=0 and the furthest top row is Y=0:

           111
 0123456789012
0/---\        
1|   |  /----\
2| /-+--+-\  |
3| | |  X |  |
4\-+-/  \-+--/
5  \------/   
In this example, the location of the first crash is 7,3.

To begin, get your puzzle input.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');

const extractCarts = inp => {
  const carts = [];
  let track = '';
  const rows = inp.split('\n');
  for (const y in rows) {
    const row = rows[y];
    for (const x in rows[y]) {
      if (rows[y][x].match(/[<>^v]/)) {
        carts.push({
          x: +x,
          y: +y,
          dir: rows[y][x],
          turn: 'l',
        });
        const l = rows[y][x - 1] || '';
        const r = rows[y][x + 1] || '';
        const u = (rows[y - 1] && rows[y - 1][x]) || '';
        const d = (rows[y + 1] && rows[y + 1][x]) || '';
        switch (rows[y][x]) {
          case '<':
          case '>':
            if (u.match(/[|\/\\\+^v]/) || d.match(/[|\/\\\+^v]/)) {
              track += '+'
            } else {
              track += '-'
            }
            break;
          case 'v':
          case '^':
            if (l.match(/[\-\/\\\+<>]/) || r.match(/[\-/\\\+<>]/)) {
              track += '+';
            } else {
              track += '|';
            }
        }
      } else {
        track += rows[y][x];
      }
    }
    track += '\n'
  }

  return {
    track: track.replace(/\n$/, '').split('\n'),
    carts,
  }
}

const dirs = {
  '^': {
    left: '<',
    right: '>'
  },
  'v': {
    left: '>',
    right: '<'
  },
  '<': {
    left: 'v',
    right: '^'
  },
  '>': {
    left: '^',
    right: 'v'
  },
}

const makeTick = track => carts => {
  let newCarts = carts.map(({
    x,
    y,
    dir,
    turn
  }) => {
    if (dir === 'X') return {
      x,
      y,
      dir,
      turn
    };
    if (dir === '>') x += 1;
    if (dir === '<') x -= 1;
    if (dir === 'v') y += 1;
    if (dir === '^') y -= 1;

    if (track[y][x] === '+') {
      switch (turn) {
        case 'l':
          dir = dirs[dir].left;
          turn = 's';
          break;
        case 's':
          turn = 'r';
          break;
        case 'r':
          dir = dirs[dir].right;
          turn = 'l';
          break;
      }
    } else if (track[y][x] === '/') {
      dir = dir.match(/[><]/) ? dirs[dir].left : dirs[dir].right;
    } else if (track[y][x] === '\\') {
      dir = dir.match(/[><]/) ? dirs[dir].right : dirs[dir].left;
    }
    return {
      x,
      y,
      dir,
      turn
    };
  });
  newCarts.forEach((c) => {
    if (newCarts.filter(({ x, y }) => c.x === x && c.y === y).length > 1) {
      c.dir = 'X';
    }
  });
  return newCarts;
}

const printCarts = _.curry((track, carts) => {
  const tc = track.map((t, i) =>
    carts.filter(({
      y
    }) => y === i)
    .reduce((m, {
      x,
      dir
    }) => {
      m.splice(x, 1, dir);
      return m;
    }, [...t])
    .join('')
  );
  console.log(tc.join('\n'));
});

const findFirstCrash = (track, carts) => {
  let crashed = false;
  const tick = makeTick(track);
  const print = printCarts(track);
  while(!crashed) {
    // print(carts);
    carts = tick(carts);
    crashed = carts.find(({ dir }) => dir === 'X');
  }
  print(carts);
  return `${crashed.x},${crashed.y}`;
}

const test1 = `/->-\\        
|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   `;

const test = extractCarts(test1);
assert(findFirstCrash(test.track, test.carts) == '7,3');

const { track, carts } = extractCarts(input);
console.log(findFirstCrash(track, carts));