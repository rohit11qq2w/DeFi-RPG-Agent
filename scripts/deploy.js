const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying DeFi RPG contracts to Base...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy DeFiRPGXP contract
  console.log("Deploying DeFiRPGXP...");
  const DeFiRPGXP = await ethers.getContractFactory("DeFiRPGXP");
  const xpContract = await DeFiRPGXP.deploy();
  await xpContract.deployed();
  console.log("DeFiRPGXP deployed to:", xpContract.address);

  // Deploy DeFiRPGNFT contract
  console.log("Deploying DeFiRPGNFT...");
  const DeFiRPGNFT = await ethers.getContractFactory("DeFiRPGNFT");
  const nftContract = await DeFiRPGNFT.deploy();
  await nftContract.deployed();
  console.log("DeFiRPGNFT deployed to:", nftContract.address);

  // Deploy DeFiRPGQuests contract
  console.log("Deploying DeFiRPGQuests...");
  const DeFiRPGQuests = await ethers.getContractFactory("DeFiRPGQuests");
  const questsContract = await DeFiRPGQuests.deploy(
    xpContract.address,
    nftContract.address
  );
  await questsContract.deployed();
  console.log("DeFiRPGQuests deployed to:", questsContract.address);

  // Set up permissions
  console.log("Setting up contract permissions...");
  
  // Allow quests contract to award XP
  await xpContract.transferOwnership(questsContract.address);
  console.log("XP contract ownership transferred to quests contract");

  // Create initial quests
  console.log("Creating initial quests...");
  
  // Weekly swap challenge
  await questsContract.createQuest(
    "Weekly Swap Challenge",
    "Complete 5 token swaps this week",
    1, // group quest
    7 * 24 * 60 * 60, // 7 days
    500, // XP reward
    "https://api.defirpg.com/nft/swap-master.json",
    0, // swap action
    5 // required amount
  );

  // Liquidity provider quest
  await questsContract.createQuest(
    "Liquidity Provider",
    "Provide $1000 in liquidity",
    0, // individual quest
    14 * 24 * 60 * 60, // 14 days
    750, // XP reward
    "https://api.defirpg.com/nft/liquidity-master.json",
    1, // liquidity action
    1000 // required amount
  );

  console.log("Initial quests created!");

  // Output deployment summary
  console.log("\n=== Deployment Summary ===");
  console.log("DeFiRPGXP:", xpContract.address);
  console.log("DeFiRPGNFT:", nftContract.address);
  console.log("DeFiRPGQuests:", questsContract.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Deployer:", deployer.address);
  
  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      DeFiRPGXP: xpContract.address,
      DeFiRPGNFT: nftContract.address,
      DeFiRPGQuests: questsContract.address
    },
    timestamp: new Date().toISOString()
  };

  console.log("\nDeployment completed successfully!");
  console.log("Save this deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });