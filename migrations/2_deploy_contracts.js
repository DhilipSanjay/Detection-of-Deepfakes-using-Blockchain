const IpfsStorage = artifacts.require("IpfsStorage");

module.exports = function (deployer) {
  deployer.deploy(IpfsStorage);
};
