import web3 from "./web3";
import ServiceFactory from './build/ServiceFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(ServiceFactory.interface),
    '0x65071CA07891EB914aB5A9aCf1Cf21B64ac80Eca'
);

//goerli: 0x55EbfbDd2FE5fE7B1aCFDB8fb17254F1Bf37ef08
//sepolia: 0x65071CA07891EB914aB5A9aCf1Cf21B64ac80Eca

export default instance;