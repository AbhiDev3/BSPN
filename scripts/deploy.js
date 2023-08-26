const hre = require("hardhat");

async function main() {
  
  const Greeter = await hre.ethers.getContractFactory("RentableNFTMarketplace");
  const greeter = await Greeter.deploy();

  await greeter.deployed();

  console.log("Contract deployed to:", greeter.address);

  console.log("Sleeping ...");
  await sleep(60000);

  await hre.run("verify:verify",{
    address : greeter.address,
  })
}


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});