import React, {Component} from "react";
import factory from "../ethereum/factory";
import {Button, CardGroup} from "semantic-ui-react";
import Link from 'next/link'

import Layout from "../components/Layout";

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    getCampaignsCards() {
        const items = this.props.campaigns.map(c => ({
            header: c,
            description: (
                <Link href={`/campaigns/${c}`}>
                    <a>View Campaign</a>
                </Link>
            ),
            fluid: true
        }));
        return <CardGroup items={items} />;
    }

    render() {
        return <Layout>
            <div>
                <h3>Open Campaigns</h3>
                <Link href={'/campaigns/new'}>
                    <a>
                        <Button floated='right' content='Create Campaign' icon='add circle' primary/>
                    </a>
                </Link>
                {this.getCampaignsCards()}
            </div>
        </Layout>;
    }
}

export default CampaignIndex;
