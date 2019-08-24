const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log("Block mines: " + this.hash );
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "21/08/2019", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for( let i =1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let mitcoin = new Blockchain();
mitcoin.addBlock(new Block(1, "21/08/2019", { amount : 4 }));
mitcoin.addBlock(new Block(2, "22/08/2019", { amount : 10 }));


console.log(' Is blockchain valid? ' + mitcoin.isChainValid());

//to test the chain breakage, try this code ----
//mitcoin.chain[1].data = { amount: 100 };
//mitcoin.chain[1].hash = mitcoin.chain[1].calculateHash();
//console.log(' Is blockchain valid? ' + mitcoin.isChainValid());

//To print the complete chain, try this code ----
console.log(JSON.stringify(mitcoin, null, 4));