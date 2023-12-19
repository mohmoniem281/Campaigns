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

  const proposal_Id = "3406317239712180522962151842849617345537376208982305078157796399244119548864";
  const governor_contract = await ethers.getContractAt("DonationsGovernor",governor_address,ganacheProvider);
  
  // await governor_contract.connect(deployer_wallet).execute(proposal_Id);
  // console.log("Queued and Executed Proposal");


  const proposal_targets = [donations_proxy_address];
  const proposal_values = [0];
  const Donation =await ethers.getContractFactory("Donation"); 
  const full_call_data = [Donation.interface.encodeFunctionData("setupCampaign",["first campaign","testing campaign",Date.now(),await deployer_wallet.getAddress()])];
  const description_hash = await ethers.id("proposal to start a new campaign");
  const trans = await governor_contract.connect(deployer_wallet).execute(proposal_targets,proposal_values,full_call_data,description_hash);
  await trans.wait();

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
