const { Block } = require('./block');
let { difficulty } = require('./block');
let data, lastBlock, block;
describe('Block', () => {
  beforeEach(() => {
    data = 'aaa';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });
  it('sets the data to match the input', () => {
    expect(block.data).toEqual(data);
  });
  it('sets the last hash to match the hash of last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it('generates the hash that matches the difficulty', () => {
    console.log(block.toString());
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      '0'.repeat(block.difficulty)
    );
  });
  it('correctly lowers difficulty', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(
      block.difficulty - 1
    );
  });

  it('correctly raises difficulty', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(
      block.difficulty + 1
    );
  });
});
