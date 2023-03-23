import web3 from "./web3";
import ServiceFactory from './build/ServiceFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(ServiceFactory.interface),
    '0x3bc20E8813e22d4bA2624D53bC5767B6e576E392'
);

//0xdc48e8d07382D411080d4851a30b5058b764985C
export default instance;