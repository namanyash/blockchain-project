const websocket = require('ws');
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION'
};
const P2P_PORT = process.argv[3] || 5001;
console.log(P2P_PORT);
const peers = process.argv[4] ? process.argv[4].split(',') : [];

class P2P {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }
  listen() {
    const server = new websocket.Server({ port: P2P_PORT }); //connects to the first main server
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();
    console.log(`listening for p2p connection on ${P2P_PORT}`);
  }
  connectToPeers() {
    //interlinks the sockets
    console.log(peers);
    peers.forEach(peer => {
      const socket = new websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('socket connected');

    this.messageHandler(socket);
    this.sendChain(socket);
  }
  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);

      console.log(data);
      if (data.chain) this.blockchain.replaceChain(data.chain);
      if (data.transaction)
        this.transactionPool.updateOrAddTransaction(data.transaction);
      if (data.clearTransaction) {
        this.transactionPool.clear();
      }
    });
  }

  syncChains() {
    //when a new block is added by one socket it sould be sent to all servers right?
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  sendChain(socket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      })
    );
  }
  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction: transaction
      })
    );
  }
  broadcastClearTransaction() {
    this.sockets.forEach(socket =>
      socket.send(JSON.stringify({ clearTransaction: 1 }))
    );
  }
}

module.exports = { P2P };
