import Layout from "../../../../components/Layout";
import {Button, Form, Input} from "semantic-ui-react";
import {useState} from "react";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import {useRouter} from "next/router";

function NewRequest() {
    const router = useRouter();
    const [formValue, setValue] = useState({ description: '', value: '', recipient: '' });

    const onSubmit = async (e) => {
        e.preventDefault();
        const account = await web3.eth.getAccounts().then(a => a[0]);
        const campaign = await Campaign(router.query.show);
        try {
            const { description, value, recipient } = formValue;
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: account })
            await router.push('/campaigns/' + router.query.show);
        } catch (e) {  }
    }
    return (
        <Layout>
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={formValue.description}
                        onChange={(event) => setValue({ ...formValue, description: event.target.value })}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        value={formValue.value}
                        onChange={(event) => setValue({ ...formValue, value: event.target.value })}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={formValue.recipient}
                        onChange={(event) => setValue({ ...formValue, recipient: event.target.value })}
                    />
                </Form.Field>

                <Button primary>Create!</Button>
            </Form>
        </Layout>
    );
}
export default NewRequest;
