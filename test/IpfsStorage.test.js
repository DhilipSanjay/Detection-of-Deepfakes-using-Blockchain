const IpfsStorage = artifacts.require("./IpfsStorage.sol");

contract('IpfsStorage', (accounts) => {
    let ipfsStorage;

    before(async () => {
        ipfsStorage = await IpfsStorage.deployed();
    });

    describe('deployment', async() => {
        it('deploys successfully', async() =>{
            const address = await ipfsStorage.address;
            assert.notEqual(address, '0x0');
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });
})