# TRVE Backend Integration

Konfiguracja backendu ASP.NET do integracji z blockchain.

---

## Konfiguracja

### Zmienne środowiskowe

Ustaw w `appsettings.json`:

```json
{
  "Blockchain": {
    "RpcUrl": "https://rpc-amoy.polygon.technology",
    "AnchorContractAddress": "0xABCD1234...",
    "PrivateKey": "twój_klucz_prywatny",
    "ChainId": 80002,
    "GasLimit": 200000,
    "Enabled": true
  },
  "AnchoringJob": {
    "Enabled": true,
    "RunAtUtcHour": 2
  }
}
```

Lub jako environment variables:

```bash
export BLOCKCHAIN__RpcUrl="https://rpc-amoy.polygon.technology"
export BLOCKCHAIN__AnchorContractAddress="0xABCD1234..."
export BLOCKCHAIN__PrivateKey="twój_klucz_prywatny"
export BLOCKCHAIN__ChainId=80002
export BLOCKCHAIN__GasLimit=200000
export BLOCKCHAIN__Enabled=true
export ANCHORINGJOB__Enabled=true
export ANCHORINGJOB__RunAtUtcHour=2
```

---

## Autoryzacja backendu

Jeśli backend używa **innego** adresu niż deployer, musisz go autoryzować w smart contrakcie.

### Skrypt autoryzacji

Utwórz `scripts/authorize.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0xABCD1234..."; // Twój kontrakt
  const BACKEND_ADDRESS = "0x5678...";      // Adres walleta backendu

  const anchor = await hre.ethers.getContractAt("TruvalueAnchor", CONTRACT_ADDRESS);

  console.log("Authorizing backend address:", BACKEND_ADDRESS);
  const tx = await anchor.setAnchorAuthorization(BACKEND_ADDRESS, true);
  await tx.wait();

  console.log("Done! Backend is now authorized to anchor.");
}

main();
```

Uruchom:

```bash
npx hardhat run scripts/authorize.js --network amoy
```

---

## Migracja bazy danych

```bash
cd AssetRegistry.Api
dotnet ef database update
```

---

## Testowanie integracji

### Health Check

```bash
curl http://localhost:5000/api/verification/health
```

Oczekiwana odpowiedź:

```json
{
  "status": "healthy",
  "blockchain": "connected"
}
```

### Statystyki

```bash
curl http://localhost:5000/api/verification/stats
```

Oczekiwana odpowiedź:

```json
{
  "totalBatches": 0,
  "anchoredBatches": 0,
  "pendingBatches": 0,
  "failedBatches": 0,
  "totalRecordsAnchored": 0,
  "blockchain": {
    "totalBatches": 0,
    "totalRecords": 0
  }
}
```

### Manualne wywołanie anchoring

Jeśli nie chcesz czekać na 2:00 UTC:

```bash
# Endpoint do manualnego triggera
curl -X POST http://localhost:5000/api/admin/anchoring/run \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Lub przez kod C#:

```csharp
// W kontrolerze lub teście
var batchService = serviceProvider.GetRequiredService<IBatchAnchoringService>();
var batch = await batchService.CreateAndAnchorBatchAsync();
```

### Weryfikacja assetu

Po zaanchorowaniu:

```bash
curl http://localhost:5000/api/verification/asset/1
```

Oczekiwana odpowiedź:

```json
{
  "isVerified": true,
  "recordHash": "0x1234...",
  "merkleRoot": "0xabcd...",
  "batchId": 1,
  "transactionHash": "0x9876...",
  "blockNumber": 12345678,
  "chainId": 80002,
  "anchoredAt": "2025-01-25T02:00:00Z",
  "blockchainVerified": true,
  "status": "Verified on blockchain"
}
```

---

## Sprawdzenie na Polygonscan

1. Otwórz: `https://amoy.polygonscan.com/address/ADRES_KONTRAKTU`
2. Zakładka **Events** - powinieneś widzieć `MerkleRootAnchored`
3. Zakładka **Read Contract** - wywołaj `getStats()` aby zobaczyć statystyki

---

## API Endpoints

### Verification API

| Endpoint | Method | Opis |
|----------|--------|------|
| `/api/verification/health` | GET | Health check blockchain |
| `/api/verification/stats` | GET | Statystyki anchoring |
| `/api/verification/asset/{id}` | GET | Weryfikacja assetu |
| `/api/verification/batch/{id}` | GET | Szczegóły batcha |

### Admin API

| Endpoint | Method | Opis |
|----------|--------|------|
| `/api/admin/anchoring/run` | POST | Manualne wywołanie anchoring |
| `/api/admin/anchoring/batches` | GET | Lista wszystkich batchy |
| `/api/admin/anchoring/pending` | GET | Oczekujące na anchoring |

---

## Struktura kodu backendu

```
AssetRegistry.Api/
├── Services/
│   ├── Blockchain/
│   │   ├── IBlockchainService.cs
│   │   ├── BlockchainService.cs
│   │   ├── IMerkleTreeService.cs
│   │   └── MerkleTreeService.cs
│   └── Anchoring/
│       ├── IBatchAnchoringService.cs
│       ├── BatchAnchoringService.cs
│       └── DailyAnchoringJob.cs
├── Controllers/
│   ├── VerificationController.cs
│   └── Admin/
│       └── AnchoringController.cs
└── Models/
    ├── AnchoredBatch.cs
    └── VerificationResult.cs
```

---

## Konfiguracja DI

```csharp
// Program.cs lub Startup.cs
services.Configure<BlockchainOptions>(configuration.GetSection("Blockchain"));
services.Configure<AnchoringJobOptions>(configuration.GetSection("AnchoringJob"));

services.AddSingleton<IBlockchainService, BlockchainService>();
services.AddSingleton<IMerkleTreeService, MerkleTreeService>();
services.AddScoped<IBatchAnchoringService, BatchAnchoringService>();

// Hosted service dla daily anchoring
services.AddHostedService<DailyAnchoringJob>();
```

---

---

## Batch States

### Enum BatchStatus

```csharp
public enum BatchStatus
{
    Collecting,    // Zbieranie assetów do batcha
    Building,      // Budowanie Merkle tree
    Sending,       // Wysyłanie TX na blockchain
    Confirming,    // Oczekiwanie na potwierdzenie TX
    Done,          // Sukces - batch zakotwiczony
    Failed,        // Błąd - scheduled retry
    Abandoned,     // Po 4 failed retries - manual intervention
    Orphaned       // TX success, DB fail - CRITICAL
}
```

### State transitions

```
COLLECTING → BUILDING → SENDING → CONFIRMING → DONE
     ↓           ↓          ↓           ↓
   (timeout)  (db err)  (tx fail)  (no confirm)
     ↓           ↓          ↓           ↓
     └───────────┴──────────┴───────────┘
                      ↓
                   FAILED
                      ↓
               RETRY (max 4)
                      ↓
              ┌───────┴───────┐
              ↓               ↓
           SUCCESS        ABANDONED
                          (alert)
```

Szczegóły: [ERROR-HANDLING.md](./ERROR-HANDLING.md#batch-state-machine)

---

## Error Handling w DailyAnchoringJob

### Retry Policy

```csharp
public class AnchoringRetryPolicy
{
    public int MaxRetries => 4;

    public TimeSpan GetDelay(int attempt) => attempt switch
    {
        1 => TimeSpan.Zero,
        2 => TimeSpan.FromMinutes(1),
        3 => TimeSpan.FromMinutes(5),
        4 => TimeSpan.FromMinutes(30),
        _ => TimeSpan.MaxValue
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

### Error handling w job

```csharp
public class DailyAnchoringJob : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                // Sprawdź pending batche
                var pendingBatches = await GetPendingBatches();

                foreach (var batch in pendingBatches)
                {
                    try
                    {
                        await ProcessBatch(batch);
                    }
                    catch (Exception ex)
                    {
                        await HandleBatchError(batch, ex);
                    }
                }

                // Sprawdź failed batche do retry
                await ProcessRetries();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "DailyAnchoringJob failed");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), ct);
        }
    }

    private async Task HandleBatchError(Batch batch, Exception ex)
    {
        batch.RetryCount++;
        batch.LastError = ex.Message;

        if (_retryPolicy.ShouldRetry(ex) && batch.RetryCount < _retryPolicy.MaxRetries)
        {
            batch.Status = BatchStatus.Failed;
            batch.NextRetryAt = DateTime.UtcNow + _retryPolicy.GetDelay(batch.RetryCount);
        }
        else
        {
            batch.Status = BatchStatus.Abandoned;
            await _alertService.SendCritical($"Batch {batch.Id} abandoned after {batch.RetryCount} retries");
        }

        // Log error
        await _db.AnchorErrors.AddAsync(new AnchorError
        {
            BatchId = batch.BatchId,
            ErrorType = ClassifyError(ex),
            ErrorMessage = ex.Message,
            RetryAttempt = batch.RetryCount
        });

        await _db.SaveChangesAsync();
    }
}
```

### Orphaned batch handling

```csharp
private async Task<string> SendAndConfirmTx(Batch batch)
{
    // 1. Zapisz TX hash przed wysłaniem (jako pending)
    var txHash = await _blockchain.SendTransaction(batch);

    try
    {
        // 2. Zapisz TX hash natychmiast
        batch.TxHash = txHash;
        batch.Status = BatchStatus.Confirming;
        await _db.SaveChangesAsync();

        // 3. Czekaj na confirmation
        await _blockchain.WaitForConfirmation(txHash);

        // 4. Aktualizuj status
        batch.Status = BatchStatus.Done;
        batch.TxConfirmedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return txHash;
    }
    catch (DbException ex)
    {
        // CRITICAL: TX jest na blockchain!
        _logger.Critical(
            "ORPHANED BATCH! TxHash={TxHash}, BatchId={BatchId}",
            txHash, batch.BatchId
        );

        batch.Status = BatchStatus.Orphaned;
        await _alertService.SendCritical($"Orphaned batch detected: {batch.BatchId}");

        throw;
    }
}
```

Szczegóły: [ERROR-HANDLING.md](./ERROR-HANDLING.md)

---

## Powiązane dokumenty

- [Blockchain Architecture](./BLOCKCHAIN-ARCHITECTURE.md) - Jak działa system
- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - Wdrożenie kontraktu
- [Error Handling](./ERROR-HANDLING.md) - Obsługa błędów, retry, recovery
- [Troubleshooting](./TROUBLESHOOTING.md) - Rozwiązywanie problemów

---

**Ostatnia aktualizacja:** 2025-01-31
