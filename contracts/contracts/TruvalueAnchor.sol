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
