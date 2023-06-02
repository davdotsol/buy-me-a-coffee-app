const Coffee = artifacts.require('Coffee');

module.exports = function (deployer) {
  deployer.deploy(Coffee).then((instance) => {
    console.log(instance.address);
  });
};
