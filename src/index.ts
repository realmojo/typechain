import * as CryptoJS from 'crypto-js';

class Block {
  static cacluateBlockHash = (
    index: number,
    previous: string,
    timestamp: number,
    data: string,
  ): string => CryptoJS.SHA256(index + previous + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === 'number' &&
    typeof aBlock.hash === 'string' &&
    typeof aBlock.previousHash === 'string' &&
    typeof aBlock.timestamp === 'number' &&
    typeof aBlock.data === 'string';

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number,
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBLock: Block = new Block(0, '230023501249', '', 'Hello', 123456);

let blockchain: Block[] = [genesisBLock];

const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimestamp();
  const newHash: string = Block.cacluateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data,
  );

  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimestamp,
  );

  addBlock(newBlock);

  return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
  Block.cacluateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data,
  );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): Boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidiateBlock: Block): void => {
  if (isBlockValid(candidiateBlock, getLatestBlock())) {
    blockchain.push(candidiateBlock);
  }
};

createNewBlock('Second Block');
createNewBlock('Third Block');
createNewBlock('Fourth Block');

console.log(blockchain);

export {};
