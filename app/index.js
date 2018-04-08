const { Miner } = require('./miner');
const express = require('express');
const { Blockchain } = require('../blockchain');
const bodyParser = require('body-parser');
const { P2P } = require('./p2p-server');
const HTTP_PORT = process.argv[2] || 3001;
const { Wallet } = require('../wallet');
const { TransactionPool } = require('../wallet/trasnaction-pool.js');
const app = express();

const bc = new Blockchain();
const wallet = new Wallet();
console.log(wallet.toString());
const tp = new TransactionPool();
const p2p = new P2P(bc, tp);
const miner = new Miner(bc, tp, wallet, p2p);

app.use(bodyParser.json());

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});
app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`new block was added ${block.toString}`);
  res.redirect('/blocks');
});
app.post('/transact', (req, res) => {
  const { recepient, amount } = req.body;
  const transaction = wallet.createTransaction(recepient, amount, bc, tp);
  p2p.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added : ${block.toString()}`);
  p2p.syncChains();
  res.redirect('/blocks');
});
app.listen(HTTP_PORT, () => {
  console.log(`listening on port ${HTTP_PORT}`);
});

p2p.listen();
