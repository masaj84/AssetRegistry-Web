# TRVE Error Handling & Recovery Strategy

Kompletna strategia obsługi błędów dla systemu blockchain TRVE.

---

## Spis treści

1. [Analiza obecnego stanu](#analiza-obecnego-stanu)
2. [Batch State Machine](#batch-state-machine)
3. [Retry Strategy](#retry-strategy)
4. [Scenariusze błędów i recovery](#scenariusze-błędów-i-recovery)
5. [Reconciliation Process](#reconciliation-process)
6. [Alert Thresholds](#alert-thresholds)
7. [Database Schema](#database-schema)
8. [Implementacja w kodzie](#implementacja-w-kodzie)

---

## Analiza obecnego stanu

### Co już mamy

| Warstwa | Błąd | Mechanizm |
|---------|------|-----------|
| Smart Contract | Invalid data | `require()` checks |
| Smart Contract | Duplikaty | `rootExists` mapping |
| Smart Contract | Nieautoryzowany | `onlyAuthorizedAnchor` modifier |
| Smart Contract | Błędny batch | `removeBatch()` (owner only) |
| Dokumentacja | RPC, gas, nonce | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |

### Luki do zaadresowania

| Problem | Ryzyko | Priorytet |
|---------|--------|-----------|
| Brak retry logic dla failed TX | Batch zostaje w "pending" na zawsze | KRYTYCZNY |
| DB fail po TX success | Dane na blockchain, brak proof w DB | KRYTYCZNY |
| Partial batch failure | Niespójność danych | WYSOKI |
| Timeout handling | Zawieszony job | ŚREDNI |
| Brak reconciliation | Drift między DB a blockchain | ŚREDNI |

---

## Batch State Machine

### Diagram stanów

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BATCH STATE MACHINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌────────────┐                                                           │
│    │ COLLECTING │ ─── Zbieranie assetów do batcha                          │
│    └─────┬──────┘                                                           │
│          │                                                                   │
│          │ (batch ready / timeout)                                          │
│          ▼                                                                   │
│    ┌────────────┐                                                           │
│    │  BUILDING  │ ─── Budowanie Merkle tree                                 │
│    └─────┬──────┘                                                           │
│          │                                                                   │
│          ├─── (success) ────────────────────┐                               │
│          │                                   ▼                               │
│          │                            ┌────────────┐                        │
│          │                            │  SENDING   │ ─── Wysyłanie TX       │
│          │                            └─────┬──────┘                        │
│          │                                   │                               │
│          │                    ┌──────────────┴──────────────┐               │
│          │                    │                              │               │
│          │               (success)                      (tx fail)           │
│          │                    │                              │               │
│          │                    ▼                              │               │
│          │             ┌────────────┐                        │               │
│          │             │ CONFIRMING │ ─── Oczekiwanie        │               │
│          │             └─────┬──────┘     na confirm         │               │
│          │                   │                               │               │
│          │        ┌──────────┴──────────┐                    │               │
│          │        │                      │                   │               │
│          │   (confirmed)            (timeout)                │               │
│          │        │                      │                   │               │
│          │        ▼                      │                   │               │
│          │   ┌─────────┐                 │                   │               │
│          │   │  DONE   │ ← Success!      │                   │               │
│          │   └─────────┘                 │                   │               │
│          │                               │                   │               │
│          │                               │                   │               │
│          │ (db error)                    │                   │               │
│          ▼                               ▼                   ▼               │
│    ┌────────────────────────────────────────────────────────────────┐       │
│    │                           FAILED                                │       │
│    └─────────────────────────────┬──────────────────────────────────┘       │
│                                   │                                          │
│                                   ▼                                          │
│                         ┌─────────────────┐                                 │
│                         │  RETRY (max 4)  │                                 │
│                         └────────┬────────┘                                 │
│                                  │                                           │
│                       ┌──────────┴──────────┐                               │
│                       │                      │                               │
│                  (success)             (all retries failed)                 │
│                       │                      │                               │
│                       ▼                      ▼                               │
│                   ┌──────┐           ┌───────────┐                          │
│                   │ DONE │           │ ABANDONED │ ─── Alert + manual       │
│                   └──────┘           └───────────┘     intervention         │
│                                                                              │
│                                                                              │
│   SPECJALNY STATUS:                                                         │
│   ┌──────────────┐                                                          │
│   │   ORPHANED   │ ─── TX success, DB fail (KRYTYCZNY)                     │
│   └──────────────┘                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Definicje stanów

| Status | Opis | Akcja |
|--------|------|-------|
| `COLLECTING` | Zbieranie assetów do batcha | Automatyczne, czeka na trigger |
| `BUILDING` | Budowanie Merkle tree z zebranych assetów | Walidacja + obliczenia |
| `SENDING` | Wysyłanie TX na blockchain | Nethereum call |
| `CONFIRMING` | Oczekiwanie na potwierdzenie TX | Polling / event listener |
| `DONE` | Sukces - batch zakotwiczony | Koniec procesu |
| `FAILED` | Błąd - wymaga retry | Automatyczny retry |
| `ABANDONED` | Po 4 failed retries | Manual intervention |
| `ORPHANED` | TX success, DB fail | ALERT + recovery |

---

## Retry Strategy

### Exponential Backoff

```
┌─────────────────────────────────────────────────────────────────┐
│                    RETRY SCHEDULE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Attempt 1: Natychmiast (0s delay)                              │
│       │                                                          │
│       ▼ fail                                                     │
│  Attempt 2: Po 1 minucie                                        │
│       │                                                          │
│       ▼ fail                                                     │
│  Attempt 3: Po 5 minutach                                       │
│       │                                                          │
│       ▼ fail                                                     │
│  Attempt 4: Po 30 minutach (ostatnia szansa)                    │
│       │                                                          │
│       ▼ fail                                                     │
│  Status = ABANDONED → Alert do admina                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Retry delays

| Attempt | Delay | Cumulative time |
|---------|-------|-----------------|
| 1 | 0 | 0 |
| 2 | 1 min | 1 min |
| 3 | 5 min | 6 min |
| 4 | 30 min | 36 min |
| Abandon | - | ~36 min od pierwszej próby |

### Warunki retry

```
RETRY jeśli:
- Network timeout
- RPC error (429, 503, 5xx)
- Nonce too low (po reset)
- Gas too low (po adjustment)
- DB connection error

NIE RETRY jeśli:
- Contract revert (invalid data)
- Insufficient funds (wymaga doładowania)
- Authorization error (wymaga admin action)
- Duplicate batch/root (data integrity issue)
```

---

## Scenariusze błędów i recovery

### A. TX Failed (revert, gas, nonce)

**Przyczyna:** Transakcja blockchain została odrzucona.

```
┌─────────────────────────────────────────────────────────────────┐
│                    TX FAILED RECOVERY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Catch error z blockchain                                    │
│  2. Log error + reason                                          │
│  3. Określ typ błędu:                                           │
│                                                                  │
│     ┌─────────────────┬─────────────────────────────────────┐   │
│     │ Typ błędu       │ Akcja                                │   │
│     ├─────────────────┼─────────────────────────────────────┤   │
│     │ nonce too low   │ Reset nonce z blockchain, retry     │   │
│     │ gas too low     │ Increase gas +50%, retry            │   │
│     │ timeout         │ Retry z backoff                     │   │
│     │ revert          │ Check reason, może removeBatch      │   │
│     │ out of funds    │ ABANDON + alert (manual refill)     │   │
│     └─────────────────┴─────────────────────────────────────┘   │
│                                                                  │
│  4. Increment retry counter                                     │
│  5. Schedule retry z backoff (jeśli applicable)                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Kod pseudokod:**

```csharp
try
{
    var tx = await _blockchain.AnchorMerkleRoot(batch);
    await tx.WaitForConfirmation();
}
catch (NonceException)
{
    await _blockchain.ResetNonce();
    return RetryAction.Retry;
}
catch (GasException ex) when (ex.Type == GasErrorType.TooLow)
{
    _config.GasLimit = (int)(_config.GasLimit * 1.5);
    return RetryAction.Retry;
}
catch (RevertException ex)
{
    _logger.Error("Contract revert: {Reason}", ex.Reason);
    return RetryAction.Abandon; // Invalid data - don't retry
}
catch (InsufficientFundsException)
{
    await _alertService.Send(AlertType.Critical, "Wallet needs refill");
    return RetryAction.Abandon;
}
```

---

### B. DB Error podczas budowania tree

**Przyczyna:** Błąd bazy danych podczas odczytu assetów lub zapisu tree.

```
┌─────────────────────────────────────────────────────────────────┐
│                    DB ERROR DURING BUILD                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Catch DB exception                                          │
│  2. Rollback partial changes (jeśli transaction)                │
│  3. Mark batch as FAILED                                        │
│  4. Log szczegóły błędu:                                        │
│     - Które assety były przetwarzane                            │
│     - Na którym etapie wystąpił błąd                            │
│     - Stack trace                                               │
│  5. Schedule retry                                              │
│                                                                  │
│  ⚠️  WAŻNE: NIE wysyłaj TX jeśli tree incomplete!               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Kod pseudokod:**

```csharp
using var transaction = await _db.BeginTransactionAsync();
try
{
    var assets = await _db.GetPendingAssets();
    var tree = _merkle.BuildTree(assets);

    batch.MerkleRoot = tree.Root;
    batch.Status = BatchStatus.Building;
    await _db.SaveChangesAsync();

    await transaction.CommitAsync();
}
catch (DbException ex)
{
    await transaction.RollbackAsync();
    batch.Status = BatchStatus.Failed;
    batch.LastError = ex.Message;
    batch.RetryCount++;
    _logger.Error(ex, "DB error during tree build for batch {BatchId}", batch.Id);

    // NIE kontynuuj do wysyłania TX!
    throw;
}
```

---

### C. TX Success ale DB Write Fail (KRYTYCZNY)

**Przyczyna:** Transakcja zapisana na blockchain, ale zapis do bazy danych się nie powiódł.

```
┌─────────────────────────────────────────────────────────────────┐
│              TX SUCCESS + DB FAIL (ORPHANED)                     │
│                                                                  │
│  ⚠️  KRYTYCZNY SCENARIUSZ - dane na blockchain, brak w DB       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Sekwencja błędu:                                               │
│  1. TX confirmed on blockchain ✓                                │
│  2. DB write fails ✗                                            │
│                                                                  │
│  IMMEDIATE ACTION:                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Log TX hash + batch ID + merkle root                    │ │
│  │ 2. Mark batch as ORPHANED (specjalny status)               │ │
│  │ 3. Send CRITICAL alert do admina                           │ │
│  │ 4. Store emergency data in separate table/file             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  RECOVERY PROCEDURE:                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Query blockchain for TX data (by txHash)                │ │
│  │ 2. Extract: merkleRoot, batchId, recordCount               │ │
│  │ 3. Match with local batch data                             │ │
│  │ 4. Rebuild proofs from stored asset hashes                 │ │
│  │ 5. Retry DB write                                          │ │
│  │ 6. Verify consistency                                      │ │
│  │ 7. Change status ORPHANED → DONE                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Kod pseudokod:**

```csharp
// Podczas anchoring
var txHash = await SendTransaction(batch);
await WaitForConfirmation(txHash);

try
{
    batch.TxHash = txHash;
    batch.Status = BatchStatus.Done;
    await _db.SaveChangesAsync();
}
catch (DbException ex)
{
    // CRITICAL: TX jest na blockchain, ale nie w DB!
    _logger.Critical(
        "ORPHANED BATCH! TxHash={TxHash}, BatchId={BatchId}, MerkleRoot={Root}",
        txHash, batch.Id, batch.MerkleRoot
    );

    // Zapisz emergency data
    await _emergencyLog.Write(new OrphanedBatch
    {
        TxHash = txHash,
        BatchId = batch.Id,
        MerkleRoot = batch.MerkleRoot,
        Timestamp = DateTime.UtcNow
    });

    // Alert
    await _alertService.SendCritical(
        "ORPHANED BATCH DETECTED",
        $"TX {txHash} confirmed but DB write failed. Manual recovery required."
    );

    // Mark as orphaned (jeśli możliwe)
    batch.Status = BatchStatus.Orphaned;
    batch.TxHash = txHash;
    // Retry DB save w background job
}
```

**Recovery script:**

```csharp
public async Task RecoverOrphanedBatch(string txHash)
{
    // 1. Query blockchain
    var txReceipt = await _blockchain.GetTransactionReceipt(txHash);
    var eventLogs = ParseAnchorEvents(txReceipt);

    // 2. Extract data
    var onChainData = new {
        MerkleRoot = eventLogs.MerkleRoot,
        BatchId = eventLogs.BatchId,
        RecordCount = eventLogs.RecordCount,
        BlockNumber = txReceipt.BlockNumber
    };

    // 3. Find local batch
    var batch = await _db.Batches.FindAsync(onChainData.BatchId);
    if (batch == null)
    {
        throw new RecoveryException("Batch not found in DB");
    }

    // 4. Verify consistency
    if (batch.MerkleRoot != onChainData.MerkleRoot)
    {
        throw new RecoveryException("Merkle root mismatch!");
    }

    // 5. Update DB
    batch.TxHash = txHash;
    batch.BlockNumber = onChainData.BlockNumber;
    batch.Status = BatchStatus.Done;
    batch.TxConfirmedAt = DateTime.UtcNow;

    await _db.SaveChangesAsync();

    _logger.Info("Recovered orphaned batch {BatchId}", batch.Id);
}
```

---

### D. Partial Batch (niektóre assety invalid)

**Strategia:** ALL OR NOTHING z opcją wykluczenia invalid assetów.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARTIAL BATCH HANDLING                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Strategia: VALIDATE ALL → EXCLUDE INVALID → PROCEED            │
│                                                                  │
│  1. Zbierz wszystkie assety do batch                            │
│  2. Waliduj KAŻDY asset:                                        │
│     - Required fields present?                                  │
│     - Hash computable?                                          │
│     - Data consistent?                                          │
│                                                                  │
│  3. Jeśli są invalid assety:                                    │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │ a) Log które assety są invalid i dlaczego               │ │
│     │ b) Mark invalid assety jako EXCLUDED                    │ │
│     │ c) Rebuild tree BEZ invalid assetów                     │ │
│     │ d) Continue z valid assets                              │ │
│     │ e) Alert jeśli > 10% excluded                           │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                  │
│  4. Jeśli WSZYSTKIE invalid:                                    │
│     → Abort batch, mark as FAILED, alert                        │
│                                                                  │
│  5. Jeśli wszystkie valid:                                      │
│     → Normal flow                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Kod pseudokod:**

```csharp
public async Task<BatchResult> ProcessBatch(List<Asset> assets)
{
    var validAssets = new List<Asset>();
    var invalidAssets = new List<(Asset Asset, string Reason)>();

    foreach (var asset in assets)
    {
        var validationResult = ValidateAsset(asset);
        if (validationResult.IsValid)
        {
            validAssets.Add(asset);
        }
        else
        {
            invalidAssets.Add((asset, validationResult.Error));
            asset.AnchorStatus = AnchorStatus.Excluded;
            asset.AnchorError = validationResult.Error;
        }
    }

    // Log excluded
    if (invalidAssets.Any())
    {
        _logger.Warning(
            "Excluded {Count} invalid assets from batch: {Details}",
            invalidAssets.Count,
            invalidAssets.Select(x => $"{x.Asset.Id}: {x.Reason}")
        );
    }

    // Alert if too many excluded
    var excludedPercent = (double)invalidAssets.Count / assets.Count * 100;
    if (excludedPercent > 10)
    {
        await _alertService.Send(AlertType.Warning,
            $"High exclusion rate: {excludedPercent:F1}% assets excluded from batch"
        );
    }

    // Abort if all invalid
    if (!validAssets.Any())
    {
        return BatchResult.Failed("All assets invalid");
    }

    // Build tree with valid assets only
    var tree = _merkle.BuildTree(validAssets);
    // Continue normal flow...
}
```

---

## Reconciliation Process

### Daily Reconciliation Job

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAILY RECONCILIATION                          │
│                    (03:00 UTC - po anchoring)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Query wszystkie batche ze statusem DONE z ostatnich 24h     │
│                                                                  │
│  2. Dla każdego batch:                                          │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │ a) Query blockchain: getBatch(batchId)                  │ │
│     │ b) Porównaj:                                            │ │
│     │    - DB.merkleRoot == Contract.merkleRoot               │ │
│     │    - DB.recordCount == Contract.recordCount             │ │
│     │    - DB.txHash exists on chain                          │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                  │
│  3. Jeśli mismatch:                                             │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │ - Alert: "RECONCILIATION FAILED"                        │ │
│     │ - Log szczegóły (expected vs actual)                    │ │
│     │ - Mark batch for manual review                          │ │
│     │ - DO NOT auto-fix (data integrity!)                     │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                  │
│  4. Generate daily report:                                      │
│     - Total batches checked                                     │
│     - Matches / Mismatches                                      │
│     - Orphaned batches found                                    │
│     - Recovery actions taken                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Kod pseudokod:**

```csharp
public class ReconciliationJob : IHostedService
{
    public async Task RunReconciliation()
    {
        var since = DateTime.UtcNow.AddHours(-24);
        var batches = await _db.Batches
            .Where(b => b.Status == BatchStatus.Done)
            .Where(b => b.TxConfirmedAt >= since)
            .ToListAsync();

        var report = new ReconciliationReport();

        foreach (var batch in batches)
        {
            report.TotalChecked++;

            try
            {
                var onChainBatch = await _blockchain.GetBatch(batch.BatchId);

                var matches =
                    batch.MerkleRoot == onChainBatch.MerkleRoot &&
                    batch.RecordCount == onChainBatch.RecordCount;

                if (matches)
                {
                    report.Matches++;
                }
                else
                {
                    report.Mismatches++;

                    _logger.Error(
                        "RECONCILIATION MISMATCH for batch {BatchId}. " +
                        "DB: {DbRoot}/{DbCount}, Chain: {ChainRoot}/{ChainCount}",
                        batch.BatchId,
                        batch.MerkleRoot, batch.RecordCount,
                        onChainBatch.MerkleRoot, onChainBatch.RecordCount
                    );

                    batch.NeedsReview = true;
                    await _alertService.Send(AlertType.Critical,
                        $"Reconciliation mismatch for batch {batch.BatchId}"
                    );
                }
            }
            catch (BatchNotFoundException)
            {
                // Batch in DB but not on chain - orphaned inverse?
                report.NotFoundOnChain++;
                _logger.Error("Batch {BatchId} not found on blockchain!", batch.BatchId);
            }
        }

        // Check for orphaned batches
        var orphaned = await _db.Batches
            .Where(b => b.Status == BatchStatus.Orphaned)
            .ToListAsync();

        report.OrphanedBatches = orphaned.Count;

        // Send report
        await _reportService.SendDailyReconciliation(report);
    }
}
```

---

## Alert Thresholds

### Konfiguracja alertów

| Alert | Poziom | Próg | Akcja |
|-------|--------|------|-------|
| MATIC balance low | Warning | < 0.5 MATIC | Doładuj wallet |
| MATIC balance critical | Critical | < 0.1 MATIC | URGENT: Doładuj |
| Failed anchoring | Warning | 1 fail | Check logs |
| Multiple failures | Critical | > 3 fails / godzina | Investigate |
| High gas price | Info | > 100 gwei | Monitor |
| Extreme gas price | Warning | > 500 gwei | Delay non-urgent |
| RPC errors | Warning | > 5 / min | Check provider |
| RPC down | Critical | > 1 min downtime | Switch provider |
| Orphaned batch | Critical | Any | Manual recovery |
| Reconciliation mismatch | Critical | Any | Investigate |
| High exclusion rate | Warning | > 10% excluded | Check data quality |
| Batch timeout | Warning | > 1 hour pending | Check status |
| Abandoned batch | Critical | After 4 retries | Manual intervention |

### Alert channels

```yaml
alerting:
  channels:
    - type: email
      recipients: ["admin@trve.io", "ops@trve.io"]
      levels: [warning, critical]

    - type: slack
      webhook: "${SLACK_WEBHOOK}"
      channel: "#trve-alerts"
      levels: [critical]

    - type: pagerduty
      api_key: "${PAGERDUTY_KEY}"
      levels: [critical]

  escalation:
    warning:
      notify: [email]
      wait: 15m
    critical:
      notify: [email, slack, pagerduty]
      wait: 0
```

---

## Database Schema

### Tabela: anchor_batches

```sql
CREATE TABLE anchor_batches (
    id SERIAL PRIMARY KEY,
    batch_id BIGINT UNIQUE NOT NULL,
    merkle_root BYTEA NOT NULL,
    record_count INT NOT NULL,

    -- State tracking
    status VARCHAR(20) NOT NULL DEFAULT 'COLLECTING',
    -- COLLECTING, BUILDING, SENDING, CONFIRMING, DONE, FAILED, ABANDONED, ORPHANED

    -- Retry tracking
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 4,
    last_error TEXT,
    last_retry_at TIMESTAMP,
    next_retry_at TIMESTAMP,

    -- TX tracking
    tx_hash BYTEA,
    tx_confirmed_at TIMESTAMP,
    block_number BIGINT,
    gas_used BIGINT,
    gas_price BIGINT,

    -- Review flags
    needs_review BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_status CHECK (status IN (
        'COLLECTING', 'BUILDING', 'SENDING', 'CONFIRMING',
        'DONE', 'FAILED', 'ABANDONED', 'ORPHANED'
    ))
);

-- Indexes
CREATE INDEX idx_anchor_batches_status ON anchor_batches(status);
CREATE INDEX idx_anchor_batches_created ON anchor_batches(created_at);
CREATE INDEX idx_anchor_batches_needs_review ON anchor_batches(needs_review) WHERE needs_review = TRUE;
```

### Tabela: anchor_errors

```sql
CREATE TABLE anchor_errors (
    id SERIAL PRIMARY KEY,
    batch_id BIGINT REFERENCES anchor_batches(batch_id),

    -- Error details
    error_type VARCHAR(50) NOT NULL,
    -- TX_FAILED, DB_ERROR, TIMEOUT, VALIDATION, RECONCILIATION, OTHER

    error_code VARCHAR(50),
    error_message TEXT NOT NULL,
    error_data JSONB,
    stack_trace TEXT,

    -- Context
    retry_attempt INT,
    stage VARCHAR(20),
    -- BUILDING, SENDING, CONFIRMING, DB_WRITE

    -- Resolution
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_anchor_errors_batch ON anchor_errors(batch_id);
CREATE INDEX idx_anchor_errors_type ON anchor_errors(error_type);
CREATE INDEX idx_anchor_errors_unresolved ON anchor_errors(resolved) WHERE resolved = FALSE;
```

### Tabela: anchor_reconciliation_log

```sql
CREATE TABLE anchor_reconciliation_log (
    id SERIAL PRIMARY KEY,
    run_at TIMESTAMP NOT NULL,

    -- Results
    batches_checked INT NOT NULL,
    matches INT NOT NULL,
    mismatches INT NOT NULL,
    not_found_on_chain INT DEFAULT 0,
    orphaned_found INT DEFAULT 0,

    -- Details
    mismatch_details JSONB,

    -- Status
    success BOOLEAN NOT NULL,
    error_message TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementacja w kodzie

### Enum: BatchStatus

```csharp
public enum BatchStatus
{
    Collecting,    // Zbieranie assetów
    Building,      // Budowanie Merkle tree
    Sending,       // Wysyłanie TX
    Confirming,    // Oczekiwanie na confirm
    Done,          // Sukces
    Failed,        // Błąd (retry scheduled)
    Abandoned,     // Po max retries
    Orphaned       // TX success, DB fail
}
```

### Enum: ErrorType

```csharp
public enum AnchorErrorType
{
    TxFailed,        // Transaction rejected/reverted
    DbError,         // Database error
    Timeout,         // Operation timeout
    Validation,      // Asset validation failed
    Reconciliation,  // Reconciliation mismatch
    NetworkError,    // RPC/network issue
    InsufficientFunds,
    Unauthorized,
    DuplicateBatch,
    Other
}
```

### Interface: IRetryPolicy

```csharp
public interface IRetryPolicy
{
    int MaxRetries { get; }
    TimeSpan GetDelay(int attemptNumber);
    bool ShouldRetry(Exception ex);
}

public class AnchoringRetryPolicy : IRetryPolicy
{
    public int MaxRetries => 4;

    public TimeSpan GetDelay(int attempt) => attempt switch
    {
        1 => TimeSpan.Zero,
        2 => TimeSpan.FromMinutes(1),
        3 => TimeSpan.FromMinutes(5),
        4 => TimeSpan.FromMinutes(30),
        _ => TimeSpan.MaxValue // Won't retry
    };

    public bool ShouldRetry(Exception ex) => ex switch
    {
        NetworkException => true,
        TimeoutException => true,
        NonceException => true,
        GasException e when e.Type == GasErrorType.TooLow => true,
        DbException e when e.IsTransient => true,
        _ => false
    };
}
```

---

---

## Migracja kontraktu (ostateczność)

Jeśli kontrakt ma poważny bug i trzeba go wymienić:

### Procedura

```
1. pause("Migrating to new contract")     ← Zatrzymaj stary kontrakt
2. Deploy nowy kontrakt
3. Migruj dane (skrypt poniżej)
4. Zmień CONTRACT_ADDRESS w backendzie
5. Testuj
6. Stary kontrakt zostaje (read-only, dane są na blockchain)
```

### Skrypt migracji

#### Opcja A: Ze starego kontraktu (blockchain → blockchain)

```javascript
// scripts/migrate-from-contract.js
const hre = require("hardhat");

async function main() {
    const OLD_ADDRESS = "0xAAA...";
    const NEW_ADDRESS = "0xBBB...";

    const oldContract = await hre.ethers.getContractAt("TruvalueAnchor", OLD_ADDRESS);
    const newContract = await hre.ethers.getContractAt("TruvalueAnchor", NEW_ADDRESS);

    const stats = await oldContract.getStats();
    console.log(`Migrating ${stats._totalBatches} batches from old contract...`);

    for (let i = 0; i <= stats._totalBatches; i++) {
        const batch = await oldContract.getBatch(i);
        if (batch.exists) {
            console.log(`Migrating batch ${i}: ${batch.merkleRoot}`);
            const tx = await newContract.anchorMerkleRoot(i, batch.merkleRoot, batch.recordCount);
            await tx.wait();
            console.log(`  ✓ Done`);
        }
    }
    console.log("Migration complete!");
}

main();
```

#### Opcja B: Z bazy danych (ZALECANE)

```csharp
// Services/Migration/ContractMigrationService.cs
public class ContractMigrationService
{
    private readonly AppDbContext _db;
    private readonly IBlockchainService _blockchain;
    private readonly ILogger<ContractMigrationService> _logger;

    public async Task MigrateToNewContract(string newContractAddress)
    {
        // 1. Pobierz wszystkie DONE batche z bazy
        var batches = await _db.AnchorBatches
            .Where(b => b.Status == BatchStatus.Done)
            .OrderBy(b => b.BatchId)
            .ToListAsync();

        _logger.LogInformation("Migrating {Count} batches to {Address}",
            batches.Count, newContractAddress);

        // 2. Zmień adres kontraktu na nowy
        _blockchain.SetContractAddress(newContractAddress);

        // 3. Migruj każdy batch
        foreach (var batch in batches)
        {
            _logger.LogInformation("Migrating batch {Id}: {Root}",
                batch.BatchId, batch.MerkleRoot);

            try
            {
                var txHash = await _blockchain.AnchorMerkleRoot(
                    batch.BatchId,
                    batch.MerkleRoot,
                    batch.RecordCount
                );

                // 4. Zaktualizuj TX hash w bazie (nowy kontrakt)
                batch.TxHash = txHash;
                batch.MigratedAt = DateTime.UtcNow;
                batch.MigratedToContract = newContractAddress;
                await _db.SaveChangesAsync();

                _logger.LogInformation("  ✓ Done (tx: {TxHash})", txHash);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to migrate batch {Id}", batch.BatchId);
                throw; // Przerwij migrację - wymaga manual review
            }
        }

        _logger.LogInformation("Migration complete! {Count} batches migrated.", batches.Count);
    }
}
```

**Endpoint do uruchomienia migracji (admin only):**

```csharp
// Controllers/Admin/MigrationController.cs
[HttpPost("migrate")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> MigrateContract([FromBody] MigrateRequest request)
{
    // Walidacja
    if (string.IsNullOrEmpty(request.NewContractAddress))
        return BadRequest("New contract address required");

    // Uruchom migrację
    await _migrationService.MigrateToNewContract(request.NewContractAddress);

    return Ok(new { message = "Migration complete" });
}
```

#### Porównanie opcji

| Aspekt | Opcja A (contract→contract) | Opcja B (DB→contract) |
|--------|----------------------------|----------------------|
| Źródło danych | Stary kontrakt | PostgreSQL |
| Szybkość | Wolniej (blockchain queries) | Szybciej |
| Dostęp do DB | Nie wymaga | Wymaga |
| Weryfikacja | Trudniejsza | Łatwa (SQL) |
| **Zalecane** | Dla prostych przypadków | **Dla produkcji** |

### Koszt migracji

| Liczba batchów | Szacowany koszt |
|----------------|-----------------|
| 10 | ~$0.06 |
| 100 | ~$0.33 |
| 365 (rok) | ~$1.13 |
| 1000 | ~$3.30 |

### Co się NIE traci

- ✅ Assety w PostgreSQL
- ✅ Merkle proofs w PostgreSQL
- ✅ Historia TX na blockchain (stary kontrakt)
- ✅ Możliwość weryfikacji starych assetów (stary kontrakt nadal działa)

### Update w backendzie

```csharp
// appsettings.json - zmień tylko adres
{
  "Blockchain": {
    "AnchorContractAddress": "0xBBB..." // ← nowy adres
  }
}
```

```sql
-- Opcjonalnie: zapisz historię kontraktów
INSERT INTO contract_history (address, deployed_at, migrated_at, reason)
VALUES ('0xAAA...', '2025-02-01', '2025-06-15', 'Bug fix migration');
```

---

## Powiązane dokumenty

- [Blockchain Architecture](./BLOCKCHAIN-ARCHITECTURE.md) - Architektura systemu
- [Backend Integration](./BACKEND-INTEGRATION.md) - Konfiguracja backendu
- [Troubleshooting](./TROUBLESHOOTING.md) - Rozwiązywanie problemów
- [Smart Contract](./SMART-CONTRACT.md) - Kod Solidity (z Pausable)
- [Implementation Plan](./IMPLEMENTATION-PLAN.md) - Plan implementacji

---

**Ostatnia aktualizacja:** 2025-01-31
