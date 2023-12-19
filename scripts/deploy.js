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

  //deploy    
  console.log("Deploying Token...")
  deployer_wallet_nonce = 0;
  const VotingToken = await ethers.getContractFactory("DonationVotingToken",deployer_wallet);
  const votingToken = await VotingToken.deploy(deployer_wallet.getAddress());
  console.log("Deployed voting token to.. "+await votingToken.getAddress());
  console.log("Deployer wallet has.. "+await votingToken.balanceOf(deployer_wallet.getAddress()));
  console.log("========================================================================");

  //distribute tokens
  console.log("Distributing tokens... ");
  let wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  let txreponse = await votingToken.connect(deployer_wallet).transfer(first_user_wallet.getAddress(),ethers.parseUnits('550','ether'),{nonce:wallet_nonce++});
  await txreponse.wait();

  wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  txresponse = await votingToken.transfer(second_user_wallet.getAddress(),ethers.parseUnits('50','ether'),{nonce:wallet_nonce++});
  await txreponse.wait();

  console.log("First user wallet has... "+await votingToken.balanceOf(first_user_wallet.getAddress()));
  console.log("Second user wallet has... "+await votingToken.balanceOf(second_user_wallet.getAddress()));
  console.log("Deployer user wallet has... "+await votingToken.balanceOf(deployer_wallet.getAddress()));
  console.log("========================================================================");

  //governor
  console.log("Deploying governor... ");
  const Governor = await ethers.getContractFactory("DonationsGovernor",deployer_wallet);
  const governor = await Governor.deploy(await votingToken.getAddress());
  console.log("Deployed governor to.. "+await governor.getAddress());
  console.log("========================================================================");

  //deploying voter proxy
  console.log("Deploying voting proxy.")
  wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  const Donation = await ethers.getContractFactory("Donation",deployer_wallet);
  const donation = await upgrades.deployProxy(Donation,[await deployer_wallet.getAddress(),await deployer_wallet.getAddress()],{nonce:wallet_nonce++});
  console.log("Voting proxy deployed to ",await donation.getAddress());
  console.log("========================================================================");

  //nft
  console.log("Deploying nft token.")
  wallet_nonce = await ganacheProvider.getTransactionCount(deployer_wallet.getAddress());
  const nft_token = await ethers.getContractFactory("PrizeToken",deployer_wallet);
  const nft = await nft_token.deploy(await deployer_wallet.getAddress(),await donation.getAddress(),{none:wallet_nonce++});
  console.log("NFT token deployed to ",await nft.getAddress());
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
