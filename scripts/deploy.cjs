const hre = require("hardhat");

async function main() {

  const lock = await hre.ethers.deployContract("BPRSec");

  await lock.waitForDeployment();

  console.log(lock.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});