// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades} = require("hardhat");
const hre = require("hardhat");
const { JsonRpcProvider } = require("ethers/providers");

async function main() {

  //voting token

  const ganacheProvider = new JsonRpcProvider(process.env.LOCALHOST_URL);      
  const hardhatProvider = new JsonRpcProvider(process.env.HARDHAT_URL)
  const deployer_wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY,ganacheProvider);
  const first_user_wallet = new ethers.Wallet(process.env.FIRST_USER_PRIVATE_KEY,ganacheProvider);
  const second_user_wallet = new ethers.Wallet(process.env.SECOND_USER_PRIVATE_KEY,ganacheProvider);
  const third_user_wallet = new ethers.Wallet(process.env.THIRD_USER_PRIVATE_KEY,ganacheProvider);
  const fourth_user_wallet = new ethers.Wallet(process.env.FOURTH_USER_PRIVATE_KEY,ganacheProvider);

  // assign roles
  // console.log("Assigning campaigner role to governor contract")
  // wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  // donation = await ethers.getContractAt("Donation",process.env.DONATIONS_PROXY_ADDRESS);
  // donation.connect(deployer_wallet).addCampaigner(process.env.GOVERNOR_ADDRESS,{nonce:wallet_nonce++});
  // console.log("========================================================================"); 

  // console.log("Assigning minter role to campaigning contract contract")
  // wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  // donation = await ethers.getContractAt("PrizeToken",process.env.NFT_TOKEN_ADDRESS);
  // await donation.connect(deployer_wallet).addMinter(process.env.DONATIONS_PROXY_ADDRESS,{nonce:wallet_nonce++});
  // console.log("========================================================================"); 



  //assigning temporarily to deployer for testing
  // console.log("Assigning campaigner role to deployer wallet")
  // wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  // donation = await ethers.getContractAt("Donation",process.env.DONATIONS_PROXY_ADDRESS);
  // await donation.connect(deployer_wallet).addCampaigner(await deployer_wallet.getAddress(),{nonce:wallet_nonce++});
  // console.log("========================================================================"); 

  // console.log("Assigning minter role to campaigning contract contract")
  // wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  // donation = await ethers.getContractAt("PrizeToken",process.env.NFT_TOKEN_ADDRESS);
  // donation.connect(deployer_wallet).addMinter(await deployer_wallet.getAddress(),{nonce:wallet_nonce++});
  // console.log("========================================================================"); 

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
