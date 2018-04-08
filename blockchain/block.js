const sha = require('crypto-js/sha256');

const difficulty = 2;
let d;
const mineRate = 3000;
class Block {
  constructor(timestamp, lastHash, hash, data, nonce, d) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = d;
  }
  toString() {
    return `Block-
    Timestamp: ${this.timestamp}
    Last Hash: ${this.lastHash.substring(0, 10)}
    Hash: ${this.hash.substring(0, 10)}
    Data: ${this.data}
    Nonce : ${this.nonce}
    DIfficulty : ${this.difficulty}`;
  }

  static genesis() {
    return new this(
      'aaa llolollolo0lo',
      '-----',
      'f1rZt h45h',
      [],
      0,
      difficulty
    );
  }

  static mineBlock(lastBlock, data) {
    d = lastBlock.difficulty;
    let timestamp = Date.now();
    const lastHash = lastBlock.hash;
    let nonce = 0;
    let hash;
    do {
      timestamp = Date.now();
      nonce++;
      d = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, hash, nonce, d);
    } while (hash.substring(0, d) != '0'.repeat(d));
    return new this(timestamp, lastHash, hash, data, nonce, d);
  }

  static hash(timestamp, lastHash, data, hash, nonce, difficulty) {
    return sha(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  static blockHash(block) {
    return sha(
      `${block.timestamp}${block.lastHash}${block.data}${block.nonce}${
        block.difficulty
      }`
    ).toString();
  }

  static adjustDifficulty(lastBlock, time) {
    d = lastBlock.difficulty;
    d = lastBlock.timestamp + mineRate > time ? d + 1 : d - 1;
    return d;
  }
}
module.exports = {
  Block: Block,
  difficulty: d || difficulty
};
