/**
There isn't much you can do to prevent crashes in this ridiculous system. However, by predicting the crashes, the Elves know where to be in advance and instantly remove the two crashing carts the moment any crash occurs.

They can proceed like this for a while, but eventually, they're going to run out of carts. It could be useful to figure out where the last cart that hasn't crashed will end up.

For example:

/>-<\  
|   |  
| /<+-\
| | | v
\>+</ |
  |   ^
  \<->/

/---\  
|   |  
| v-+-\
| | | |
\-+-/ |
  |   |
  ^---^

/---\  
|   |  
| /-+-\
| v | |
\-+-/ |
  ^   ^
  \---/

/---\  
|   |  
| /-+-\
| | | |
\-+-/ ^
  |   |
  \---/
After four very expensive crashes, a tick ends with only one cart remaining; its final location is 6,4.

What is the location of the last cart at the end of the first tick where it is the only cart left?
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
    carts: _(carts).sortBy('y', 'x').value(),
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
  let newCarts = [];

  for(let c of carts) {
    if (c.dir === 'X') {
      continue;
    }
    if (c.dir === '>') c.x += 1;
    if (c.dir === '<') c.x -= 1;
    if (c.dir === 'v') c.y += 1;
    if (c.dir === '^') c.y -= 1;
    const crash = [...carts, ...newCarts].filter(n => c !== n && c.x === n.x && c.y === n.y);
    if (crash.length) {
      crash.forEach(c => c.dir = 'X');
      continue;
    }

    if (track[c.y][c.x] === '+') {
      switch (c.turn) {
        case 'l':
          c.dir = dirs[c.dir].left;
          c.turn = 's';
          break;
        case 's':
          c.turn = 'r';
          break;
        case 'r':
          c.dir = dirs[c.dir].right;
          c.turn = 'l';
          break;
      }
    } else if (track[c.y][c.x] === '/') {
      c.dir = c.dir.match(/[><]/) ? dirs[c.dir].left : dirs[c.dir].right;
    } else if (track[c.y][c.x] === '\\') {
      c.dir = c.dir.match(/[><]/) ? dirs[c.dir].right : dirs[c.dir].left;
    }
    newCarts.push({ ...c});
  }
  return _(newCarts).filter(({ dir }) => dir !== 'X').sortBy('y').sortBy('x').value();
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

const findLastCart = (track, carts) => {
  const tick = makeTick(track);
  const print = printCarts(track);
  // print(carts);
  let i = carts.length;
  while(carts.length > 1) {
    const old = carts.map(obj => ({ ...obj }));
    carts = tick(carts)
    // print(carts);
    carts = carts.filter(({ dir }) => dir !== 'X');
  }
  return `${carts[0].x},${carts[0].y}`;
}

const test1 = `/-><\\  
|   |  
| /<+-\\
| | | v
\\>+</ |
  |   ^
  \\<->/`;

const test = extractCarts(test1);
assert(findLastCart(test.track, test.carts) == '6,4');

const { track, carts } = extractCarts(input);
console.log(findLastCart(track, carts));