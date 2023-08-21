const FKCGame = artifacts.require("FKCGame.sol");
const FKCController = artifacts.require("FKCController.sol");

module.exports = async function (deployer) {  
  await deployer.deploy(FKCController);
  const fkccontroller = await FKCController.deployed();
  await deployer.deploy(FKCGame, fkccontroller.address);
  const fkcgame = await FKCGame.deployed();
  await fkccontroller.configure(fkcgame.address);
};