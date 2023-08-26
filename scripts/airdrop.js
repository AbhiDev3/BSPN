const hre = require("hardhat");


async function main() {
    const worldIDAddress = "0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa"


    const ContractFactory = await hre.ethers.getContractFactory('earlyAdoptersClaim')
    const contract = await ContractFactory.deploy(worldIDAddress)

    await contract.deployed()

    console.log('Contract deployed to:', contract.address)
    
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})