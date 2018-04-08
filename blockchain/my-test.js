const { Block } = require('./block.js');
const { Blockchain } = require('./index.js');
const bc = new Blockchain();
for (var i = 0; i < 10; i++) {
  console.log(bc.addBlock(`fooo${i}`).toString());
}
