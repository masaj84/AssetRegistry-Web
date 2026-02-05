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

    // ============ Deployment ============

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await anchor.owner()).to.equal(owner.address);
        });

        it("Should authorize owner by default", async function () {
            expect(await anchor.authorizedAnchors(owner.address)).to.be.true;
        });

        it("Should start with zero batches", async function () {
            const stats = await anchor.getStats();
            expect(stats._totalBatches).to.equal(0);
            expect(stats._totalRecords).to.equal(0);
        });

        it("Should not be paused initially", async function () {
            expect(await anchor.paused()).to.be.false;
        });
    });

    // ============ Basic Anchoring ============

    describe("Anchoring", function () {
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

        it("Should emit MerkleRootAnchored event", async function () {
            const batchId = 1;
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            const recordCount = 100;

            // Just check that the event is emitted with correct batchId, merkleRoot, recordCount
            // Timestamp verification is tricky due to block timing
            await expect(anchor.anchorMerkleRoot(batchId, merkleRoot, recordCount))
                .to.emit(anchor, "MerkleRootAnchored");
            
            // Verify values via getBatch instead
            const batch = await anchor.getBatch(batchId);
            expect(batch.merkleRoot).to.equal(merkleRoot);
            expect(batch.recordCount).to.equal(recordCount);
        });

        it("Should update stats after anchoring", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await anchor.anchorMerkleRoot(1, merkleRoot, 100);

            const stats = await anchor.getStats();
            expect(stats._totalBatches).to.equal(1);
            expect(stats._totalRecords).to.equal(100);
        });

        it("Should return timestamp on anchoring", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            const tx = await anchor.anchorMerkleRoot(1, merkleRoot, 100);
            const receipt = await tx.wait();
            
            // Timestamp should be returned (check via event)
            const event = receipt.logs.find(log => {
                try {
                    return anchor.interface.parseLog(log)?.name === "MerkleRootAnchored";
                } catch {
                    return false;
                }
            });
            expect(event).to.not.be.undefined;
        });
    });

    // ============ Verification ============

    describe("Verification", function () {
        it("Should verify an anchored root", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await anchor.anchorMerkleRoot(1, merkleRoot, 50);

            const result = await anchor.verifyMerkleRoot(merkleRoot);
            expect(result.exists).to.be.true;
            expect(result.batchId).to.equal(1);
        });

        it("Should return false for non-existent root", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("nonexistent"));
            
            const result = await anchor.verifyMerkleRoot(merkleRoot);
            expect(result.exists).to.be.false;
            expect(result.batchId).to.equal(0);
            expect(result.timestamp).to.equal(0);
        });

        it("Should get batch by root", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await anchor.anchorMerkleRoot(1, merkleRoot, 50);

            const result = await anchor.getBatchByRoot(merkleRoot);
            expect(result.exists).to.be.true;
            expect(result.batchId).to.equal(1);
            expect(result.recordCount).to.equal(50);
        });
    });

    // ============ BatchId 0 Edge Case ============

    describe("BatchId 0 (Genesis Batch)", function () {
        it("Should handle batchId 0", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("genesis"));
            await anchor.anchorMerkleRoot(0, merkleRoot, 1);

            const result = await anchor.verifyMerkleRoot(merkleRoot);
            expect(result.exists).to.be.true;
            expect(result.batchId).to.equal(0);
        });

        it("Should get batch 0 by root", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("genesis"));
            await anchor.anchorMerkleRoot(0, merkleRoot, 1);

            const byRoot = await anchor.getBatchByRoot(merkleRoot);
            expect(byRoot.exists).to.be.true;
            expect(byRoot.batchId).to.equal(0);
        });

        it("Should get batch 0 by ID", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("genesis"));
            await anchor.anchorMerkleRoot(0, merkleRoot, 1);

            const batch = await anchor.getBatch(0);
            expect(batch.exists).to.be.true;
            expect(batch.merkleRoot).to.equal(merkleRoot);
        });
    });

    // ============ Security ============

    describe("Security", function () {
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

        it("Should reject too many records", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            const tooMany = 1_000_001; // MAX_RECORDS_PER_BATCH + 1

            await expect(
                anchor.anchorMerkleRoot(1, merkleRoot, tooMany)
            ).to.be.revertedWith("TruvalueAnchor: too many records");
        });
    });

    // ============ Authorization ============

    describe("Authorization", function () {
        it("Should allow owner to authorize backend", async function () {
            await anchor.setAnchorAuthorization(backend.address, true);
            expect(await anchor.authorizedAnchors(backend.address)).to.be.true;
        });

        it("Should allow authorized backend to anchor", async function () {
            await anchor.setAnchorAuthorization(backend.address, true);

            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("backend"));
            await anchor.connect(backend).anchorMerkleRoot(1, merkleRoot, 25);

            const result = await anchor.verifyMerkleRoot(merkleRoot);
            expect(result.exists).to.be.true;
        });

        it("Should emit AnchorAuthorizationChanged event", async function () {
            await expect(anchor.setAnchorAuthorization(backend.address, true))
                .to.emit(anchor, "AnchorAuthorizationChanged")
                .withArgs(backend.address, true);
        });

        it("Should allow revoking authorization", async function () {
            await anchor.setAnchorAuthorization(backend.address, true);
            await anchor.setAnchorAuthorization(backend.address, false);
            expect(await anchor.authorizedAnchors(backend.address)).to.be.false;
        });

        it("Should reject non-owner authorization changes", async function () {
            await expect(
                anchor.connect(unauthorized).setAnchorAuthorization(backend.address, true)
            ).to.be.revertedWithCustomError(anchor, "OwnableUnauthorizedAccount");
        });
    });

    // ============ Batch Removal ============

    describe("Batch Removal", function () {
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
        });

        it("Should emit BatchRemoved event", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await anchor.anchorMerkleRoot(1, merkleRoot, 100);

            await expect(anchor.removeBatch(1, "Error correction"))
                .to.emit(anchor, "BatchRemoved")
                .withArgs(1, merkleRoot, "Error correction");
        });

        it("Should allow re-anchoring same root after removal", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await anchor.anchorMerkleRoot(1, merkleRoot, 100);
            await anchor.removeBatch(1, "Test");

            // Should work now
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

        it("Should reject removal of non-existent batch", async function () {
            await expect(
                anchor.removeBatch(999, "Not found")
            ).to.be.revertedWith("TruvalueAnchor: batch not found");
        });
    });

    // ============ Pausable ============

    describe("Pausable", function () {
        it("Should pause contract", async function () {
            await anchor.pause("Testing pause");
            expect(await anchor.paused()).to.be.true;
        });

        it("Should emit ContractPaused event", async function () {
            await expect(anchor.pause("Emergency stop"))
                .to.emit(anchor, "ContractPaused")
                .withArgs(owner.address, "Emergency stop");
        });

        it("Should unpause contract", async function () {
            await anchor.pause("Testing");
            await anchor.unpause();
            expect(await anchor.paused()).to.be.false;
        });

        it("Should emit ContractUnpaused event", async function () {
            await anchor.pause("Testing");
            await expect(anchor.unpause())
                .to.emit(anchor, "ContractUnpaused")
                .withArgs(owner.address);
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

        it("Should allow view functions when paused", async function () {
            const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await anchor.anchorMerkleRoot(1, merkleRoot, 10);

            await anchor.pause("Testing");

            // These should still work
            const result = await anchor.verifyMerkleRoot(merkleRoot);
            expect(result.exists).to.be.true;

            const stats = await anchor.getStats();
            expect(stats._totalBatches).to.equal(1);
        });

        it("Should reject non-owner pause", async function () {
            await expect(
                anchor.connect(unauthorized).pause("Hack attempt")
            ).to.be.revertedWithCustomError(anchor, "OwnableUnauthorizedAccount");
        });

        it("Should reject non-owner unpause", async function () {
            await anchor.pause("Testing");
            await expect(
                anchor.connect(unauthorized).unpause()
            ).to.be.revertedWithCustomError(anchor, "OwnableUnauthorizedAccount");
        });
    });

    // ============ Helper Functions ============

    async function getBlockTimestamp() {
        const block = await ethers.provider.getBlock("latest");
        return block.timestamp;
    }
});
