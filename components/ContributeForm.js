import {Button, Form, Input} from "semantic-ui-react";
import {useState} from "react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import {useRouter} from "next/router";


function ContributeForm(props) {
    const router = useRouter();

    const [value, setValue] = useState(web3.utils.fromWei(props.minimum, 'ether'));
    const contribute = async (e) => {
        e.preventDefault();
        console.log('yeah!');
        const campaign = await Campaign(props.address);
        try {
            const account = await web3.eth.getAccounts().then(a => a[0]);
            await campaign.methods.contribute().send({
                from: account,
                value: web3.utils.toWei(value, 'ether')
            });
            await router.replace('/campaigns/' + props.address);
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <Form onSubmit={contribute}>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input
                    label='ether'
                    labelPosition='right'
                    min={web3.utils.fromWei(props.minimum, 'ether')}
                    value={value}
                    onChange={(e) => setValue(e.target.value) }
                />
            </Form.Field>
            <Button primary>Contribute!</Button>
        </Form>
    )
}

export default ContributeForm;
