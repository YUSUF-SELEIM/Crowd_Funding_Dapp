import Web3 from 'web3';

const Web3 = require('web3');
// web3 lib instance
const web3 = new Web3(window.ethereum);
// get all accounts
const accounts = await web3.eth.getAccounts();

// Enable the Ethereum provider
window.ethereum.enable().then((accounts) => {
    console.log('Connected to Ethereum:', accounts[0]);
});

export default web3;