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


  const ganacheProvider = new JsonRpcProvider(process.env.LOCALHOST_URL);      
  const hardhatProvider = new JsonRpcProvider(process.env.HARDHAT_URL)
  const deployer_wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY,ganacheProvider);
  const first_user_wallet = new ethers.Wallet(process.env.FIRST_USER_PRIVATE_KEY,ganacheProvider);
  const second_user_wallet = new ethers.Wallet(process.env.SECOND_USER_PRIVATE_KEY,ganacheProvider);
  const third_user_wallet = new ethers.Wallet(process.env.THIRD_USER_PRIVATE_KEY,ganacheProvider);
  const fourth_user_wallet = new ethers.Wallet(process.env.FOURTH_USER_PRIVATE_KEY,ganacheProvider);


  const governor_address =  process.env.GOVERNOR_ADDRESS;
  const donations_proxy_address =  process.env.DONATIONS_PROXY_ADDRESS;
  const voting_token_address =  process.env.VOTING_TOKEN_ADDRESS;

  //setup the minter contract for the donations contract
  console.log("Setting the minter contract for the donations contract.")
  wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  const Donation = await ethers.getContractFactory("Donation");
  const donation_contract = await Donation.attach(donations_proxy_address);
  const tx = await donation_contract.connect(deployer_wallet).setupMinterAddress(process.env.NFT_TOKEN_ADDRESS,{nonce:wallet_nonce++});
  console.log("========================================================================");






  
  
  // const Donationv2 = await ethers.getContractFactory("Donationv2");
  // const donationv2 = await upgrades.upgradeProxy(await donation.getAddress(),Donationv2,{signer:wallet});
  // console.log("proxy now deployed to ",await donationv2.getAddress());
  // donationv2.test();
  // console.log("value from second deployment is "+await donationv2.count())

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
