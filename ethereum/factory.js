import web3 from './web3'
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x3E16c772E3aa30A0e220e1A5d5050615fF7007a3'
);

export default instance
