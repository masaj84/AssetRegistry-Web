# TRVE Blockchain Implementation Plan

Plan implementacji Fazy 1 - Merkle Anchoring na Polygon.

---

## Status: Gotowy do rozpoczęcia

**Data utworzenia:** 2025-01-30
**Ostatnia aktualizacja:** 2025-01-31

---

## Kolejność implementacji

| Krok | Zadanie | Status | Opis |
|------|---------|--------|------|
| **1** | Smart Contract | [ ] TODO | Kod Solidity TruvalueAnchor |
| **2** | Deploy na testnet | [ ] TODO | Polygon Amoy + weryfikacja |
| **3** | Backend integration | [ ] TODO | ASP.NET + Nethereum |
| **3.1** | Error handling (docs) | [x] DONE | Dokumentacja strategii |
| **3.2** | Error handling (code) | [ ] TODO | Implementacja w backendzie (~12h) |
| **4** | Frontend UI | [ ] TODO | Wyświetlanie statusu weryfikacji |

---

## Krok 1: Smart Contract

### Co robimy
- Utworzenie folderu `contracts/` w repozytorium
- Konfiguracja Hardhat
- Implementacja TruvalueAnchor.sol
- Testy jednostkowe

### Pliki do utworzenia
```
contracts/
├── contracts/
│   └── TruvalueAnchor.sol
├── scripts/
│   ├── deploy.js
│   └── authorize.js
├── test/
│   └── TruvalueAnchor.test.js
├── hardhat.config.js
├── package.json
└── .env.example
```

### Wymagania
- Node.js 18+
- Hardhat
- OpenZeppelin Contracts
- Wallet z testowym MATIC (faucet: https://faucet.polygon.technology)

### Dokumentacja
- Kod kontraktu: [SMART-CONTRACT.md](./SMART-CONTRACT.md)
- Architektura: [BLOCKCHAIN-ARCHITECTURE.md](./BLOCKCHAIN-ARCHITECTURE.md)

---

## Krok 2: Deploy na testnet

### Co robimy
- Deploy kontraktu na Polygon Amoy (testnet)
- Weryfikacja kodu na PolygonScan
- Autoryzacja adresu backendu
- Test pierwszego anchora

### Wymagania
- Wallet z testowym MATIC (~0.1 MATIC)
- RPC URL (Alchemy/Infura lub publiczny)

### Dokumentacja
- Instrukcja: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Krok 3: Backend integration

### Co robimy
- Konfiguracja Nethereum w ASP.NET
- Serwis BlockchainService
- Endpoint `/api/blockchain/health`
- Scheduled job dla daily anchoring
- Merkle Tree implementation

### Nowe endpointy API
```
GET  /api/blockchain/health     - status połączenia
GET  /api/blockchain/stats      - statystyki (batche, rekordy)
POST /api/blockchain/anchor     - ręczne zakotwiczenie (admin)
GET  /api/assets/{id}/verify    - weryfikacja assetu
```

### Dokumentacja
- Konfiguracja: [BACKEND-INTEGRATION.md](./BACKEND-INTEGRATION.md)

---

## Krok 3.1: Error Handling (Dokumentacja) ✅

Dokumentacja strategii obsługi błędów - DONE.

- [ERROR-HANDLING.md](./ERROR-HANDLING.md) - pełna strategia

---

## Krok 3.2: Error Handling (Implementacja)

### Szacowany czas: ~12h

### Zadania

| # | Zadanie | Czas | Zależności |
|---|---------|------|------------|
| 1 | DB Schema (migracje) | 2h | - |
| 2 | BatchStatus enum + model | 1h | #1 |
| 3 | AnchorError model | 1h | #1 |
| 4 | RetryPolicy | 1h | - |
| 5 | Error handling w BatchAnchoringService | 2h | #2, #3, #4 |
| 6 | Orphaned batch handling | 2h | #5 |
| 7 | ReconciliationJob | 2h | #2 |
| 8 | AlertService (email) | 1h | - |

### Pliki do utworzenia

```
AssetRegistry.Api/
├── Models/
│   ├── Enums/
│   │   ├── BatchStatus.cs              # NOWY - enum stanów
│   │   └── AnchorErrorType.cs          # NOWY - typy błędów
│   ├── AnchoredBatch.cs                # UPDATE - dodaj nowe pola
│   └── AnchorError.cs                  # NOWY - model błędu
├── Services/
│   ├── Anchoring/
│   │   ├── BatchAnchoringService.cs    # UPDATE - error handling
│   │   ├── RetryPolicy.cs              # NOWY - exponential backoff
│   │   ├── ReconciliationJob.cs        # NOWY - daily check
│   │   └── OrphanedBatchRecovery.cs    # NOWY - recovery logic
│   └── Alerts/
│       ├── IAlertService.cs            # NOWY - interface
│       └── EmailAlertService.cs        # NOWY - email alerts
├── Data/
│   └── Migrations/
│       └── YYYYMMDD_AddErrorHandling.cs # NOWY - schema
└── appsettings.json                     # UPDATE - alert config
```

### Database Schema

```sql
-- Rozszerzenie anchor_batches
ALTER TABLE anchor_batches ADD COLUMN status VARCHAR(20) DEFAULT 'COLLECTING';
ALTER TABLE anchor_batches ADD COLUMN retry_count INT DEFAULT 0;
ALTER TABLE anchor_batches ADD COLUMN last_error TEXT;
ALTER TABLE anchor_batches ADD COLUMN next_retry_at TIMESTAMP;
ALTER TABLE anchor_batches ADD COLUMN needs_review BOOLEAN DEFAULT FALSE;

-- Nowa tabela anchor_errors
CREATE TABLE anchor_errors (
    id SERIAL PRIMARY KEY,
    batch_id BIGINT REFERENCES anchor_batches(batch_id),
    error_type VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    retry_attempt INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Nowa tabela anchor_reconciliation_log
CREATE TABLE anchor_reconciliation_log (
    id SERIAL PRIMARY KEY,
    run_at TIMESTAMP NOT NULL,
    batches_checked INT NOT NULL,
    matches INT NOT NULL,
    mismatches INT NOT NULL,
    success BOOLEAN NOT NULL
);
```

### Kluczowe komponenty

#### 1. BatchStatus Enum

```csharp
public enum BatchStatus
{
    Collecting,    // Zbieranie assetów
    Building,      // Budowanie Merkle tree
    Sending,       // Wysyłanie TX
    Confirming,    // Czekanie na confirm
    Done,          // Sukces
    Failed,        // Błąd - retry
    Abandoned,     // Po 4 retries
    Orphaned       // TX ok, DB fail
}
```

#### 2. RetryPolicy

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
}
```

#### 3. Orphaned Prevention

```csharp
// Kluczowa sekwencja - zapisz TxHash PRZED confirmation
batch.TxHash = await SendTransaction(batch);
await _db.SaveChangesAsync();  // <-- Zapisz natychmiast!
await WaitForConfirmation(batch.TxHash);
batch.Status = BatchStatus.Done;
await _db.SaveChangesAsync();
```

### NuGet packages

```xml
<!-- Hangfire dla scheduled jobs -->
<PackageReference Include="Hangfire" Version="1.8.*" />
<PackageReference Include="Hangfire.PostgreSql" Version="1.20.*" />

<!-- Email alerts -->
<PackageReference Include="MailKit" Version="4.3.*" />
```

### Konfiguracja (appsettings.json)

```json
{
  "Anchoring": {
    "MaxRetries": 4,
    "RetryDelaysMinutes": [0, 1, 5, 30]
  },
  "Reconciliation": {
    "Enabled": true,
    "RunAtUtcHour": 3
  },
  "Alerts": {
    "Enabled": true,
    "EmailTo": ["admin@trve.io"],
    "SmtpHost": "smtp.example.com",
    "SmtpPort": 587
  }
}
```

### Testy do napisania

| Test | Opis |
|------|------|
| `RetryPolicy_ReturnsCorrectDelays` | Sprawdź delay dla każdego attempt |
| `BatchService_RetriesOnNetworkError` | Symuluj network error, sprawdź retry |
| `BatchService_AbandonAfterMaxRetries` | Po 4 błędach status = Abandoned |
| `BatchService_MarksOrphanedOnDbFail` | TX ok + DB fail = Orphaned |
| `ReconciliationJob_DetectsMismatch` | Wykrywa różnicę DB vs blockchain |
| `AlertService_SendsOnCritical` | Email wysyłany dla critical |

### Dokumentacja
- Strategia: [ERROR-HANDLING.md](./ERROR-HANDLING.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Krok 4: Frontend UI

### Co robimy
- Badge weryfikacji na kartach assetów
- Strona szczegółów assetu z Merkle proof
- Publiczna strona weryfikacji `/verify/{assetId}`
- Admin dashboard z blockchain stats

### Komponenty do utworzenia
```
src/components/
├── blockchain/
│   ├── VerificationBadge.tsx    - badge "Verified on Blockchain"
│   ├── MerkleProofDisplay.tsx   - szczegóły proof
│   └── BlockchainStats.tsx      - statystyki dla admina
```

### Nowe strony
```
src/pages/
├── VerifyPage.tsx               - publiczna weryfikacja
└── app/
    └── AssetDetailPage.tsx      - szczegóły z blockchain info
```

---

## Szacowane koszty (Faza 1)

| Operacja | Koszt |
|----------|-------|
| Deploy kontraktu | ~$0.03 |
| Daily anchor (1x/dzień) | ~$0.003 |
| Roczny koszt operacyjny | ~$1.10 |

---

## Co już mamy gotowe

### Dokumentacja
- [x] BLOCKCHAIN-ARCHITECTURE.md - architektura systemu
- [x] SMART-CONTRACT.md - kod Solidity
- [x] DEPLOYMENT-GUIDE.md - instrukcja deploy
- [x] BACKEND-INTEGRATION.md - konfiguracja backendu
- [x] ERROR-HANDLING.md - obsługa błędów, retry, recovery
- [x] MAINNET-MIGRATION.md - przejście na produkcję
- [x] TROUBLESHOOTING.md - rozwiązywanie problemów
- [x] BLOCKCHAIN-EVOLUTION.md - roadmapa (Anchoring → IPFS → NFT)

### Frontend
- [x] WhitepaperPage z roadmapą i Genesis Asset
- [x] LandingPage z roadmapą
- [x] Tłumaczenia EN/PL

---

## Genesis Asset

Po ukończeniu Kroku 2 (deploy), pierwszym zakotwiczonym assetem będzie:

```
Asset ID: TRVE-GENESIS-001
Type: Document
Name: TRVE Whitepaper (EN + PL)
```

To potwierdzi działanie systemu i będzie dowodem dla inwestorów.

---

## Następne kroki po Fazie 1

Po zakończeniu Fazy 1, przechodzimy do:

| Faza | Co | Kiedy |
|------|-----|-------|
| **Faza 2** | NFT-ready data structure, QR codes, API | Po walidacji Fazy 1 |
| **Faza 3** | IPFS integration | Q2-Q3 2025 |
| **Faza 4** | NFT per asset | Q4 2025 |

Szczegóły: [BLOCKCHAIN-EVOLUTION.md](./BLOCKCHAIN-EVOLUTION.md)

---

## Notatki

*Miejsce na notatki podczas implementacji:*

- 2025-01-31: Dodano ERROR-HANDLING.md z kompletną strategią obsługi błędów
- 2025-01-31: Dodano krok 3.2 - szczegółowy plan implementacji error handling w backendzie

---

**Ostatnia aktualizacja:** 2025-01-31
