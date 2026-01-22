# FAZY PROJEKTU – ARCHITEKTURA BLOCKCHAIN (HYBRID)

---

## FAZA 0 — FOUNDATION (MVP)

### Cel
Zapewnienie kryptograficznej niezmienności danych przy minimalnym koszcie i ryzyku.

### Zakres
- PostgreSQL jako system of record
- Hash per rekord
- Merkle Tree (batch dzienny)
- Anchoring Merkle root do blockchaina
- Merkle proof storage w bazie danych
- Publiczny mechanizm weryfikacji (API)

### Blockchain
- Polygon Amoy (test)
- Prosty kontrakt typu Anchor / timestamping

### Rezultat
- Każdy wpis posiada dowód integralności
- Brak logiki biznesowej on-chain
- Blockchain pełni rolę notariusza

### Kryterium przejścia
- Stabilne MVP
- Działająca weryfikacja proof
- Pierwsi użytkownicy / dane produkcyjne

---

## FAZA 1 — TRUST LEVELS

### Cel
Rozróżnienie źródeł danych i poziomów zaufania.

### Zakres
- Źródło wpisu: `self / authority / system`
- Metadane zaufania przypisane do rekordów
- Wyraźne oznaczenia w UI
- Brak smart contractów biznesowych

### Blockchain
- Nadal tylko anchoring Merkle root

### Rezultat
- Czytelna wiarygodność danych
- Gotowość do współpracy B2B
- Fundament pod Level 2 i Level 3 trust

### Kryterium przejścia
- Dane od podmiotów zewnętrznych
- Zapytania o twardy dowód / audyt
- Rozmowy B2B

---

## FAZA 2 — ON-CHAIN RECORDS

### Cel
Eliminacja pojedynczego punktu zaufania dla wybranych zdarzeń.

### Zakres
- Pierwszy biznesowy smart contract
- Append-only ledger (brak update/delete)
- Zapis hashy rekordów + źródło
- Tylko krytyczne zdarzenia on-chain

### Blockchain
- Polygon Mainnet

### Rezultat
- Niezależny, publiczny dowód zapisu
- Możliwość użycia w sporach i audytach
- Wejście w LEVEL 2 trust

### Kryterium przejścia
- Płatny klient
- Wiele niezależnych stron zapisujących dane
- Wymagania prawne / audytowe

---

## FAZA 3 — CERTYFIKATY / NFT (OPCJONALNA)

### Cel
Monetyzacja oraz dostarczenie weryfikowalnego dokumentu.

### Zakres
- NFT mint on-demand
- Snapshot danych (hash + metadane)
- IPFS / Arweave jako storage
- Powiązanie z rekordami on-chain

### Uwaga
NFT nie jest core systemu – jest opakowaniem dowodu.

### Rezultat
- Certyfikaty możliwe do publicznej weryfikacji
- Produkt premium dla klientów

### Kryterium przejścia
- Zapotrzebowanie rynkowe
- Gotowość do skali B2B

---

## FAZA 4 — ENTERPRISE / FACTORY

### Cel
Skalowanie systemu na wiele organizacji.

### Zakres
- Factory Contract
- Registry Contract
- Kontrakt per organizacja
- Izolacja danych i odpowiedzialności
- Audytowalność i compliance

### Klienci docelowi
- Floty
- Dealerzy
- Ubezpieczyciele
- Integracje systemowe

### Rezultat
- Enterprise-grade blockchain architecture
- Możliwość BYOC (Bring Your Own Contract)

---

## ZASADA NADRZĘDNA

Blockchain jest używany wyłącznie tam, gdzie backend przestaje być neutralnym źródłem zaufania.
