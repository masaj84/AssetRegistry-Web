# TRVE Smart Contracts

Smart contracts for TRVE (Truvalue) - Blockchain anchoring for asset registry.

## Overview

**TruvalueAnchor** - A Merkle root anchoring contract that provides cryptographic proof of data integrity. Part of Phase 1 (Merkle Anchoring) of the TRVE blockchain integration.

### Features

- ✅ Merkle root anchoring with batch support
- ✅ Authorization system for backend services
- ✅ Emergency pause/unpause functionality
- ✅ Batch removal for error correction
- ✅ Full verification and lookup capabilities
- ✅ Gas-optimized for Polygon network

## Setup

```bash
cd contracts
npm install
```

Copy environment file and configure:

```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

## Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to testnet (Polygon Amoy)
npm run deploy:testnet

# Deploy to mainnet (Polygon)
npm run deploy:mainnet

# Authorize backend address
BACKEND_ANCHOR_ADDRESS=0x... npm run authorize

# Verify on PolygonScan
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

## Contract Functions

### Write Functions (Authorized)

| Function | Description | Access |
|----------|-------------|--------|
| `anchorMerkleRoot(batchId, merkleRoot, recordCount)` | Anchor a Merkle root | Authorized + Not Paused |
| `setAnchorAuthorization(address, bool)` | Manage anchor permissions | Owner only |
| `removeBatch(batchId, reason)` | Remove batch (emergency) | Owner only |
| `pause(reason)` | Pause contract | Owner only |
| `unpause()` | Resume contract | Owner only |

### View Functions (Public)

| Function | Description |
|----------|-------------|
| `verifyMerkleRoot(merkleRoot)` | Check if root exists, get batch info |
| `getBatch(batchId)` | Get batch data by ID |
| `getBatchByRoot(merkleRoot)` | Get batch data by root (reverse lookup) |
| `getStats()` | Get total batches and records |

## Networks

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Polygon Amoy (Testnet) | 80002 | https://rpc-amoy.polygon.technology | https://amoy.polygonscan.com |
| Polygon Mainnet | 137 | https://polygon-rpc.com | https://polygonscan.com |

### Testnet Faucet

Get test MATIC for Amoy: https://faucet.polygon.technology

## Gas Costs

| Operation | Estimated Gas | Cost (~50 gwei) |
|-----------|---------------|-----------------|
| Deploy | ~950,000 | ~$0.038 |
| anchorMerkleRoot | ~85,000 | ~$0.003 |
| setAnchorAuthorization | ~45,000 | ~$0.002 |
| removeBatch | ~35,000 | ~$0.001 |
| pause/unpause | ~30,000 | ~$0.001 |

## Security

- Only authorized addresses can anchor (multi-sig ready)
- Owner can pause in emergencies
- Each Merkle root can only be anchored once
- Batch IDs must be unique
- Zero address cannot be authorized

## Documentation

- [Architecture](../MDs/BLOCKCHAIN-ARCHITECTURE.md)
- [Smart Contract Details](../MDs/SMART-CONTRACT.md)
- [Deployment Guide](../MDs/DEPLOYMENT-GUIDE.md)
- [Error Handling](../MDs/ERROR-HANDLING.md)

## License

MIT
