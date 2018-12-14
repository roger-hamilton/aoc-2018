/**
You finally have a chance to look at all of the produce moving around. Chocolate, cinnamon, mint, chili peppers, nutmeg, vanilla... the Elves must be growing these plants to make hot chocolate! As you realize this, you hear a conversation in the distance. When you go to investigate, you discover two Elves in what appears to be a makeshift underground kitchen/laboratory.

The Elves are trying to come up with the ultimate hot chocolate recipe; they're even maintaining a scoreboard which tracks the quality score (0-9) of each recipe.

Only two recipes are on the board: the first recipe got a score of 3, the second, 7. Each of the two Elves has a current recipe: the first Elf starts with the first recipe, and the second Elf starts with the second recipe.

To create new recipes, the two Elves combine their current recipes. This creates new recipes from the digits of the sum of the current recipes' scores. With the current recipes' scores of 3 and 7, their sum is 10, and so two new recipes would be created: the first with score 1 and the second with score 0. If the current recipes' scores were 2 and 3, the sum, 5, would only create one recipe (with a score of 5) with its single digit.

The new recipes are added to the end of the scoreboard in the order they are created. So, after the first round, the scoreboard is 3, 7, 1, 0.

After all new recipes are added to the scoreboard, each Elf picks a new current recipe. To do this, the Elf steps forward through the scoreboard a number of recipes equal to 1 plus the score of their current recipe. So, after the first round, the first Elf moves forward 1 + 3 = 4 times, while the second Elf moves forward 1 + 7 = 8 times. If they run out of recipes, they loop back around to the beginning. After the first round, both Elves happen to loop around until they land on the same recipe that they had in the beginning; in general, they will move to different recipes.

Drawing the first Elf as parentheses and the second Elf as square brackets, they continue this process:

(3)[7]
(3)[7] 1  0 
 3  7  1 [0](1) 0 
 3  7  1  0 [1] 0 (1)
(3) 7  1  0  1  0 [1] 2 
 3  7  1  0 (1) 0  1  2 [4]
 3  7  1 [0] 1  0 (1) 2  4  5 
 3  7  1  0 [1] 0  1  2 (4) 5  1 
 3 (7) 1  0  1  0 [1] 2  4  5  1  5 
 3  7  1  0  1  0  1  2 [4](5) 1  5  8 
 3 (7) 1  0  1  0  1  2  4  5  1  5  8 [9]
 3  7  1  0  1  0  1 [2] 4 (5) 1  5  8  9  1  6 
 3  7  1  0  1  0  1  2  4  5 [1] 5  8  9  1 (6) 7 
 3  7  1  0 (1) 0  1  2  4  5  1  5 [8] 9  1  6  7  7 
 3  7 [1] 0  1  0 (1) 2  4  5  1  5  8  9  1  6  7  7  9 
 3  7  1  0 [1] 0  1  2 (4) 5  1  5  8  9  1  6  7  7  9  2 
The Elves think their skill will improve after making a few recipes (your puzzle input). However, that could take ages; you can speed this up considerably by identifying the scores of the ten recipes after that. For example:

If the Elves think their skill will improve after making 9 recipes, the scores of the ten recipes after the first nine on the scoreboard would be 5158916779 (highlighted in the last line of the diagram).
After 5 recipes, the scores of the next ten would be 0124515891.
After 18 recipes, the scores of the next ten would be 9251071085.
After 2018 recipes, the scores of the next ten would be 5941429882.
What are the scores of the ten recipes immediately after the number of recipes in your puzzle input?
*/
const assert = require('assert');
const input = 430971;

const getDigits = n => {
  const digits = [];
  while(n) {
    digits.unshift(n % 10);
    n = Math.floor(n / 10);
  }
  return digits.length ? digits : [0];
};

class Node {
  constructor(val, left, right) {
    this.val = +val;
    this.left = left;
    this.right = right;
  }

  insertRight(nodeStart, nodeEnd) {
    nodeEnd = nodeEnd ? nodeEnd : nodeStart;
    const right = this.right;
    this.right = nodeStart;
    nodeStart.left = this;
    right.left = nodeEnd;
    nodeEnd.right = right;
  }

  print(highlight=[]) {
    const arr = [this.val];
    let node = this;
    while(this != (node = node.right)) {

      arr.push(highlight.includes(node) ? `[${node.val}]` : node.val);
    }
    return arr.join(' ');
  }
}
const nodesFromArray = arr => {
  const nodes = arr.map(d => new Node(d));
  for(const i in nodes) {
    nodes[i].left = nodes[i - 1];
    nodes[i].right = nodes[+i + 1];
  }
  nodes[0].left = nodes[nodes.length - 1]
  nodes[nodes.length - 1].right = nodes[0];
  return nodes;
}

const makeRecipies = (rounds) => {
  const digits = nodesFromArray(getDigits(37));
  let elfs = [digits[0], digits[1]];
  let end = digits[1];
  let len = 2;
  while(true) {
    const sum = elfs.reduce((a, b) => a + b.val, 0);
    const newRecipies = nodesFromArray(getDigits(sum));
    len += newRecipies.length;
    end.insertRight(newRecipies[0], newRecipies[newRecipies.length - 1]);
    end = newRecipies[newRecipies.length - 1];

    let test = '';
    let cur = end;
    while(test.length < rounds.length + 1 && cur != digits[0]) {
      test = cur.val + test;
      cur = cur.left;
    }
    // if (len % 1000 === 0) console.log(test, len);
    // break;
    const match = test.indexOf(rounds);
    if (match >= 0) {
      // console.log(len, match)
      return len + match - 1 - rounds.length;
    }

    elfs = elfs.map(elf => {
      let node = elf;
      for(let j = 0; j < elf.val + 1; j++) {
        node = node.right;
      }
      return node;
    });
  }
}

const find = (str) => {

}

assert(makeRecipies('51589') === 9)
assert(makeRecipies('01245') === 5)
assert(makeRecipies('92510') === 18)
assert(makeRecipies('59414') === 2018)
console.time('real')
console.log(makeRecipies(input + ''));
console.timeEnd('real')


