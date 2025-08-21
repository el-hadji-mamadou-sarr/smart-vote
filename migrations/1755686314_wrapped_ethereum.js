const wrapped_ethereum = artifacts.require("wrapped_ethereum");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.

  _deployer.deploy(wrapped_ethereum)
    .then(() => console.log("Wrapped Ethereum contract deployed successfully."))
    .catch(error => console.error("Deployment failed:", error));
};
