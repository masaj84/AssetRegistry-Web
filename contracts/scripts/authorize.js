const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("=".repeat(60));
    console.log("TRVE TruvalueAnchor - Authorize Backend");
    console.log("=".repeat(60));
    console.log(`Network: ${network.name}`);
    console.log("");

    // Get backend address from env
    const backendAddress = process.env.BACKEND_ANCHOR_ADDRESS;
    if (!backendAddress) {
        console.error("❌ Error: BACKEND_ANCHOR_ADDRESS not set in environment");
        console.error("   Usage: BACKEND_ANCHOR_ADDRESS=0x... npm run authorize");
        process.exit(1);
    }

    // Validate address
    if (!ethers.isAddress(backendAddress)) {
        console.error(`❌ Error: Invalid address: ${backendAddress}`);
        process.exit(1);
    }

    // Get latest deployment
    const deploymentsDir = path.join(__dirname, "../deployments");
    const files = fs.readdirSync(deploymentsDir)
        .filter(f => f.startsWith(network.name) && f.endsWith(".json"))
        .sort()
        .reverse();

    if (files.length === 0) {
        console.error(`❌ Error: No deployment found for network ${network.name}`);
        console.error("   Run deploy script first: npm run deploy:testnet");
        process.exit(1);
    }

    const latestDeployment = JSON.parse(
        fs.readFileSync(path.join(deploymentsDir, files[0]), "utf8")
    );
    const contractAddress = latestDeployment.contractAddress;

    console.log(`Contract: ${contractAddress}`);
    console.log(`Backend:  ${backendAddress}`);
    console.log("");

    // Connect to contract
    const [owner] = await ethers.getSigners();
    console.log(`Owner:    ${owner.address}`);
    console.log("");

    const TruvalueAnchor = await ethers.getContractFactory("TruvalueAnchor");
    const anchor = TruvalueAnchor.attach(contractAddress);

    // Check current authorization
    const alreadyAuthorized = await anchor.authorizedAnchors(backendAddress);
    if (alreadyAuthorized) {
        console.log("ℹ️  Address is already authorized");
        return;
    }

    // Authorize
    console.log("Authorizing backend address...");
    const tx = await anchor.setAnchorAuthorization(backendAddress, true);
    console.log(`Transaction: ${tx.hash}`);
    
    await tx.wait();
    console.log("✅ Transaction confirmed!");
    console.log("");

    // Verify
    const isAuthorized = await anchor.authorizedAnchors(backendAddress);
    console.log(`Authorization status: ${isAuthorized ? "✅ AUTHORIZED" : "❌ NOT AUTHORIZED"}`);
    console.log("");
    console.log("=".repeat(60));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
