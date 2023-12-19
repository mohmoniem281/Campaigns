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


  const governor_address =  process.env.GOVERNOR_ADDRESS;
  const donations_proxy_address =  process.env.DONATIONS_PROXY_ADDRESS;
  const voting_token_address =  process.env.VOTING_TOKEN_ADDRESS;

  const proposal_Id = "101671677846782410251650836490937684459407855662228907707403738574130006345093";

  const governor_contract = await ethers.getContractAt("DonationsGovernor",governor_address,ganacheProvider);
  await governor_contract.connect(deployer_wallet).castVote(proposal_Id,1);
  console.log("Deployer casted vote");
  await governor_contract.connect(first_user_wallet).castVote(proposal_Id,1);
  console.log("First casted vote");
  await governor_contract.connect(second_user_wallet).castVote(proposal_Id,1);
  console.log("Second casted vote");
  

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
