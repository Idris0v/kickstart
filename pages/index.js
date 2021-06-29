import React, {Component} from "react";
import factory from "../ethereum/factory";

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    render() {
        const campList = this.props.campaigns.map(c => <li>{c}</li>)
        return <ul>{campList}</ul>;
    }
}

export default CampaignIndex;
