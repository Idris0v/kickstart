const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts, factory, campaignAddress, campaign

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: 1_000_000 });

    await factory.methods.deployCampaign('100').send({
        from: accounts[0],
        gas: 1_000_000
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call()

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )
})

describe('Campaigns', () => {
    it('should deploy a factory and a campaign', function () {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('should mark caller as a manager', async function () {
        const manager = await campaign.methods.manager().call()
        console.log(manager);
        assert.strictEqual(manager, accounts[0]);
    });

    it('should allow people to contribute and mark them as approvers', async function () {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: 1000
        });
        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        const approversCount = await campaign.methods.approversCount().call();
        assert.ok(isApprover);
        assert.strictEqual(approversCount, '1');
    });

    it('should allow a amnager to make a payment request', async function () {
        await campaign.methods.createRequest(
            'buy tesla',
            200,
            accounts[1]
        ).send( { from: accounts[0], gas: 1_000_000 })

        const requests = await campaign.methods.requests(0).call()
        assert.strictEqual(requests.recipient, accounts[1])
    });

    it('should process request', async function () {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest(
            'buy tesla',
            web3.utils.toWei('5', 'ether'),
            accounts[1]
        ).send({ from: accounts[0], gas: 1_000_000 });

        await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: 1_000_000 });
        await campaign.methods.finalize(0).send({ from: accounts[0], gas: 1_000_000 });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = await web3.utils.fromWei(balance, 'ether');
        console.log(balance);
        balance = parseFloat(balance);
        console.log(balance);

        assert.ok(balance > 104)
    });
})
