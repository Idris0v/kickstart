import {Component} from "react";
import Layout from "../../components/Layout";
import { withRouter } from "next/router";
import Campaign from "../../ethereum/campaign";


class ShowCampaign extends Component{
    static async getInitialProps(props) {
        console.log('props', props.query.show);
        const campaign = Campaign(props.query.show);
        const summary = await campaign.methods.getSummary().call();
        console.log(summary);

        return { };
    }

    render() {
        return (
            <Layout>
                <h3>Details</h3>
                <div>{this.props.router.query.show}</div>
            </Layout>
        );
    }
}

export default withRouter(ShowCampaign);
