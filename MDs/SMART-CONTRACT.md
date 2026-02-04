# TRVE Smart Contract

Kod smart contractu TruvalueAnchor dla sieci Polygon.

---

## Przegląd

**Nazwa:** TruvalueAnchor
**Sieć:** Polygon (Amoy testnet / Mainnet)
**Standard:** Solidity 0.8.20
**Zależności:** OpenZeppelin Contracts v5.x (Ownable)

---

## Funkcjonalność

| Funkcja | Opis | Dostęp |
|---------|------|--------|
| `anchorMerkleRoot` | Zapisuje Merkle root w blockchain | Tylko autoryzowani (whenNotPaused) |
| `verifyMerkleRoot` | Sprawdza czy root istnieje | Publiczny (view) |
| `getBatch` | Pobiera dane batcha | Publiczny (view) |
| `getBatchByRoot` | Pobiera batch po Merkle root | Publiczny (view) |
| `getStats` | Statystyki kontraktu | Publiczny (view) |
| `setAnchorAuthorization` | Zarządza uprawnieniami | Tylko owner |
| `removeBatch` | Usuwa błędny batch | Tylko owner |
| `pause` | **Zatrzymuje kontrakt (emergency)** | Tylko owner |
| `unpause` | **Wznawia kontrakt** | Tylko owner |

---

## Kod kontraktu

### TruvalueAnchor.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TruvalueAnchor
 * @dev Anchoring contract for Merkle roots - Phase 1 of TRVE blockchain integration.
 *
 * This contract stores Merkle roots representing batches of asset records.
 * It does NOT store any user data - only cryptographic proofs.
 *
 * Security considerations:
 * - Only authorized addresses can anchor Merkle roots
 * - Owner can remove batches in case of errors
 * - Each Merkle root can only be anchored once
 * - Zero address cannot be authorized
 * - Contract can be paused in emergency (owner only)
 *
 * Note on batchId:
 * - batchId = 0 is valid and treated specially (not stored in rootToBatchId)
 * - This allows for a "genesis batch" with ID 0
 * - Use batchId >= 1 for normal operations
 */
contract TruvalueAnchor is Ownable, Pausable {

    // ============ Events ============

    event MerkleRootAnchored(
        uint256 indexed batchId,
        bytes32 indexed merkleRoot,
        uint256 recordCount,
        uint256 timestamp
    );

    event BatchRemoved(
        uint256 indexed batchId,
        bytes32 merkleRoot,
        string reason
    );

    event AnchorAuthorizationChanged(
        address indexed anchor,
        bool authorized
    );

    event ContractPaused(address indexed by, string reason);
    event ContractUnpaused(address indexed by);

    // ============ Structs ============

    struct AnchoredBatch {
        bytes32 merkleRoot;
        uint256 recordCount;
        uint256 timestamp;
        bool exists;
    }

    // ============ State ============

    /// @notice Mapping from batch ID to batch data
    mapping(uint256 => AnchoredBatch) public batches;

    /// @notice Mapping from Merkle root to batch ID (for reverse lookup)
    /// @dev Note: batchId 0 is not stored here; use rootExists mapping instead
    mapping(bytes32 => uint256) public rootToBatchId;

    /// @notice Tracks if a Merkle root has been anchored (handles batchId 0 edge case)
    mapping(bytes32 => bool) public rootExists;

    /// @notice Total number of anchored batches
    uint256 public totalBatches;

    /// @notice Total number of records across all batches
    uint256 public totalRecords;

    /// @notice Addresses authorized to anchor Merkle roots
    mapping(address => bool) public authorizedAnchors;

    // ============ Constants ============

    /// @notice Maximum records per batch to prevent gas issues
    uint256 public constant MAX_RECORDS_PER_BATCH = 1_000_000;

    // ============ Constructor ============

    /// @dev OpenZeppelin v5.x requires passing initial owner to Ownable constructor
    constructor() Ownable(msg.sender) {
        // Owner is automatically authorized
        authorizedAnchors[msg.sender] = true;
    }

    // ============ Modifiers ============

    modifier onlyAuthorizedAnchor() {
        require(authorizedAnchors[msg.sender], "TruvalueAnchor: not authorized");
        _;
    }

    // ============ Admin Functions ============

    /**
     * @notice Set authorization for an address to anchor Merkle roots
     * @param anchor Address to authorize/deauthorize
     * @param authorized Whether the address should be authorized
     * @dev Zero address cannot be authorized to prevent accidental permissions
     */
    function setAnchorAuthorization(address anchor, bool authorized) external onlyOwner {
        require(anchor != address(0), "TruvalueAnchor: zero address");
        authorizedAnchors[anchor] = authorized;
        emit AnchorAuthorizationChanged(anchor, authorized);
    }

    /**
     * @notice Pause the contract (emergency stop)
     * @param reason Reason for pausing (for audit trail)
     * @dev Only owner can pause. Pausing prevents new anchoring operations.
     *      View functions remain available. Use when something goes wrong.
     */
    function pause(string calldata reason) external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender, reason);
    }

    /**
     * @notice Unpause the contract (resume operations)
     * @dev Only owner can unpause. Call after fixing the issue.
     */
    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    /**
     * @notice Remove a batch in case of errors (emergency function)
     * @param batchId The batch ID to remove
     * @param reason Reason for removal (for audit trail)
     * @dev Only owner can remove batches. Use sparingly - blockchain should be immutable.
     *      This function exists for error correction only (e.g., wrong data anchored).
     */
    function removeBatch(uint256 batchId, string calldata reason) external onlyOwner {
        require(batches[batchId].exists, "TruvalueAnchor: batch not found");

        AnchoredBatch memory batch = batches[batchId];

        // Update stats
        totalBatches--;
        totalRecords -= batch.recordCount;

        // Clear mappings
        delete rootToBatchId[batch.merkleRoot];
        delete rootExists[batch.merkleRoot];
        delete batches[batchId];

        emit BatchRemoved(batchId, batch.merkleRoot, reason);
    }

    // ============ Anchoring Functions ============

    /**
     * @notice Anchor a Merkle root representing a batch of records
     * @param batchId Unique identifier for this batch (use >= 1 for normal batches)
     * @param merkleRoot The Merkle root hash
     * @param recordCount Number of records in this batch (must be > 0)
     * @return timestamp The block timestamp when anchored
     * @dev batchId 0 is valid but treated specially (genesis batch)
     */
    function anchorMerkleRoot(
        uint256 batchId,
        bytes32 merkleRoot,
        uint256 recordCount
    ) external onlyAuthorizedAnchor whenNotPaused returns (uint256 timestamp) {
        // Validate inputs
        require(merkleRoot != bytes32(0), "TruvalueAnchor: invalid merkle root");
        require(recordCount > 0, "TruvalueAnchor: empty batch");
        require(recordCount <= MAX_RECORDS_PER_BATCH, "TruvalueAnchor: too many records");

        // Check for duplicates
        require(!batches[batchId].exists, "TruvalueAnchor: batch already anchored");
        require(!rootExists[merkleRoot], "TruvalueAnchor: root already anchored");

        timestamp = block.timestamp;

        // Store batch data
        batches[batchId] = AnchoredBatch({
            merkleRoot: merkleRoot,
            recordCount: recordCount,
            timestamp: timestamp,
            exists: true
        });

        // Store reverse lookup (skip for batchId 0 to avoid mapping collision)
        if (batchId != 0) {
            rootToBatchId[merkleRoot] = batchId;
        }

        // Mark root as existing (handles batchId 0 case)
        rootExists[merkleRoot] = true;

        // Update stats
        totalBatches++;
        totalRecords += recordCount;

        emit MerkleRootAnchored(batchId, merkleRoot, recordCount, timestamp);

        return timestamp;
    }

    // ============ View Functions ============

    /**
     * @notice Verify if a Merkle root exists in the contract
     * @param merkleRoot The Merkle root to verify
     * @return exists Whether the root exists
     * @return batchId The batch ID (0 if not found OR if it's the genesis batch)
     * @return timestamp When it was anchored (0 if not found)
     */
    function verifyMerkleRoot(bytes32 merkleRoot) external view returns (
        bool exists,
        uint256 batchId,
        uint256 timestamp
    ) {
        // Quick check using rootExists mapping
        if (!rootExists[merkleRoot]) {
            return (false, 0, 0);
        }

        // Try to find batchId from reverse lookup
        batchId = rootToBatchId[merkleRoot];
        if (batchId != 0 && batches[batchId].exists) {
            return (true, batchId, batches[batchId].timestamp);
        }

        // Handle edge case where batchId is 0 (genesis batch)
        if (batches[0].exists && batches[0].merkleRoot == merkleRoot) {
            return (true, 0, batches[0].timestamp);
        }

        return (false, 0, 0);
    }

    /**
     * @notice Get batch data by ID
     * @param batchId The batch ID to query
     */
    function getBatch(uint256 batchId) external view returns (
        bytes32 merkleRoot,
        uint256 recordCount,
        uint256 timestamp,
        bool exists
    ) {
        AnchoredBatch memory batch = batches[batchId];
        return (batch.merkleRoot, batch.recordCount, batch.timestamp, batch.exists);
    }

    /**
     * @notice Get batch data by Merkle root (reverse lookup)
     * @param merkleRoot The Merkle root to query
     * @return batchId The batch ID
     * @return recordCount Number of records in the batch
     * @return timestamp When it was anchored
     * @return exists Whether the batch exists
     */
    function getBatchByRoot(bytes32 merkleRoot) external view returns (
        uint256 batchId,
        uint256 recordCount,
        uint256 timestamp,
        bool exists
    ) {
        if (!rootExists[merkleRoot]) {
            return (0, 0, 0, false);
        }

        batchId = rootToBatchId[merkleRoot];

        // Handle batchId 0 case
        if (batchId == 0 && batches[0].merkleRoot == merkleRoot) {
            AnchoredBatch memory batch = batches[0];
            return (0, batch.recordCount, batch.timestamp, batch.exists);
        }

        if (batchId != 0 && batches[batchId].exists) {
            AnchoredBatch memory batch = batches[batchId];
            return (batchId, batch.recordCount, batch.timestamp, batch.exists);
        }

        return (0, 0, 0, false);
    }

    /**
     * @notice Get contract statistics
     */
    function getStats() external view returns (
        uint256 _totalBatches,
        uint256 _totalRecords
    ) {
        return (totalBatches, totalRecords);
    }
}
```

---

## Diagram architektury kontraktu

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TruvalueAnchor Contract                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                           STATE                                  │    │
│  ├─────────────────────────────────────────────────────────────────┤    │
│  │  batches: mapping(uint256 => AnchoredBatch)                      │    │
│  │  rootToBatchId: mapping(bytes32 => uint256)                      │    │
│  │  rootExists: mapping(bytes32 => bool)  ← NEW: handles batchId 0  │    │
│  │  authorizedAnchors: mapping(address => bool)                     │    │
│  │  totalBatches: uint256                                           │    │
│  │  totalRecords: uint256                                           │    │
│  │  MAX_RECORDS_PER_BATCH: constant = 1,000,000                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         FUNCTIONS                                │    │
│  ├─────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  WRITE (authorized only):                                        │    │
│  │  ├── anchorMerkleRoot(batchId, merkleRoot, recordCount)         │    │
│  │  │                                                               │    │
│  │  WRITE (owner only):                                             │    │
│  │  ├── setAnchorAuthorization(anchor, authorized)                 │    │
│  │  ├── removeBatch(batchId, reason) ← emergency removal           │    │
│  │  ├── pause(reason) ← EMERGENCY STOP                             │    │
│  │  └── unpause() ← resume operations                              │    │
│  │                                                                  │    │
│  │  READ (public):                                                  │    │
│  │  ├── verifyMerkleRoot(merkleRoot) → (exists, batchId, timestamp)│    │
│  │  ├── getBatch(batchId) → (merkleRoot, recordCount, timestamp)   │    │
│  │  ├── getBatchByRoot(merkleRoot) → (batchId, ...) ← NEW          │    │
│  │  └── getStats() → (totalBatches, totalRecords)                  │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Gas Costs

| Funkcja | Estimated Gas | Koszt (~50 gwei) |
|---------|---------------|------------------|
| `anchorMerkleRoot` | ~85,000 | ~$0.003 |
| `verifyMerkleRoot` | 0 (view) | FREE |
| `getBatch` | 0 (view) | FREE |
| `getBatchByRoot` | 0 (view) | FREE |
| `getStats` | 0 (view) | FREE |
| `setAnchorAuthorization` | ~45,000 | ~$0.002 |
| `removeBatch` | ~35,000 | ~$0.001 |
| `pause` | ~30,000 | ~$0.001 |
| `unpause` | ~30,000 | ~$0.001 |
| **Deploy** | ~950,000 | ~$0.038 |

---

## Events

### MerkleRootAnchored

Emitowany po każdym zaanchorowaniu:

```solidity
event MerkleRootAnchored(
    uint256 indexed batchId,    // ID batcha (indeksowane)
    bytes32 indexed merkleRoot, // Hash Merkle root (indeksowane)
    uint256 recordCount,        // Liczba rekordów w batchu
    uint256 timestamp           // Timestamp bloku
);
```

**Użycie w frontend:**
```javascript
contract.on("MerkleRootAnchored", (batchId, merkleRoot, recordCount, timestamp) => {
    console.log(`Batch ${batchId} anchored with ${recordCount} records`);
});
```

### BatchRemoved

Emitowany przy usuwaniu batcha (emergency function):

```solidity
event BatchRemoved(
    uint256 indexed batchId,    // ID usuniętego batcha
    bytes32 merkleRoot,         // Hash Merkle root
    string reason               // Powód usunięcia (audit trail)
);
```

### AnchorAuthorizationChanged

Emitowany przy zmianie uprawnień:

```solidity
event AnchorAuthorizationChanged(
    address indexed anchor,     // Adres którego dotyczy zmiana
    bool authorized             // Czy jest teraz autoryzowany
);
```

### ContractPaused

Emitowany przy zatrzymaniu kontraktu:

```solidity
event ContractPaused(
    address indexed by,         // Kto zatrzymał (owner)
    string reason               // Powód zatrzymania
);
```

### ContractUnpaused

Emitowany przy wznowieniu kontraktu:

```solidity
event ContractUnpaused(
    address indexed by          // Kto wznowił (owner)
);
```

---

## Bezpieczeństwo

### Access Control

| Rola | Uprawnienia |
|------|-------------|
| **Owner** | `setAnchorAuthorization`, `removeBatch` |
| **Authorized Anchors** | `anchorMerkleRoot` |
| **Publiczny** | Tylko view functions |

### Zabezpieczenia

| Zabezpieczenie | Opis |
|----------------|------|
| **Unikalność batchId** | Nie można nadpisać istniejącego batcha |
| **Unikalność merkleRoot** | Ten sam root nie może być zapisany dwukrotnie (mapping `rootExists`) |
| **Walidacja merkleRoot** | Nie może być pusty `bytes32(0)` |
| **Walidacja recordCount** | Musi być > 0 i <= MAX_RECORDS_PER_BATCH (1M) |
| **Zero address protection** | Nie można autoryzować `address(0)` |
| **onlyAuthorizedAnchor** | Tylko autoryzowane adresy mogą ankotwiczyć |
| **Emergency removal** | Owner może usunąć błędne batche z audit trail |
| **Pausable** | Owner może zatrzymać kontrakt w nagłym wypadku |
| **whenNotPaused** | Anchoring zablokowany gdy kontrakt jest wstrzymany |

### Obsługa batchId == 0

`batchId = 0` jest traktowany specjalnie:
- Jest poprawny (można go użyć dla "genesis batch")
- NIE jest zapisywany w `rootToBatchId` (unika konfliktu z domyślną wartością mappingu)
- Jest śledzony przez `rootExists` mapping
- Funkcje `verifyMerkleRoot` i `getBatchByRoot` obsługują ten przypadek

### Potencjalne ryzyka

| Ryzyko | Mitygacja |
|--------|-----------|
| Skompromitowany klucz autoryzowanego | Owner może odebrać uprawnienia |
| Błędne dane zakotwiczone | Owner może usunąć batch przez `removeBatch` |
| Overflow totalRecords | Solidity 0.8+ ma wbudowane zabezpieczenie |
| High gas dla wielu batchów | Limit MAX_RECORDS_PER_BATCH |

---

## Testowanie

### Hardhat test

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TruvalueAnchor", function () {
    let anchor;
    let owner;
    let backend;
    let unauthorized;

    beforeEach(async function () {
        [owner, backend, unauthorized] = await ethers.getSigners();
        const TruvalueAnchor = await ethers.getContractFactory("TruvalueAnchor");
        anchor = await TruvalueAnchor.deploy();
    });

    // ============ Basic Functionality ============

    it("Should anchor a Merkle root", async function () {
        const batchId = 1;
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
        const recordCount = 100;

        await anchor.anchorMerkleRoot(batchId, merkleRoot, recordCount);

        const batch = await anchor.getBatch(batchId);
        expect(batch.exists).to.be.true;
        expect(batch.merkleRoot).to.equal(merkleRoot);
        expect(batch.recordCount).to.equal(recordCount);
    });

    it("Should verify an anchored root", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
        await anchor.anchorMerkleRoot(1, merkleRoot, 50);

        const result = await anchor.verifyMerkleRoot(merkleRoot);
        expect(result.exists).to.be.true;
        expect(result.batchId).to.equal(1);
    });

    it("Should get batch by root", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
        await anchor.anchorMerkleRoot(1, merkleRoot, 50);

        const result = await anchor.getBatchByRoot(merkleRoot);
        expect(result.exists).to.be.true;
        expect(result.batchId).to.equal(1);
        expect(result.recordCount).to.equal(50);
    });

    // ============ batchId 0 Edge Case ============

    it("Should handle batchId 0 (genesis batch)", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("genesis"));
        await anchor.anchorMerkleRoot(0, merkleRoot, 1);

        const result = await anchor.verifyMerkleRoot(merkleRoot);
        expect(result.exists).to.be.true;
        expect(result.batchId).to.equal(0);

        const byRoot = await anchor.getBatchByRoot(merkleRoot);
        expect(byRoot.exists).to.be.true;
    });

    // ============ Security Tests ============

    it("Should reject unauthorized anchors", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));

        await expect(
            anchor.connect(unauthorized).anchorMerkleRoot(1, merkleRoot, 10)
        ).to.be.revertedWith("TruvalueAnchor: not authorized");
    });

    it("Should reject zero address authorization", async function () {
        await expect(
            anchor.setAnchorAuthorization(ethers.ZeroAddress, true)
        ).to.be.revertedWith("TruvalueAnchor: zero address");
    });

    it("Should reject empty batch (recordCount = 0)", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));

        await expect(
            anchor.anchorMerkleRoot(1, merkleRoot, 0)
        ).to.be.revertedWith("TruvalueAnchor: empty batch");
    });

    it("Should reject invalid merkle root", async function () {
        await expect(
            anchor.anchorMerkleRoot(1, ethers.ZeroHash, 10)
        ).to.be.revertedWith("TruvalueAnchor: invalid merkle root");
    });

    it("Should reject duplicate batch ID", async function () {
        const root1 = ethers.keccak256(ethers.toUtf8Bytes("test1"));
        const root2 = ethers.keccak256(ethers.toUtf8Bytes("test2"));

        await anchor.anchorMerkleRoot(1, root1, 10);

        await expect(
            anchor.anchorMerkleRoot(1, root2, 10)
        ).to.be.revertedWith("TruvalueAnchor: batch already anchored");
    });

    it("Should reject duplicate merkle root", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));

        await anchor.anchorMerkleRoot(1, merkleRoot, 10);

        await expect(
            anchor.anchorMerkleRoot(2, merkleRoot, 10)
        ).to.be.revertedWith("TruvalueAnchor: root already anchored");
    });

    // ============ Admin Functions ============

    it("Should allow owner to remove batch", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
        await anchor.anchorMerkleRoot(1, merkleRoot, 100);

        const statsBefore = await anchor.getStats();
        expect(statsBefore._totalBatches).to.equal(1);

        await anchor.removeBatch(1, "Test removal");

        const statsAfter = await anchor.getStats();
        expect(statsAfter._totalBatches).to.equal(0);

        const batch = await anchor.getBatch(1);
        expect(batch.exists).to.be.false;

        // Should allow re-anchoring same root after removal
        await anchor.anchorMerkleRoot(2, merkleRoot, 50);
        const result = await anchor.verifyMerkleRoot(merkleRoot);
        expect(result.exists).to.be.true;
    });

    it("Should reject non-owner batch removal", async function () {
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
        await anchor.anchorMerkleRoot(1, merkleRoot, 100);

        await expect(
            anchor.connect(unauthorized).removeBatch(1, "Unauthorized")
        ).to.be.revertedWithCustomError(anchor, "OwnableUnauthorizedAccount");
    });

    // ============ Pausable ============

    it("Should pause and unpause contract", async function () {
        await anchor.pause("Testing pause");
        expect(await anchor.paused()).to.be.true;

        await anchor.unpause();
        expect(await anchor.paused()).to.be.false;
    });

    it("Should reject anchoring when paused", async function () {
        await anchor.pause("Emergency stop");

        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
        await expect(
            anchor.anchorMerkleRoot(1, merkleRoot, 10)
        ).to.be.revertedWithCustomError(anchor, "EnforcedPause");
    });

    it("Should allow anchoring after unpause", async function () {
        await anchor.pause("Testing");
        await anchor.unpause();

        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
        await anchor.anchorMerkleRoot(1, merkleRoot, 10);

        const result = await anchor.verifyMerkleRoot(merkleRoot);
        expect(result.exists).to.be.true;
    });

    it("Should reject non-owner pause", async function () {
        await expect(
            anchor.connect(unauthorized).pause("Hack attempt")
        ).to.be.revertedWithCustomError(anchor, "OwnableUnauthorizedAccount");
    });

    // ============ Authorization ============

    it("Should allow authorized backend to anchor", async function () {
        await anchor.setAnchorAuthorization(backend.address, true);

        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("backend"));
        await anchor.connect(backend).anchorMerkleRoot(1, merkleRoot, 25);

        const result = await anchor.verifyMerkleRoot(merkleRoot);
        expect(result.exists).to.be.true;
    });
});
```

---

## Powiązane dokumenty

- [Blockchain Architecture](./BLOCKCHAIN-ARCHITECTURE.md) - Jak działa system
- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - Jak wdrożyć kontrakt
- [Backend Integration](./BACKEND-INTEGRATION.md) - Integracja z backendem

---

**Ostatnia aktualizacja:** 2025-01-31

---

## Changelog

- **2025-01-31**: Dodano `Pausable` - funkcje `pause()` i `unpause()` dla emergency stop
