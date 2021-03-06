const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const DEFAULT_MESSAGE = 'Hello World!';

beforeEach(async() => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();

	// Use an account to deploy the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({ data: bytecode, arguments: [DEFAULT_MESSAGE] })
	.send({ from: accounts[0], gas: '1000000' });

	inbox.setProvider(provider);
});


describe('Inbox', () => {
	it('deploys a contract', () => {
		assert.ok(inbox.options.address);
	});

	it('has a default message', async() => {
		// to call a public variable you just call it by name with parenthesis like this 'message()'
		const message = await inbox.methods.message().call();
		assert.equal(message, DEFAULT_MESSAGE);
	});

	it('can set a message with the setMessage method', async() => {
		await inbox.methods.setMessage('Bye!').send({from: accounts[0], gas: '1000000'});
		const message = await inbox.methods.message().call();
		assert.equal(message, "Bye!");
	});
});