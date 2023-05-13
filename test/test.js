const assert = require('assert');
const ganache = require('ganache-cli');
const Web3Library = require('web3');
const web3 = new Web3Library(ganache.provider());

const builtService = require('../ethereum/build/Service.json');
const builtServiceFactory = require('../ethereum/build/ServiceFactory.json');

let accounts;
let service;
let factory;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(builtServiceFactory.interface))
        .deploy({ data: builtServiceFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});
    await factory.methods.createService('sName', 'sDesc').send({from: accounts[0], gas:'1000000'})
    const deployedServices = await factory.methods.getDeployedServices().call();
    service = await new web3.eth.Contract(JSON.parse(builtService.interface), deployedServices[0]);
});

describe('ServiceFactory okosszerződés', () => {
    it('Deployolódik', () => {
        assert.ok(factory.options.address);
    });
    it('Deployol szolgáltatást', async () => {
        await factory.methods.createService('sName2', 'sDesc2').send({from: accounts[0], gas:'1000000'});
        const deployedServices = await factory.methods.getDeployedServices().call();
        assert.equal(2, deployedServices.length);
    });
    it('Visszaadja a legértékeltebb szolgáltatást', async () => {
        await factory.methods.createService('sName2', 'sDesc2').send({from: accounts[0], gas:'1000000'});
        const deployedServices = await factory.methods.getDeployedServices().call();
        const newService = await new web3.eth.Contract(JSON.parse(builtService.interface), deployedServices[1]);
        await newService.methods.rate(10,'asd','10').send({from:accounts[0], gas:'1000000'});
        const mostRatedService = await factory.methods.getMostRatedService().call();
        assert.equal(deployedServices[1], mostRatedService);
    });
});

describe('Service okosszerződés', () => {
    it('Deployolva van', () => {
        assert.ok(service.options.address);
    });
    it('értékelhető', async () => {
        await service.methods.rate(10,'asd','10').send({from:accounts[0], gas:'1000000'});
        const isRatedByUser = await service.methods.reviewers(accounts[0]).call();
        const rateCount = await service.methods.getReviewCount().call();
        assert(isRatedByUser);
        assert.equal(1, rateCount);
    });
    it('nem értékelhető többször 1 felhasználó számára', async () => {
        try {
            await service.methods.rate(10,'asd','10').send({from:accounts[0], gas:'1000000'});
            await service.methods.rate(8,'asd','9').send({from:accounts[0], gas:'1000000'});
            assert(false);
        } catch (e) {
            assert(e);
        }
    });
    it('értékelés után megjelölődik', async () => {
        await service.methods.rateAndChangeTag(1,'asd','1').send({from:accounts[0], gas:'1000000'});
        const tagged = service.methods.tagged().call();
        assert(tagged);
    });
    it('tárolja az összes értékelést', async () => {
        await service.methods.rate(10,'asd','10').send({from:accounts[0], gas:'1000000'});
        await service.methods.rate(8,'asd','9').send({from:accounts[1], gas:'1000000'});
        const rateCount = await service.methods.getReviewCount().call();
        assert.equal(2, rateCount);
    });
});