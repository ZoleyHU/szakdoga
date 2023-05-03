import web3 from "./web3";
import ServiceFactory from './build/ServiceFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(ServiceFactory.interface),
    '0xAA8B052c5B431901219426571c53013Dd7b361a5'
);

//goerli: 0x55EbfbDd2FE5fE7B1aCFDB8fb17254F1Bf37ef08
//sepolia: 0xAA8B052c5B431901219426571c53013Dd7b361a5

export default instance;