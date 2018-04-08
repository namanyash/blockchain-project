const { Blockchain } = require('./index');
const { Block } = require('./block');
describe('Blockchain', () => {
  let bc, bkc;
  beforeEach(() => {
    bc = new Blockchain();
    bkc = new Blockchain();
  });

  it('starts with the genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('adds A NEW BLOCK', () => {
    const data = 'foo';
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it('validates a valid chain', () => {
    bkc.addBlock('foo');
    console.log(bkc);
    expect(bkc.isValidChain(bkc.chain)).toBe(true);
  });

  it('invalidates the wrong genesis block', () => {
    bkc.chain[0].data = 'aaaaaaaaa';

    expect(bkc.isValidChain(bkc.chain)).toBe(false);
  });

  it('invalidates a corrupt chain', () => {
    bkc.addBlock('foo');
    bkc.chain[1].data = 'fooaas';
    expect(bkc.isValidChain(bkc.chain)).toBe(false);
  });

  it('replaces the chain with a valid cahin', () => {
    bkc.addBlock('goo');
    bc.replaceChain(bkc.chain);
    expect(bc.chain).toEqual(bkc.chain);
  });

  it('does not replace equal or lesser length chains', () => {
    bkc.addBlock('goo');
    bkc.addBlock('aaa');
    bkc.replaceChain(bc.chain);
    expect(bc.chain).not.toEqual(bkc.chain);
  });
});
