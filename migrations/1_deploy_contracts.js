const BuyMeACoffee = artifacts.require('BuyMeACoffee');

module.exports = function (deployer) {
  deployer.deploy(BuyMeACoffee).then((instance) => {
    console.log(instance.address);
  });
};
