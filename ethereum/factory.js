import web3 from './web3'
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x02E3E409Aae519BAf9531E2d4d8099066DdB932E'
);

export default instance
