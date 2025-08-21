const SimpleVoting = artifacts.require("SimpleVoting");

module.exports = async function(deployer) {
  const candidates = ["Amadou", "Demba", "Omar"];

  await deployer.deploy(SimpleVoting, candidates);

  // _deployer.deploy(SimpleVoting)
  //   .then(() => console.log("Contrat SimpleVoting déployé avec succès !"))
  //   .catch(error => console.error("Erreur de déploiement :", error));
};
