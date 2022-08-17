const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed1.binance.org');
const data = require('./Result_2.json');
const abi = require('./TradingPool.json')
const fs = require('fs');


var contract = new web3.eth.Contract(abi, "0xFd8ff92FE1193ef32F08FDCF27DCbF8f33ae5ac1");

const wrap = async (pair, user) => {
    try {
        let pendingReward = await contract.methods.pendingReward(pair,user).call().catch(err =>{
            return -1;
           });
        let hashrate = await contract.methods.userHashRate(pair,user).call().catch(err =>{
            return -1;
           });
       return {pendingReward,hashrate}
    }catch (err) {
        return -1;
    }
}

(async () => {
    const writeStream = fs.createWriteStream('trade.csv', { 'flags': 'w'
    , 'encoding': null
    , 'mode': 0666
    });
    for (let index = 0; index < data.length; index++) {
        let a = await wrap(data[index].pair,data[index].user);
        console.log(a);
        writeStream.write(`${data[index].user},${data[index].pair},${a.pendingReward},${a.hashrate}\n`);
    }
})().catch(err => console.log("err", err))