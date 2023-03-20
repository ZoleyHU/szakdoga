import web3 from "./web3";
import Service from "./build/Service.json";

const ServiceComponent = (address) => {
    return new web3.eth.Contract(
        JSON.parse(Service.interface),
        address
    );
};

export default ServiceComponent;