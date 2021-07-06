import {Component} from "react";
import Layout from "../../components/Layout";
import {Form, Input, Message} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class NewCampaign extends Component {
    state = {
        minContribution: 0,
        errorMsg: '',
        loading: false
    }

    onSubmit = async (event) => {
        this.setState({loading: true, errorMsg: '' })
        try {
            event.preventDefault();
            const from = await web3.eth.getAccounts().then(a => a[0]);
            await factory.methods.deployCampaign(this.state.minContribution).send({from});
        } catch (e) {
            this.setState({errorMsg: e.message})
        }
        this.setState({loading: false})
    }

    render() {
        return (
            <Layout>
                <h3>New Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input label='wei'
                               labelPosition='right'
                               type='number'
                               value={this.state.minContribution}
                               onChange={e => this.setState({minContribution: e.target.value})}
                        />
                    </Form.Field>
                    <Message error header='Oops!' content={this.state.errorMsg}/>
                    <Form.Button loading={this.state.loading} primary>Create</Form.Button>
                </Form>
            </Layout>
        );
    }
}

export default NewCampaign
