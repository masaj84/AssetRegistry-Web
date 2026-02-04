# TRVE Blockchain Evolution

Ścieżka ewolucji technologii: Anchoring → IPFS → NFT

---

## Wizja

TRVE rozwija się stopniowo w kierunku pełnej decentralizacji. Zaczynamy od prostego, sprawdzonego rozwiązania i ewoluujemy wraz z potrzebami użytkowników.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRVE BLOCKCHAIN EVOLUTION                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  FAZA 1 (MVP)          FAZA 2              FAZA 3-4                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐             │
│  │   Merkle     │────▶│  IPFS +      │────▶│    NFT       │             │
│  │  Anchoring   │     │  Anchoring   │     │  per Asset   │             │
│  └──────────────┘     └──────────────┘     └──────────────┘             │
│        │                    │                    │                       │
│        ▼                    ▼                    ▼                       │
│   Hash on-chain        Data on IPFS         Full ownership              │
│   ~$0.003/batch       + hash on-chain        on-chain                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Faza 1: Merkle Anchoring

**Status:** ✅ Aktywna (MVP)

### Jak działa?

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  PostgreSQL │────▶│ Merkle Tree  │────▶│  Polygon    │
│  (dane)     │     │ (daily batch)│     │  (root)     │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Charakterystyka

| Aspekt | Wartość |
|--------|---------|
| Przechowywanie danych | PostgreSQL (centralne) |
| Co zapisujemy w blockchain | Tylko Merkle root |
| Koszt per batch | ~$0.003 |
| Rekordów per batch | Nieograniczona liczba |
| Częstotliwość | 1x dziennie (2:00 UTC) |

### Dlaczego tak zaczynamy?

- ✅ Niski koszt operacyjny
- ✅ Szybkie wdrożenie
- ✅ Pełna funkcjonalność weryfikacji
- ✅ Dane użytkowników pod kontrolą
- ✅ Proste skalowanie

---

## Faza 2: IPFS + Anchoring

**Status:** 📋 Planowana

### Jak działa?

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  PostgreSQL │────▶│    IPFS     │────▶│ Merkle Tree  │────▶│  Polygon    │
│  (dane)     │     │  (storage)  │     │ (CID + hash) │     │  (root)     │
└─────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
                          │
                          ▼
                    CID (content hash)
                    ipfs://Qm...
```

### Co się zmienia?

| Przed (Faza 1) | Po (Faza 2) |
|----------------|-------------|
| Dane tylko w PostgreSQL | Dane też na IPFS |
| Brak permalinków | Permanentne CID linki |
| Centralne storage | Zdecentralizowane storage |
| - | NFT-ready metadata structure |

### NFT-ready struktura danych

Już teraz przygotowujemy strukturę zgodną z ERC-721:

```json
{
  "name": "TRVE Asset #TVA-2025-00001",
  "description": "Verified product with immutable history",
  "image": "ipfs://Qm.../image.jpg",
  "external_url": "https://trve.io/v/TVA-2025-00001",
  "attributes": [
    { "trait_type": "Category", "value": "Vehicle" },
    { "trait_type": "Verified Events", "value": 12 },
    { "trait_type": "Created", "value": "2025-01-15" },
    { "trait_type": "Status", "value": "Verified" }
  ]
}
```

### Korzyści

- 📁 Zdecentralizowane przechowywanie
- 🔗 Permanentne linki do danych (CID)
- 🎨 Gotowość na NFT (metadata już na IPFS)
- 🌐 Dostępność przez IPFS gateways

---

## Faza 3-4: NFT per Asset

**Status:** 📋 Planowana

### Jak działa?

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Asset     │────▶│    IPFS     │────▶│    NFT      │
│   Data      │     │  Metadata   │     │  (ERC-721)  │
└─────────────┘     └─────────────┘     └─────────────┘
                          │                    │
                          ▼                    ▼
                     tokenURI()           ownerOf()
                    (metadata)           (on-chain)
```

### Charakterystyka

| Aspekt | Wartość |
|--------|---------|
| Każdy asset | Osobny NFT (ERC-721) |
| Ownership | Zapisany on-chain |
| Transfer własności | = Transfer NFT |
| Wallet integration | Opcjonalna (MetaMask, etc.) |

### Nowe możliwości

- 🔐 **On-chain proof of ownership** - właściciel zapisany w blockchain
- 🔄 **Transfery bez pośrednika** - P2P transfer NFT
- 🏪 **Integracja z marketplace'ami** - OpenSea, Rarible, etc.
- 👛 **Wallet-based auth** - logowanie przez wallet (opcjonalne)

### Przykład NFT

```solidity
// TrveAssetNFT.sol (przykład)
contract TrveAssetNFT is ERC721, Ownable {

    struct AssetData {
        string assetId;      // "TVA-2025-00001"
        string category;     // "Vehicle"
        uint256 createdAt;
        string metadataURI;  // "ipfs://Qm..."
    }

    mapping(uint256 => AssetData) public assets;

    function mint(
        address to,
        string memory assetId,
        string memory category,
        string memory metadataURI
    ) external onlyMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        assets[tokenId] = AssetData({
            assetId: assetId,
            category: category,
            createdAt: block.timestamp,
            metadataURI: metadataURI
        });

        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string) {
        return assets[tokenId].metadataURI;
    }
}
```

---

## Genesis Asset — Whitepaper w blockchain

### Koncept

Pierwszy asset zarejestrowany w TRVE to sam whitepaper (EN + PL). To dowód, że system działa — "eating our own dog food".

### Asset ID

```
TRVE-GENESIS-001
```

### Struktura

```
┌─────────────────────────────────────────────────────────────────────┐
│  TRVE_ GENESIS ASSET                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ASSET_ID:     TRVE-GENESIS-001                                      │
│  TYPE:         Document                                              │
│  NAME:         TRVE Whitepaper                                       │
│                                                                      │
│  FILES:                                                              │
│  ├── whitepaper-en.pdf  →  SHA256: [hash]                           │
│  └── whitepaper-pl.pdf  →  SHA256: [hash]                           │
│                                                                      │
│  STATUS:       ✓ VERIFIED (first batch)                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Ewolucja Genesis Asset przez fazy

| Faza | Co się dzieje |
|------|---------------|
| **1** | Hash PDF → Merkle root → Polygon |
| **2** | Upload na IPFS, CID w metadanych |
| **3** | Pełna decentralizacja |
| **4** | Mint jako "Genesis Whitepaper NFT" |

### Dlaczego to działa marketingowo?

1. **Proof of concept** — Inwestorzy widzą działający produkt
2. **Eating our own dog food** — Używamy tego, co sprzedajemy
3. **Weryfikowalny** — `trve.io/verify/TRVE-GENESIS-001`
4. **Historia od dnia zero** — Każda wersja whitepaper zapisana

### Pitch dla inwestorów

> "Zanim poprosiliśmy kogokolwiek o zaufanie do TRVE, sami mu zaufaliśmy.
> Nasz whitepaper był pierwszym assetem zakotwiczonym w blockchain.
> Możesz to zweryfikować teraz — o to właśnie chodzi."

---

## Backwards Compatibility

### Gwarancje

- ✅ Stare assety (Faza 1) pozostają weryfikowalne
- ✅ Migracja do NFT jest opcjonalna dla użytkownika
- ✅ API zachowuje kompatybilność wsteczną
- ✅ Genesis Asset przechodzi przez wszystkie fazy jako przykład

### Jak to działa?

```
Faza 1 assety:
  └── Weryfikacja przez Merkle proof (działa zawsze)

Faza 2 assety:
  ├── Weryfikacja przez Merkle proof
  └── + dostęp przez IPFS CID

Faza 3-4 assety:
  ├── Weryfikacja przez Merkle proof
  ├── + dostęp przez IPFS CID
  └── + NFT ownership on-chain
```

---

## Timeline (orientacyjny)

| Faza | Status | Opis |
|------|--------|------|
| **Faza 1** | ✅ MVP | Merkle Anchoring na Polygon |
| **Faza 2** | 📋 Q2 2025 | IPFS + NFT-ready structure |
| **Faza 3** | 📋 Q3 2025 | Decentralized storage |
| **Faza 4** | 📋 Q4 2025 | NFT minting, wallet integration |

---

## Powiązane dokumenty

- [Blockchain Architecture](./BLOCKCHAIN-ARCHITECTURE.md) - Aktualna architektura
- [Smart Contract](./SMART-CONTRACT.md) - Kod kontraktu
- [CONTENT.md](./CONTENT.md) - Sekcja Genesis Asset

---

**Ostatnia aktualizacja:** 2025-01-29
