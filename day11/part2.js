/**
You discover a dial on the side of the device; it seems to let you select a square of any size, not just 3x3. Sizes from 1x1 to 300x300 are supported.

Realizing this, you now must find the square of any size with the largest total power. Identify this square by including its size as a third parameter after the top-left coordinate: a 9x9 square with a top-left corner of 3,5 is identified as 3,5,9.

For example:

For grid serial number 18, the largest total square (with a total power of 113) is 16x16 and has a top-left corner of 90,269, so its identifier is 90,269,16.
For grid serial number 42, the largest total square (with a total power of 119) is 12x12 and has a top-left corner of 232,251, so its identifier is 232,251,12.
What is the X,Y,size identifier of the square with the largest total power?
 */

const assert = require('assert');
const _ = require('lodash');

const input = 4842;

const genCalcPower = (serialNumber) => (x, y) => {
  const rackId = x + 10;
  let pwr = rackId * y;
  pwr += serialNumber;
  pwr *= rackId;
  pwr = Math.floor(pwr / 100) % 10;
  return pwr - 5;
}

// const genSumSquare = (grid, size) => (x, y) => 
//   _(grid.slice(x, x + size).map(r => r.slice(y, y + size)))
//     .flatten()
//     .sum();


const genSumSquare = (grid) => {
  const _sumGrid = [];
  for (let x = 0; x < grid.length; x++) {
    _sumGrid.push([]);
    for (let y = 0; y < grid[x].length; y++) {
      _sumGrid[x][y] = BigInt(grid[x][y]);
      _sumGrid[x][y] += (_sumGrid[x - 1] && _sumGrid[x - 1][y]) || 0n;
      _sumGrid[x][y] += (_sumGrid[x][y - 1]) || 0n;
      _sumGrid[x][y] -= (_sumGrid[x - 1] && _sumGrid[x - 1][y - 1]) || 0n;
    }
  };
  // console.log(_sumGrid);
  return (size, x, y) => {
    let ret = _sumGrid[x+size -1 ][y+size-1];

    ret -= (_sumGrid[x + size - 1] && _sumGrid[x + size - 1][y - 1]) || 0n;
    ret -= (_sumGrid[x - 1] && _sumGrid[x - 1][y + size - 1]) || 0n;
    ret += (_sumGrid[x - 1] && _sumGrid[x - 1][y - 1]) || 0n;
    return ret;
  };
}

const findMax = (serialNumber, size = 300) => (windowSize) => {
  const calcPower = genCalcPower(serialNumber);
  const pwr = [...Array(size).keys()].map(x => [...Array(size).keys()].map(y => calcPower(x, y)));
  let max = -Infinity;
  let maxX = 0;
  let maxY = 0;
  const sumSquare = genSumSquare(pwr);
  for(let x = 0; x < size - windowSize; x++) {
    for(let y = 0; y < size - windowSize; y++) {
      const sum = sumSquare(windowSize, x, y);
      if (sum > max) {
        max = sum;
        maxX = x;
        maxY = y;
      }
    }
  }
  return { x: maxX, y: maxY, val: max };
}


const findMaxPos = grid => {
  console.log({ grid: grid.length })
  let max = { val: -Infinity };
  for(let x = 0; x < grid.length; x++) {
    for(let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] > max.val) {
        max = { val: grid[x][y], x, y };
      }
    }
  }
  return max;
}

const findMaxWithSize = (serialNumber, size = 300) => {
  let max = { val : -Infinity };
  const fm = findMax(serialNumber, size);
  for(let s = 1; s <= size; s++) {
    var sMax = fm(s);
    if (sMax.val > max.val) {
      max = {...sMax, size: s };
    }
  }
  return max;
}

assert(genCalcPower(8)(3, 5) === 4);
assert(genCalcPower(57)(122, 79) === -5);
assert(genCalcPower(39)(217, 196) === 0);
assert(genCalcPower(71)(101, 153) === 4);

const test1 = findMax(18)(3);
assert(test1.x === 33);
assert(test1.y === 45);

const test2 = findMax(42)(3);
assert(test2.x === 21);
assert(test2.y === 61);


console.time('test3')
const test3 = findMaxWithSize(18);
console.timeEnd('test3')

assert(`${test3.x},${test3.y},${test3.size}` === `90,269,16`)
console.time('real')
console.log(findMaxWithSize(input));
console.timeEnd('real')
console.log(process.memoryUsage())

