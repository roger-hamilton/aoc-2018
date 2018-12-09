/**
The second check is slightly more complicated: you need to find the value of the root node (A in the example above).

The value of a node depends on whether it has child nodes.

If a node has no child nodes, its value is the sum of its metadata entries. So, the value of node B is 10+11+12=33, and the value of node D is 99.

However, if a node does have child nodes, the metadata entries become indexes which refer to those child nodes. A metadata entry of 1 refers to the first child node, 2 to the second, 3 to the third, and so on. The value of this node is the sum of the values of the child nodes referenced by the metadata entries. If a referenced child node does not exist, that reference is skipped. A child node can be referenced multiple time and counts each time it is referenced. A metadata entry of 0 does not refer to any child node.

For example, again using the above nodes:

Node C has one metadata entry, 2. Because node C has only one child node, 2 references a child node which does not exist, and so the value of node C is 0.
Node A has three metadata entries: 1, 1, and 2. The 1 references node A's first child node, B, and the 2 references node A's second child node, C. Because node B has a value of 33 and node C has a value of 0, the value of node A is 33+33+0=66.
So, in this example, the value of the root node is 66.

What is the value of the root node?
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');

const nums = input.split(' ').map(n => +n);

const parseNode = list => {
  const childCount = list[0];
  const metaCount = list[1];
  let idx = 2;
  const children = [];
  for(let i = 0; i < childCount; i++) {
    const { node, consumed } = parseNode(list.slice(idx));
    children.push(node);
    idx += consumed;
  }
  const metadata = list.slice(idx, idx + metaCount);

  return {
    node: {
      children,
      metadata
    },
    consumed: idx + metaCount,
  }
};

const getNodeValue = node => {
  let vals = node.metadata;
  if (node.children.length) {
    vals = node.metadata
      .filter(i => i <= node.children.length)
      .map(i => node.children[i - 1])
      .map(getNodeValue);
  }
  return _.sum(vals);
}

const test1 = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`.split(' ').map(n => +n);

const test = parseNode(test1);

assert(getNodeValue(test.node) === 66);

const data = parseNode(nums);

console.log(getNodeValue(data.node));