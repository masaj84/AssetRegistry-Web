const { ethers, network } = require("hardhat");

async function main() {
    console.log("=".repeat(60));
    console.log("TRVE TruvalueAnchor Deployment");
    console.log("=".repeat(60));
    console.log(`Network: ${network.name}`);
    console.log(`Chain ID: ${network.config.chainId}`);
    console.log("");

    const [deployer] = await ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Balance: ${ethers.formatEther(balance)} MATIC`);
    console.log("");

    if (balance < ethers.parseEther("0.01")) {
        console.error("⚠️  Warning: Low balance. Deployment may fail.");
        console.error("   Get testnet MATIC from: https://faucet.polygon.technology");
    }

    // Deploy contract
    console.log("Deploying TruvalueAnchor...");
    const TruvalueAnchor = await ethers.getContractFactory("TruvalueAnchor");
    const anchor = await TruvalueAnchor.deploy();
    await anchor.waitForDeployment();

    const contractAddress = await anchor.getAddress();
    console.log("");
    console.log("✅ Contract deployed!");
    console.log(`   Address: ${contractAddress}`);
    console.log("");

    // Verify owner
    const owner = await anchor.owner();
    console.log(`   Owner: ${owner}`);

    // Check if deployer is authorized
    const isAuthorized = await anchor.authorizedAnchors(deployer.address);
    console.log(`   Deployer authorized: ${isAuthorized}`);

    // Get stats
    const stats = await anchor.getStats();
    console.log(`   Total batches: ${stats._totalBatches}`);
    console.log(`   Total records: ${stats._totalRecords}`);

    console.log("");
    console.log("=".repeat(60));
    console.log("NEXT STEPS:");
    console.log("=".repeat(60));
    console.log("");
    console.log("1. Verify contract on PolygonScan:");
    console.log(`   npx hardhat verify --network ${network.name} ${contractAddress}`);
    console.log("");
    console.log("2. Authorize backend address:");
    console.log(`   BACKEND_ANCHOR_ADDRESS=0x... npm run authorize`);
    console.log("");
    console.log("3. Update backend configuration:");
    console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`   ANCHOR_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("");
    console.log("=".repeat(60));

    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: network.config.chainId,
        contractAddress: contractAddress,
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber()
    };

    const fs = require("fs");
    const path = require("path");
    const deploymentsDir = path.join(__dirname, "../deployments");
    
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    const filename = `${network.name}-${Date.now()}.json`;
    fs.writeFileSync(
        path.join(deploymentsDir, filename),
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`Deployment info saved to: deployments/${filename}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
