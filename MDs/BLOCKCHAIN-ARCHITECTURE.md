# TRVE Blockchain Architecture

Architektura integracji TRVE z blockchain Polygon.

---

## Przegląd systemu

### Jak działa blockchain w TRVE?

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          TRVE SYSTEM                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────────────┐   │
│  │  PostgreSQL │────▶│ Merkle Tree  │────▶│  Polygon Blockchain     │   │
│  │  (dane)     │     │ (batch)      │     │  (Merkle root + proof)  │   │
│  └─────────────┘     └──────────────┘     └─────────────────────────┘   │
│        │                    │                        │                   │
│        ▼                    ▼                        ▼                   │
│   RecordHash          MerkleProof              TransactionHash           │
│   (SHA256)            (JSON path)              (on-chain)                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Blockchain jako notariusz

Blockchain **NIE** przechowuje danych użytkowników. Przechowuje tylko:

| Element | Opis |
|---------|------|
| **Merkle Root** | Hash reprezentujący grupę rekordów |
| **Timestamp** | Kiedy dane zostały zaanchorowane |
| **Record Count** | Ile rekordów w batchu |

To pozwala **udowodnić**, że dane istniały w określonym momencie bez ujawniania ich zawartości.

---

## Daily Anchoring Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DAILY ANCHORING FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  00:00 ─────────────────────────────────────────────────────────► 23:59 │
│     │                                                                    │
│     │  Użytkownicy tworzą assety                                        │
│     │  System oblicza hash każdego rekordu (SHA256)                     │
│     │                                                                    │
│     └─────────────────────────────────────────────────────────────────► │
│                                                                          │
│  02:00 UTC ─── DailyAnchoringJob ───────────────────────────────────────│
│     │                                                                    │
│     ├── 1. Zbiera wszystkie nowe hashe                                  │
│     ├── 2. Buduje Merkle Tree                                           │
│     ├── 3. Anchoruje root do smart contractu                            │
│     └── 4. Zapisuje proof dla każdego assetu                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Szczegóły procesu

1. **0:00-23:59** - Użytkownicy tworzą assety
   - Każdy asset otrzymuje unikalny hash (SHA256)
   - Hash obliczany z: danych assetu, metadanych, timestamp

2. **2:00 UTC** - DailyAnchoringJob wykonuje:
   - Zbiera wszystkie niezaanchorowane hashe
   - Buduje Merkle Tree z tych hashy
   - Wysyła Merkle Root do smart contractu na Polygon
   - Zapisuje Merkle Proof dla każdego assetu w bazie

---

## Merkle Tree

### Co to jest Merkle Tree?

Struktura danych pozwalająca efektywnie weryfikować integralność dużych zbiorów danych.

```
                    ┌─────────────┐
                    │ Merkle Root │  ← To zapisujemy w blockchain
                    │   (hash)    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        ┌─────┴─────┐             ┌─────┴─────┐
        │  Hash AB  │             │  Hash CD  │
        └─────┬─────┘             └─────┬─────┘
              │                         │
       ┌──────┴──────┐           ┌──────┴──────┐
       │             │           │             │
   ┌───┴───┐     ┌───┴───┐   ┌───┴───┐     ┌───┴───┐
   │Hash A │     │Hash B │   │Hash C │     │Hash D │
   └───────┘     └───────┘   └───────┘     └───────┘
       ↑             ↑           ↑             ↑
   Asset 1       Asset 2     Asset 3       Asset 4
```

### Merkle Proof

Aby udowodnić, że Asset 2 był w batchu, potrzebujemy tylko:
- Hash A (sibling)
- Hash CD (sibling na wyższym poziomie)

Z tych 2 hashy + Hash B możemy odtworzyć Merkle Root i porównać z tym zapisanym w blockchain.

---

## Weryfikacja assetu

### Flow weryfikacji

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Użytkownik │────▶│   Backend   │────▶│  Smart      │────▶│  Wynik      │
│   żąda      │     │  oblicza    │     │  Contract   │     │  VERIFIED   │
│   weryfikacji│     │  proof      │     │  sprawdza   │     │  lub NIE    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Co sprawdzamy?

1. **Lokalnie (backend):**
   - Czy hash assetu zgadza się z zapisanym
   - Czy Merkle Proof jest poprawny

2. **On-chain (smart contract):**
   - Czy Merkle Root istnieje w kontrakcie
   - Timestamp zaanchorowania

---

## Dlaczego Polygon?

| Cecha | Wartość |
|-------|---------|
| **Koszt** | ~$0.003 per batch anchor |
| **Szybkość** | 2-sekundowe bloki |
| **Kompatybilność** | Pełna kompatybilność z Ethereum |
| **Ekosystem** | Duża społeczność developerów |
| **Niezawodność** | Battle-tested infrastructure |

### Porównanie kosztów

| Sieć | Koszt anchor | Roczny koszt (1 batch/dzień) |
|------|--------------|------------------------------|
| Ethereum Mainnet | ~$5-50 | ~$1,825-$18,250 |
| **Polygon** | ~$0.003 | **~$1.10** |
| Arbitrum | ~$0.01 | ~$3.65 |
| Base | ~$0.005 | ~$1.83 |

---

## Bezpieczeństwo

### Co chroni dane?

1. **Kryptografia** - SHA256 hashe nie ujawniają danych źródłowych
2. **Immutability** - Raz zapisane w blockchain, nie można zmienić
3. **Decentralizacja** - Polygon to publiczny blockchain
4. **Merkle Proofs** - Matematyczny dowód przynależności do batcha

### Czego NIE robimy?

- Nie zapisujemy danych osobowych w blockchain
- Nie zapisujemy zdjęć/plików w blockchain
- Nie zapisujemy szczegółów assetu w blockchain

Zapisujemy **tylko hash** — dowód, że dane istniały.

---

## Powiązane dokumenty

- [Smart Contract](./SMART-CONTRACT.md) - Kod kontraktu Solidity
- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - Jak wdrożyć kontrakt
- [Blockchain Evolution](./BLOCKCHAIN-EVOLUTION.md) - Roadmapa: Anchoring → NFT

---

**Ostatnia aktualizacja:** 2025-01-29
