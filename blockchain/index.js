const { Block } = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);
    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (var i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (block.lastHash !== lastBlock.hash) {
        return false;
      }
      if (block.hash !== Block.blockHash(block)) {
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Chain is not longer than the correct chain');
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log('invalid chain recieved');
    } else {
      console.log('replacing blockchain with the new chain');
      this.chain = newChain;
    }
  }
}

module.exports = { Blockchain: Blockchain };
