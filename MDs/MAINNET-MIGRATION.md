# TRVE Mainnet Migration

Przewodnik przejścia z Polygon Amoy (testnet) na Polygon Mainnet.

---

## Kiedy przejść na Mainnet?

### Checklist gotowości

- [ ] Stabilne działanie na testnet przez min. 2 tygodnie
- [ ] Brak błędów w anchoringu
- [ ] Przetestowane scenariusze awaryjne
- [ ] Security audit (zalecany)
- [ ] Wystarczające środki MATIC na mainnet
- [ ] Monitoring i alerting skonfigurowany
- [ ] Backup procedury ustalone

---

## Koszty

### Szacunkowe koszty (Polygon Mainnet)

| Operacja | Gas | Koszt (~50 gwei) | Koszt (~100 gwei) |
|----------|-----|------------------|-------------------|
| `anchorMerkleRoot` | ~80,000 | ~$0.003 | ~$0.006 |
| `verifyMerkleRoot` | 0 (view) | FREE | FREE |
| Deploy kontraktu | ~800,000 | ~$0.03 | ~$0.06 |

### Roczny koszt przy 1 batch/dzień

```
365 dni × $0.003 = ~$1.10/rok (przy 50 gwei)
365 dni × $0.006 = ~$2.20/rok (przy 100 gwei)
```

### Porównanie z innymi sieciami

| Sieć | Koszt anchor | Roczny koszt |
|------|--------------|--------------|
| Ethereum Mainnet | ~$5-50 | ~$1,825-$18,250 |
| **Polygon** | ~$0.003 | **~$1.10** |
| Arbitrum | ~$0.01 | ~$3.65 |
| Base | ~$0.005 | ~$1.83 |

---

## Kroki migracji

### 1. Deploy nowego kontraktu na Mainnet

```bash
# W hardhat.config.js - sieć "polygon" już skonfigurowana
npx hardhat run scripts/deploy.js --network polygon
```

### 2. Zmień konfigurację backendu

```bash
export BLOCKCHAIN__RpcUrl="https://polygon-rpc.com"
export BLOCKCHAIN__AnchorContractAddress="0xNOWY_ADRES_MAINNET"
export BLOCKCHAIN__ChainId=137
```

Lub w `appsettings.Production.json`:

```json
{
  "Blockchain": {
    "RpcUrl": "https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY",
    "AnchorContractAddress": "0xNOWY_ADRES_MAINNET",
    "ChainId": 137,
    "GasLimit": 200000,
    "Enabled": true
  }
}
```

### 3. Autoryzuj backend na mainnet

Jeśli używasz innego adresu niż deployer:

```bash
npx hardhat run scripts/authorize.js --network polygon
```

### 4. Zrestartuj backend

```bash
# Docker
docker-compose restart api

# lub systemd
sudo systemctl restart trve-api
```

---

## RPC Endpoints dla Mainnet

| Provider | URL | Limit | Zalecany |
|----------|-----|-------|----------|
| Polygon Official | `https://polygon-rpc.com` | Rate limited | Nie dla produkcji |
| **Alchemy** | `https://polygon-mainnet.g.alchemy.com/v2/KEY` | 300M compute/month free | ✅ Tak |
| **Infura** | `https://polygon-mainnet.infura.io/v3/KEY` | 100k requests/day free | ✅ Tak |
| QuickNode | Custom URL | Płatny | Dla high volume |

### Rekomendacja

Użyj **Alchemy** lub **Infura** z własnym API key:
- Lepszy uptime
- Wyższe limity
- Wsparcie techniczne
- Monitoring

### Konfiguracja Alchemy

1. Zarejestruj się na https://www.alchemy.com/
2. Utwórz nową aplikację (Polygon Mainnet)
3. Skopiuj API key
4. Użyj URL: `https://polygon-mainnet.g.alchemy.com/v2/TWÓJ_KEY`

---

## Optymalizacje kosztów

### 1. Batch więcej rekordów

Jeden Merkle root może zawierać tysiące rekordów. Koszt pozostaje taki sam.

```
1 rekord = $0.003
1000 rekordów = $0.003
10000 rekordów = $0.003
```

### 2. Dynamiczny gas price

Backend automatycznie pobiera aktualną cenę gasu:

```csharp
var gasPrice = await _web3.Eth.GasPrice.SendRequestAsync();
```

### 3. Off-peak hours

Anchoring o 2:00 UTC to zazwyczaj niższe ceny gasu.

### 4. Monitoring kosztów

Ustaw alerty na:
- Wysokie ceny gasu (> 100 gwei)
- Niski balans MATIC (< 0.1 MATIC)
- Failed transactions

---

## Bezpieczeństwo produkcyjne

### Klucz prywatny

- **NIE** przechowuj w kodzie ani w Git
- Używaj Azure Key Vault / AWS Secrets Manager / HashiCorp Vault
- Rozważ multisig dla wysokich wartości

### Multisig (opcjonalne)

Dla dodatkowego bezpieczeństwa:

1. Utwórz Gnosis Safe na Polygon
2. Przekaż ownership kontraktu do Safe
3. Wymagaj 2/3 lub 3/5 podpisów dla zmian

### Monitoring

- Ustaw alerty na failed transactions
- Monitoruj balans MATIC
- Śledź gas price trends

---

## Rollback plan

Jeśli coś pójdzie nie tak:

### 1. Przywróć testnet

```bash
export BLOCKCHAIN__RpcUrl="https://rpc-amoy.polygon.technology"
export BLOCKCHAIN__AnchorContractAddress="0xSTARY_ADRES_TESTNET"
export BLOCKCHAIN__ChainId=80002
```

### 2. Wyłącz anchoring tymczasowo

```bash
export BLOCKCHAIN__Enabled=false
```

### 3. Sprawdź logi

```bash
docker logs trve-api --tail 100
```

---

## Weryfikacja po migracji

### 1. Health check

```bash
curl https://api.trve.io/api/verification/health
```

### 2. Test anchoring

```bash
curl -X POST https://api.trve.io/api/admin/anchoring/run \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3. Sprawdź na Polygonscan

`https://polygonscan.com/address/ADRES_KONTRAKTU`

---

## Powiązane dokumenty

- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - Podstawowy deployment
- [Troubleshooting](./TROUBLESHOOTING.md) - Rozwiązywanie problemów
- [Backend Integration](./BACKEND-INTEGRATION.md) - Konfiguracja backendu

---

**Ostatnia aktualizacja:** 2025-01-29
