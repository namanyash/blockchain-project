const { ChainUtil } = require('../chain-util');
const { Transaction } = require('./transaction');

const { TransactionPool } = require('./trasnaction-pool');
console.log(Transaction);
console.log(ChainUtil);
console.log(TransactionPool);
class Wallet {
  constructor() {
    this.balance = 500;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
        publickKey :${this.publicKey.toString()}
        balance: ${this.balance}`;
  }
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
  createTransaction(recepient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);
    if (amount > this.balance) {
      console.log(`${amount} exceeds the current balance`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recepient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recepient, amount);
    }
    transactionPool.updateOrAddTransaction(transaction);
    return transaction;
  }
  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    blockchain.chain.forEach(block =>
      block.data.forEach(transaction => {
        transactions.push(transaction);
      })
    );
    const walletInputTs = transactions.filter(
      transaction => transaction.input.address === this.publicKey
    );
    let startTime = 0;
    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce((prev, current) => {
        prev.input.timespamp > current.input.timestamp ? prev : current;
      });
      balance = recentInputT.outputs.find(
        output => output.address === this.publicKey
      ).amount;
      startTime = recentInputT.input.timespamp;
    }
    transactions.forEach(transaction => {
      if (transaction.input.timespamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });
    console.log(balance);
    return balance;
  }
}
module.exports = { Wallet };
