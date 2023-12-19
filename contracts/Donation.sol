// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

interface IMinterContract {
    function safeMint(address to,string memory uri) external;
}
contract Donation is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    uint public count;
    bytes32 public constant CAMPAIGNER_ROLE = keccak256("CAMPAIGNER_ROLE");
    string oneEtherDonorNFTURI;
    
    
    enum Status{
        Active,
        Completed,
        Cancelled,
        LockedForPayout
    }

    struct Campaign {
        uint id;
        string name;
        string description;
        uint completiontime;
        Status status;
        address beneficiary;
        uint totalValue;

        //add IPFS supporting material
    }

    struct DonationItem{
        uint id;
        address donor;
        uint amount;
        uint campaignId;
        uint date;
    }

    Campaign[] public campaigns;
    DonationItem[] public donations;

    mapping(address=>uint) donorToDonations;
    address minting_address;
    IMinterContract minter_contract;
    mapping (address=>bool) printed;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address defaultAdmin, address upgrader)
        initializer public
    {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, upgrader);

        
        oneEtherDonorNFTURI = "https://ipfs.io/ipfs/QmX9K8SThNSktRgvDD7Ar3MBDohj5ASJsh1MM9BQgmhKCX?filename=nft.png";
    }

    function setupMinterAddress(address minting_contract) external onlyRole(DEFAULT_ADMIN_ROLE){
        minting_address = minting_contract;
    }
    function getMinterContractAddress()public returns (address){
        return minting_address;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    function addCampaigner(address campaigner) external onlyRole(DEFAULT_ADMIN_ROLE){
        _grantRole(CAMPAIGNER_ROLE,campaigner);
        console.log("ADDED CAMPAIGNER...................................");
    }

    //campain operations
    function setupCampaign(string calldata _name,string calldata _description,uint _target_date,address _beneficiary) external onlyRole(CAMPAIGNER_ROLE) returns(uint){
        require(address(_beneficiary) !=address(0));
        console.log("Adding campaign");
        //shoud be implemented with randomness using chaninlink instead, this code is vulnerable and can gerneate two campaigns with same id
        campaigns.push(Campaign(campaigns.length,_name,_description,_target_date,Status.Active,_beneficiary,0));
        return campaigns.length-1;
    }
    function getAllCampaigns(uint id)public view returns(Campaign memory){
        return campaigns[id];
    }

    function donate(uint _campaignId) public payable returns(bool){
        minter_contract =IMinterContract(minting_address);
        console.log("Received dontaion from.......................... ");
        console.log(msg.sender);
        require(campaigns[_campaignId].status==Status.Active); 
        donations.push(DonationItem(donations.length,msg.sender,msg.value,_campaignId,block.timestamp));
        Campaign storage campaign = campaigns[_campaignId];
        campaign.totalValue+=msg.value;
        donorToDonations[msg.sender]+=msg.value;
        console.log("Donor has donated.............................");
        console.log(Strings.toString(donorToDonations[msg.sender]));
        if(donorToDonations[msg.sender]>=1 ether && !printed[msg.sender]){
            console.log("Submitting a request for donor to print an nft.");
            minter_contract.safeMint(msg.sender, oneEtherDonorNFTURI);
            printed[msg.sender]=true;
            console.log("minted");            
        }
        return true;
    }

    function closeAndPayoutCampaign(uint _campaignId) public onlyRole(CAMPAIGNER_ROLE) returns (bool) {
        require(block.timestamp >= campaigns[_campaignId].completiontime);
        require(address(this).balance >= campaigns[_campaignId].totalValue);
        Campaign storage campaign = campaigns[_campaignId];
        campaign.status = Status.Completed;
        (bool result,) = address(campaigns[_campaignId].beneficiary).call{value:campaigns[_campaignId].totalValue}("");
        require(result);
        return result;
    }

    function closeAndPayoutCampaignAdmin(uint _campaignId) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        require(address(this).balance >= campaigns[_campaignId].totalValue);
        Campaign storage campaign = campaigns[_campaignId];
        campaign.status = Status.Completed;
        (bool result,) = address(campaigns[_campaignId].beneficiary).call{value:campaigns[_campaignId].totalValue}("");
        require(result);
        return result; 
    }

    //chainlink
    // function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {
    //     uint time = uint(bytes32(checkData[:32]));
        

    // }
    // function performUpkeep(bytes calldata performData) external override {
    //     // Logic to perform upkeep
    // }
    
}
