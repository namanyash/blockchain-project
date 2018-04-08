const { Block } = require('./block.js');

const fooBlock = Block.mineBlock(Block.genesis(), 'foo');

console.log(fooBlock.toString());
