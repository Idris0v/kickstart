import Web3 from "web3";
let web3

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined' ) {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/b3357c11ce3743e2a0b85e9365745e9c'
    );

    web3 = new Web3(provider);
}

export default web3;
