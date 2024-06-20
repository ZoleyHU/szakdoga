const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ServiceFactory.json');

const provider = new HDWalletProvider(
    'Insert_your_12_keyword_pharse_here',
    'https://sepolia.infura.io/v3/96989c58fb794859835c56dd12ef1994'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    let result;
    try {
        result = await new web3.eth.Contract(
            JSON.parse(compiledFactory.interface)
        )
            .deploy({ data: compiledFactory.bytecode })
            .send({ gas: '1000000', from: accounts[0] });
        console.log('Contract deployed to', result.options.address);
    } catch (e) {
        console.log(e);
    }

    provider.engine.stop();
};
deploy();