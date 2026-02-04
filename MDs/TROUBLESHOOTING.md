# TRVE Troubleshooting

Rozwiązywanie problemów z integracją blockchain.

---

## Najczęstsze problemy

### "TruvalueAnchor: not authorized"

**Przyczyna:** Adres walleta backendu nie jest autoryzowany do anchorowania.

**Rozwiązanie:**

```javascript
// Z adresu owner'a kontraktu
const anchor = await ethers.getContractAt("TruvalueAnchor", CONTRACT_ADDRESS);
await anchor.setAnchorAuthorization(BACKEND_ADDRESS, true);
```

Lub przez Hardhat:

```bash
npx hardhat run scripts/authorize.js --network amoy
```

**Weryfikacja:**

```javascript
const isAuthorized = await anchor.authorizedAnchors(BACKEND_ADDRESS);
console.log("Is authorized:", isAuthorized); // true
```

---

### "insufficient funds for gas"

**Przyczyna:** Brak MATIC na wallecie backendu.

**Rozwiązanie:**

| Sieć | Rozwiązanie |
|------|-------------|
| Testnet (Amoy) | Użyj faucet: https://faucet.polygon.technology |
| Mainnet | Doładuj wallet z giełdy |

**Sprawdzenie balansu:**

```bash
curl -X POST https://rpc-amoy.polygon.technology \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["ADRES","latest"],"id":1}'
```

---

### "nonce too low"

**Przyczyna:** Desync nonce między backendem a blockchain. Może wystąpić po:
- Restarcie aplikacji
- Failed transaction
- Równoległych transakcjach

**Rozwiązanie w C# (Nethereum):**

```csharp
// Reset nonce - pobierz aktualny z blockchain
var nonce = await _web3.Eth.Transactions.GetTransactionCount.SendRequestAsync(address);
```

**Rozwiązanie w JavaScript (ethers.js):**

```javascript
// Użyj "pending" zamiast "latest" dla nonce
const nonce = await provider.getTransactionCount(address, "pending");
```

---

### "execution reverted"

**Przyczyna:** Smart contract odrzucił transakcję.

**Możliwe powody:**

| Błąd | Przyczyna | Rozwiązanie |
|------|-----------|-------------|
| `batch already anchored` | Batch z tym ID już istnieje | Użyj innego batchId |
| `root already anchored` | Ten Merkle root już zapisany | Sprawdź duplikaty |
| `invalid merkle root` | Merkle root = bytes32(0) | Sprawdź obliczenia |

**Debugging:**

```javascript
try {
    await anchor.anchorMerkleRoot(batchId, merkleRoot, recordCount);
} catch (error) {
    console.log("Revert reason:", error.reason);
    console.log("Error data:", error.data);
}
```

---

### Health check zwraca "disconnected"

**Przyczyna:** Brak połączenia z RPC.

**Kroki diagnostyczne:**

1. **Sprawdź URL RPC:**
   ```bash
   curl -X POST $RPC_URL \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```

2. **Sprawdź limity API:**
   - Alchemy: 300M compute units/month
   - Infura: 100k requests/day
   - Polygon public: Rate limited

3. **Sprawdź firewall:**
   ```bash
   # Test connectivity
   nc -zv polygon-rpc.com 443
   ```

4. **Sprawdź logi:**
   ```bash
   docker logs trve-api --tail 100 | grep -i "rpc\|blockchain\|error"
   ```

---

### Transaction pending forever

**Przyczyna:** Za niski gas price.

**Rozwiązanie:**

1. **Sprawdź aktualny gas price:**
   ```bash
   curl -X POST $RPC_URL \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}'
   ```

2. **Zwiększ gas price w konfiguracji:**
   ```json
   {
     "Blockchain": {
       "GasPrice": 50000000000
     }
   }
   ```

3. **Lub użyj dynamicznego gas price (zalecane):**
   ```csharp
   var gasPrice = await _web3.Eth.GasPrice.SendRequestAsync();
   var adjustedGasPrice = gasPrice.Value * 120 / 100; // +20%
   ```

---

### Merkle proof verification fails

**Przyczyna:** Niezgodność między zapisanym proof a danymi assetu.

**Debugging:**

1. **Sprawdź hash assetu:**
   ```csharp
   var currentHash = ComputeAssetHash(asset);
   var storedHash = asset.RecordHash;
   Console.WriteLine($"Match: {currentHash == storedHash}");
   ```

2. **Sprawdź Merkle proof:**
   ```csharp
   var isValid = MerkleTree.VerifyProof(
       leaf: assetHash,
       proof: storedProof,
       root: batchMerkleRoot
   );
   ```

3. **Sprawdź czy dane assetu się nie zmieniły:**
   - Hash jest obliczany z danych w momencie tworzenia
   - Jeśli dane się zmieniły, hash będzie inny
   - To jest **expected behavior** - immutability!

---

## Logi i monitoring

### Gdzie szukać logów?

```bash
# Docker
docker logs trve-api --tail 500

# Kubernetes
kubectl logs -f deployment/trve-api

# Systemd
journalctl -u trve-api -f
```

### Przydatne grep patterns

```bash
# Błędy blockchain
docker logs trve-api | grep -i "blockchain\|anchor\|merkle"

# Failed transactions
docker logs trve-api | grep -i "failed\|error\|revert"

# Gas issues
docker logs trve-api | grep -i "gas\|nonce"
```

### Alerty (zalecane)

Ustaw alerty na:

| Alert | Próg | Akcja |
|-------|------|-------|
| MATIC balance low | < 0.1 MATIC | Doładuj wallet |
| Failed anchoring | > 3 w ciągu godziny | Sprawdź logi |
| High gas price | > 200 gwei | Poczekaj lub zwiększ limit |
| RPC errors | > 10/min | Sprawdź provider |

---

## Przydatne komendy

### Sprawdzenie stanu kontraktu

```javascript
const anchor = await ethers.getContractAt("TruvalueAnchor", ADDRESS);

// Statystyki
const stats = await anchor.getStats();
console.log("Total batches:", stats._totalBatches.toString());
console.log("Total records:", stats._totalRecords.toString());

// Ostatni batch
const lastBatch = await anchor.getBatch(stats._totalBatches);
console.log("Last batch:", lastBatch);
```

### Sprawdzenie autoryzacji

```javascript
const isAuthorized = await anchor.authorizedAnchors(BACKEND_ADDRESS);
console.log("Backend authorized:", isAuthorized);

const owner = await anchor.owner();
console.log("Contract owner:", owner);
```

### Test połączenia RPC

```javascript
const provider = new ethers.JsonRpcProvider(RPC_URL);
const blockNumber = await provider.getBlockNumber();
console.log("Connected! Current block:", blockNumber);
```

---

## Przydatne linki

### Polygon

- [Polygon Docs](https://docs.polygon.technology/)
- [Polygon Amoy Explorer](https://amoy.polygonscan.com)
- [Polygon Mainnet Explorer](https://polygonscan.com)
- [Polygon Faucet](https://faucet.polygon.technology/)

### Narzędzia

- [Hardhat Docs](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Nethereum Docs](https://docs.nethereum.com/)
- [Ethers.js Docs](https://docs.ethers.org/)

### RPC Providers

- [Alchemy](https://www.alchemy.com/)
- [Infura](https://infura.io/)
- [QuickNode](https://www.quicknode.com/)

---

---

## TX Success, DB Fail (Orphaned Batch)

**KRYTYCZNY SCENARIUSZ:** Transakcja zapisana na blockchain, ale zapis do bazy danych się nie powiódł.

### Objawy

- Batch ma status `ORPHANED`
- W logach: "ORPHANED BATCH DETECTED"
- Alert: Critical

### Przyczyny

- DB connection lost po wysłaniu TX
- DB timeout podczas zapisu
- Disk full
- Concurrent write conflict

### Natychmiastowa akcja

```bash
# 1. Znajdź orphaned batche
docker logs trve-api | grep "ORPHANED"

# 2. Sprawdź emergency log
cat /var/log/trve/orphaned_batches.json
```

### Procedura recovery

```csharp
// 1. Znajdź orphaned batch
var orphaned = await _db.Batches
    .Where(b => b.Status == BatchStatus.Orphaned)
    .FirstAsync();

// 2. Query blockchain po TX hash
var txReceipt = await _blockchain.GetTransactionReceipt(orphaned.TxHash);

// 3. Zweryfikuj dane
var onChainData = ParseAnchorEvent(txReceipt);
if (orphaned.MerkleRoot != onChainData.MerkleRoot)
{
    throw new Exception("Data mismatch - manual review required!");
}

// 4. Uzupełnij brakujące dane
orphaned.BlockNumber = txReceipt.BlockNumber;
orphaned.TxConfirmedAt = DateTime.UtcNow;
orphaned.Status = BatchStatus.Done;

await _db.SaveChangesAsync();
```

### Zapobieganie

- Użyj transakcji bazodanowej z retry
- Zapisz TX hash PRZED wysłaniem TX (jako pending)
- Implementuj idempotent DB writes

Szczegóły: [ERROR-HANDLING.md](./ERROR-HANDLING.md#c-tx-success-ale-db-write-fail-krytyczny)

---

## Reconciliation Mismatch

**SCENARIUSZ:** Daily reconciliation wykryła niezgodność między DB a blockchain.

### Objawy

- Alert: "RECONCILIATION FAILED"
- W logach: "RECONCILIATION MISMATCH for batch X"
- Batch oznaczony `needs_review = true`

### Przyczyny

| Przyczyna | Diagnoza |
|-----------|----------|
| Bug w kodzie | Sprawdź logi z momentu anchoring |
| Manual tampering | Sprawdź audit log |
| Chain reorg | Bardzo rzadkie na Polygon |
| Race condition | Sprawdź concurrent operations |

### Diagnoza

```bash
# 1. Znajdź mismatched batch
SELECT * FROM anchor_batches WHERE needs_review = true;

# 2. Porównaj dane
# DB:
SELECT batch_id, encode(merkle_root, 'hex'), record_count
FROM anchor_batches WHERE batch_id = X;

# Blockchain (via script):
npx hardhat console --network amoy
> const anchor = await ethers.getContractAt("TruvalueAnchor", "0x...")
> await anchor.getBatch(X)
```

### Rozwiązanie

**NIE** automatycznie naprawiaj - wymaga manual review!

1. Sprawdź który źródło ma prawidłowe dane
2. Jeśli blockchain ma prawidłowe - zaktualizuj DB
3. Jeśli DB ma prawidłowe - blockchain jest immutable, dodaj notatkę
4. Dokumentuj incident

Szczegóły: [ERROR-HANDLING.md](./ERROR-HANDLING.md#reconciliation-process)

---

## Abandoned Batch

**SCENARIUSZ:** Batch po 4 nieudanych próbach został oznaczony jako ABANDONED.

### Objawy

- Status batcha: `ABANDONED`
- Alert: Critical
- `retry_count = 4`

### Przyczyny (sprawdź w kolejności)

1. **Insufficient funds** - sprawdź balance walleta
2. **Authorization revoked** - sprawdź `authorizedAnchors`
3. **Contract paused** - sprawdź `paused()`
4. **Invalid data** - sprawdź dane batcha
5. **RPC issues** - sprawdź provider

### Diagnoza

```bash
# 1. Sprawdź historię błędów
SELECT * FROM anchor_errors WHERE batch_id = X ORDER BY created_at;

# 2. Sprawdź ostatni błąd
SELECT last_error FROM anchor_batches WHERE batch_id = X;

# 3. Sprawdź balance
curl -X POST $RPC_URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["WALLET","latest"],"id":1}'
```

### Rozwiązanie

1. Napraw przyczynę (np. doładuj wallet)
2. Reset retry counter:
   ```sql
   UPDATE anchor_batches
   SET status = 'FAILED', retry_count = 0, next_retry_at = NOW()
   WHERE batch_id = X;
   ```
3. Trigger retry manualnie lub poczekaj na scheduled job

Szczegóły: [ERROR-HANDLING.md](./ERROR-HANDLING.md#retry-strategy)

---

## Powiązane dokumenty

- [Blockchain Architecture](./BLOCKCHAIN-ARCHITECTURE.md) - Jak działa system
- [Backend Integration](./BACKEND-INTEGRATION.md) - Konfiguracja backendu
- [Error Handling](./ERROR-HANDLING.md) - Strategia obsługi błędów
- [Mainnet Migration](./MAINNET-MIGRATION.md) - Przejście na produkcję

---

**Ostatnia aktualizacja:** 2025-01-31
