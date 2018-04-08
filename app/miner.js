const minerReward = 200;
const { Wallet } = require('../wallet/index');
const { Transaction } = require('../wallet/transaction');
class Miner {
  constructor(blockchain, transactionPool, wallet, p2p) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2p = p2p;
  }
  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    const block = this.blockchain.addBlock(validTransactions);
    this.p2p.syncChains();
    this.transactionPool.clear();
    this.p2p.broadcastClearTransaction();
    return block;
  }
}

module.exports = { Miner };
