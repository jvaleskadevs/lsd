import { ethers } from "hardhat";

async function main() {
  const dealer = await ethers.deployContract("Dealer", [
    "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f" // fDAIx address
  ]);

  await dealer.waitForDeployment();

  console.log(
    `Dealer deployed to ${dealer.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
