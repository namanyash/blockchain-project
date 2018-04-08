const { Wallet } = require('./index');
const { ChainUtil } = require('../chain-util');
const SHA = require('crypto-js/sha256');
const minerReward = 200;

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recepient, amount) {
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.log(`Amount ${amount} ecxeds the user balance`);
      return;
    }
    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recepient });
    Transaction.signTransaction(this, senderWallet);
    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }
  static newTransaction(senderWallet, recepient, amount) {
    const transaction = new this();

    if (amount > senderWallet.balance) {
      console.log(`Amount ${amount} ecxeds the user balance`);
      return;
    }
    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      { amount, address: recepient }
    ]);
  }
  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: minerReward,
        address: minerWallet.publicKey
      }
    ]);
  }
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(SHA(transaction.outputs).toString())
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      SHA(transaction.outputs).toString()
    );
  }
}

module.exports = {
  Transaction: Transaction
};
