import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        "https://sepolia.infura.io/v3/96989c58fb794859835c56dd12ef1994"
    );
    web3 = new Web3(provider);
}

export default web3;