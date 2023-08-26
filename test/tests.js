const { expect } = require("chai");
const { ethers, network } = require("hardhat");

const setupContract = async () => {
  const RentableNFT = await ethers.getContractFactory("RentableNFTMarketplace");
  const rentableNFT = await RentableNFT.deploy();
  await rentableNFT.deployed();
  return rentableNFT;
};

const setupAccounts = async () => {
  const accounts = await ethers.getSigners();
//   console.log(accounts[0].address,accounts[1].address)
  return [accounts[0], accounts[1]];
};

it("Rent flow ", async () => {
    const rentableNFT = await setupContract();
    const [owner, renter] = await setupAccounts();
  
      const tx = await rentableNFT.connect(owner).createToken("",1000000,100,true,true,true);
      await tx.wait();

  
      const expiryTimestamp = Math.round(new Date().getTime() / 1000) + 3600;
      const tx2 = await rentableNFT
        .connect(renter)
        .rentOutToken(1,expiryTimestamp,{value: 101});
      await tx2.wait();
  
      const renterOf = await rentableNFT.userOf(1);
    expect(renterOf).to.equal(renter.address);
  
      await network.provider.send("evm_increaseTime", [3601]); // 3601 -> 3600 seconds = 1 hour + 1 seconds
      await network.provider.send("evm_mine");
  
      const renterOf2 = await rentableNFT.userOf(1);
      expect(renterOf2).to.not.equal(renter.address);
      expect(renterOf2).to.equal("0x0000000000000000000000000000000000000000");
  });
  