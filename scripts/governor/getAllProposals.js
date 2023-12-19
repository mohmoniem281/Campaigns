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

  const governor_contract = await ethers.getContractAt("DonationsGovernor",governor_address,ganacheProvider);
  const filters = await governor_contract.filters.ProposalCreated();
  const logs = await governor_contract.queryFilter(filters, 0, "latest");
//   const events = logs.map((log) => governor_contract.interface.parseLog(log));
  const proposals = logs.map(log => {
  const event = governor_contract.interface.parseLog(log);
    return [event.args.proposalId,event.args.description];
  });

  for (const proposal of proposals ){
    const state = await governor_contract.state(proposal[0]);
    console.log('ID: '+proposal[0]+" ,Description: "+proposal[1]+" ,State: "+state);
  }


//   const ProposalState = {
//     0: "Pending",
//     1: "Active",
//     2: "Canceled",
//     3: "Defeated",
//     4: "Succeeded",
//     5: "Queued",
//     6: "Expired",
//     7: "Executed"
// };
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
