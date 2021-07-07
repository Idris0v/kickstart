import {Component} from "react";
import Layout from "../../../components/Layout";
import {withRouter} from "next/router";
import Link from 'next/link'
import Campaign from "../../../ethereum/campaign";
import {Card, Grid} from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import ContributeForm from "../../../components/ContributeForm";


class ShowCampaign extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.show);
        const summary = await campaign.methods.getSummary().call();

        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            campaignAddress: props.query.show
        };
    }

    get summaryCards() {
        const items = [
            {
                header: 'Minimum contribution',
                description: this.props.minimumContribution
            },
            {
                header: 'Balance',
                description: web3.utils.fromWei(this.props.balance, 'ether')
            },
            {
                header: 'Requests count',
                description: this.props.requestsCount
            },
            {
                header: 'Approvers',
                description: this.props.approversCount
            },
            {
                header: 'Manager',
                description: this.props.manager,
                style: {overflowWrap: 'break-word'}
            },
        ];
        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <h3>Details</h3>
                <Grid>
                    <Grid.Column width={10}>
                        <div>{this.summaryCards}</div>
                        <Link href={`/campaigns/${this.props.campaignAddress}/requests`}>
                            <a>View requests</a>
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={this.props.campaignAddress} minimum={this.props.minimumContribution}/>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default withRouter(ShowCampaign);
