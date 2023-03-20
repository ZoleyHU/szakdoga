import web3 from "./web3";
import ServiceFactory from './build/ServiceFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(ServiceFactory.interface),
    '0xdc48e8d07382D411080d4851a30b5058b764985C'
);

export default instance;