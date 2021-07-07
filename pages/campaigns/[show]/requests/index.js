import {Component} from "react";
import {withRouter} from "next/router";
import {Button, Table} from "semantic-ui-react";
import Link from 'next/link'
import Layout from "../../../../components/Layout";
import Campaign from "/ethereum/campaign";
import web3 from "../../../../ethereum/web3";

class Requests extends Component {
    static async getInitialProps(props) {
        const address = props.query.show;

        const campaign = await Campaign(address);
        const approvers = await campaign.methods.approversCount().call();
        const requestsCount = await campaign.methods.getRequestsCount().call();
        const requests = await Promise.all(
            Array(Number(requestsCount))
                .fill(null)
                .map((_, idx) => campaign.methods.requests(idx).call())
        );
        return { address, requests, approvers };
    }

    get tableBody() {
        return this.props.requests.map((request) => {
            const { description, value, recipient, complete, approvalCount } = request;
            return (
                <Table.Row>
                    <Table.Cell>{description}</Table.Cell>
                    <Table.Cell>{web3.utils.fromWei(value, 'ether')}</Table.Cell>
                    <Table.Cell>{recipient}</Table.Cell>
                    <Table.Cell>{approvalCount}/{this.props.approvers}</Table.Cell>
                    <Table.Cell><Button disabled={complete}>Approve</Button></Table.Cell>
                    <Table.Cell><Button disabled={complete}>Finalize</Button></Table.Cell>
                </Table.Row>
            );
        })
    }

    render() {
        return (
            <Layout>
                <Link href={`/campaigns/${this.props.address}/requests/new`}>
                    <Button floated="right" primary>New request</Button>
                </Link>
                <h3>Requests</h3>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount (eth)</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.tableBody}
                    </Table.Body>
                </Table>
            </Layout>
        );
    }
}

export default withRouter(Requests);
