const readline = require("readline");

// Import the crypto module for calculating hashes
const crypto = require("crypto");

// Define a Block class that can be used to represent a block in the blockchain
class Block {
  // Constructor for the Block class
  constructor(index, previousHash, timestamp, data, hash) {
    this.index = index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash.toString();
  }
}

// Define a Blockchain class that can be used to represent the entire blockchain
class Blockchain {
  // Constructor for the Blockchain class
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  // Method for creating the genesis block of the blockchain
  createGenesisBlock() {
    return new Block(0, "0", new Date().getTime() / 1000, "Genesis block", "0");
  }

  // Method for getting the latest block of the blockchain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Method for adding a new block to the blockchain
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = this.calculateHash(newBlock);
    this.chain.push(newBlock);
  }

  // Method for calculating the hash of a block
  calculateHash(block) {
    return crypto
      .createHash("sha256")
      .update(block.index + block.previousHash + block.timestamp + block.data)
      .digest("hex");
  }
}

// Define a Shop class that can be used to track the purchases and sales within each shop
class Shop {
  // Constructor for the Shop class
  constructor() {
    this.purchases = 0;
    this.sales = 0;
  }

  // Method for recording a purchase made by the shop
  recordPurchase(amount) {
    this.purchases += amount;
  }

  // Method for recording a sale made by the shop
  recordSale(amount) {
    this.sales += amount;
  }

  // Method for calculating the profit of the shop
  calculateProfit() {
    return this.sales - this.purchases;
  }
}

// Define a Villager class that can be used to track the wealth of each villager
class Villager {
  // Constructor for the Villager class
  constructor() {
    this.wealth = 0;
  }

  // Method for recording a transaction made by the villager
  recordTransaction(amount) {
    this.wealth += amount;
  }
}

// Define a TransactionLog class that can be used to keep a log of each transaction
class TransactionLog {
  // Constructor for the TransactionLog class
  constructor() {
    this.log = [];
  }

  // Method for adding a transaction to the log
  addTransaction(transaction) {
    this.log.push(transaction);
  }
}

// Define a Menu class that can be used to manage the system interactively
class Menu {
  // Constructor for the Menu class
  constructor() {
    this.villagers = {};
    this.transactionLog = new TransactionLog();
  }

  // Method for adding a villager to the system
  addVillager(name) {
    this.villagers[name] = new Villager();
  }

  // Method for recording a transaction made by a villager
  recordTransaction(name, amount) {
    this.villagers[name].recordTransaction(amount);
    this.transactionLog.addTransaction({
      name: name,
      amount: amount,
    });
  }

  // Method for printing the wealth of a villager
  printVillagerWealth(name) {
    console.log(`${name} has a wealth of ${this.villagers[name].wealth}`);
  }

  // Method for printing the transaction log
  printTransactionLog() {
    console.log("Transaction log:");
    for (let i = 0; i < this.transactionLog.log.length; i++) {
      let transaction = this.transactionLog.log[i];
      console.log(
        `${transaction.name} made a transaction of ${transaction.amount}`
      );
    }
  }

  // Method for managing the system interactively
  manage() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Enter a command (add, record, print wealth, print log, exit): ",
      (input) => {
        if (input === "add") {
          rl.question("Enter the name of the villager to add: ", (name) => {
            this.addVillager(name);
            console.log(`${name} has been added to the system`);
            this.manage();
          });
        } else if (input === "record") {
          rl.question(
            "Enter the name of the villager making the transaction: ",
            (name) => {
              rl.question("Enter the amount of the transaction: ", (amount) => {
                this.recordTransaction(name, parseInt(amount));
                console.log(`Transaction recorded`);
                this.manage();
              });
            }
          );
        } else if (input === "print wealth") {
          rl.question(
            "Enter the name of the villager to print the wealth for: ",
            (name) => {
              this.printVillagerWealth(name);
              this.manage();
            }
          );
        } else if (input === "print log") {
          this.printTransactionLog();
          this.manage();
        } else if (input === "exit") {
          console.log("Exiting the system...");
        }
      }
    );
  }
}

let menu = new Menu();
menu.manage();
