# TRVE — Landing Page Content (MVP)

Plik do pracy nad tekstami marketingowymi.
Po zmianach zaktualizuj `src/context/LanguageContext.tsx`.

---

## BRAND IDENTITY — TRVE

### Nazwa i wymowa
- **Nazwa:** TRVE (z podkreśleniem: TRVE_)
- **Wymowa:** jak angielskie "TRUE" (prawda)
- **Domena:** trve.io
- **Email:** hello@trve.io

### Estetyka wizualna
- **Styl:** Digital Brutalism / Terminal Core
- **Fonty:** Monospace (terminal aesthetic)
- **Kolory:** Czarny, biały, cyan/orange akcenty

### Znaczenie podkreślenia "_"
Podkreślenie na końcu TRVE_ to nie tylko element wizualny — ma znaczenie:
- Reprezentuje "kursor terminala" — system gotowy do działania
- Symbolizuje "placeholder" — miejsce na Twoje dane
- W programowaniu podkreślenie to zmienna prywatna/wewnętrzna — sugeruje bezpieczeństwo
- Podkreślenie to "Immutable Base" — fundament, na którym budujesz

### ASCII Logo
```
▀█▀ █▀█ █ █ █▀▀
 █  █▀▄ ▀▄▀ ██▄
```
Alternatywnie w terminalu:
```
TRVE_
```

### Taglines / Hasła marketingowe

| Context | EN | PL |
|---------|----|----|
| Primary | System ready. Truth secured. | System gotowy. Prawda zabezpieczona. |
| Short | Immutable truth. | Niezmienna prawda. |
| Technical | Your data. Verified forever. | Twoje dane. Zweryfikowane na zawsze. |
| Brand promise | Once recorded, never lost. | Raz zapisane, nigdy nie zginie. |

---

## GENESIS ASSET — WHITEPAPER W BLOCKCHAIN

### Koncept

Pierwszy asset zarejestrowany w TRVE to sam whitepaper (wersja EN + PL). To nie jest tylko symbol — to dowód, że system działa.

> "Naszym pierwszym klientem byliśmy my sami."

### Dlaczego to działa marketingowo

1. **Proof of concept** — Inwestorzy widzą działający produkt, nie prezentację
2. **Eating our own dog food** — Używamy tego, co sprzedajemy
3. **Weryfikowalny** — Każdy może sprawdzić: `trve.io/verify/TRVE-GENESIS-001`
4. **Historia od dnia zero** — Whitepaper ewoluuje, każda wersja jest zapisana

### Struktura Genesis Asset

```
┌─────────────────────────────────────────────────────────────────────┐
│  TRVE_ GENESIS ASSET                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ASSET_ID:     TRVE-GENESIS-001                                      │
│  TYPE:         Document                                              │
│  NAME:         TRVE Whitepaper                                       │
│  CREATED:      [data pierwszego batcha]                              │
│                                                                      │
│  FILES:                                                              │
│  ├── whitepaper-en.pdf  →  SHA256: 0x7f3a...                        │
│  └── whitepaper-pl.pdf  →  SHA256: 0x8b2c...                        │
│                                                                      │
│  MERKLE_ROOT:  0xabcd...                                             │
│  TX_HASH:      0x1234... (Polygon)                                   │
│                                                                      │
│  STATUS:       ✓ VERIFIED                                            │
│  INTEGRITY:    BLOCKCHAIN ANCHORED                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Ewolucja Genesis Asset (zgodnie z roadmapą)

| Faza | Co się dzieje z Genesis Asset |
|------|-------------------------------|
| **Faza 1** | Hash whitepaper → Merkle tree → Polygon (anchoring) |
| **Faza 2** | Pliki uploadowane na IPFS, CID w metadanych |
| **Faza 3** | Pełna decentralizacja — IPFS + anchoring |
| **Faza 4** | Mint jako NFT — "Genesis Whitepaper NFT" (kolekcjonerski) |

### Strona weryfikacji Genesis Asset

Specjalna strona: `trve.io/genesis` lub `trve.io/verify/TRVE-GENESIS-001`

**Elementy:**
- Podgląd whitepaper (EN/PL toggle)
- Link do transakcji na Polygonscan
- Historia wersji (jeśli whitepaper był aktualizowany)
- Przycisk "Verify on blockchain"
- Badge: "First asset ever registered in TRVE"

### Teksty marketingowe

**EN:**
> Our whitepaper isn't just a document — it's our first verified asset.
> Check it yourself: every version, every update, permanently recorded on blockchain.

**PL:**
> Nasz whitepaper to nie tylko dokument — to nasz pierwszy zweryfikowany asset.
> Sprawdź sam: każda wersja, każda aktualizacja, zapisana na zawsze w blockchain.

### Pitch dla inwestorów

**EN:**
> "Before we asked anyone to trust TRVE, we trusted it ourselves.
> Our whitepaper was the first asset anchored on blockchain.
> You can verify it right now — that's the point."

**PL:**
> "Zanim poprosiliśmy kogokolwiek o zaufanie do TRVE, sami mu zaufaliśmy.
> Nasz whitepaper był pierwszym assetem zakotwiczonym w blockchain.
> Możesz to zweryfikować teraz — o to właśnie chodzi."

---

### Użycie w marketingu

#### 1. Strona główna / Portal
- Wybierz stronę główną: TRVE. (gdzie ten podświetlony punkt mrugnął podczas ładowania)
- Logo z animacją wejścia: Terminal Palety (cyan na czarnym tle)
- Tagline pod logo: "System gotowy. Prawda zabezpieczona."

#### 2. Social Media (X / Twitter)
- Username: @TRVE_io
- Bio format: "TRVE. — Immutable product registry. Your truth, verified forever."
- Kropka jest w innym kolorze (np. podkreślony cyan)
- Posty używają monospace/terminal aesthetic

#### 3. Komunikacja tekstowa
- Kiedy Yeet bot (Claude) + Click + Shield występują razem: używaj jako "prawdę" systemu
- Używaj skrótów jak terminalu: "TRVE." kończy się kropką
- "To jest TRVE." = "To jest prawda" (gra słów)

#### 4. Animacje na stronie (User Experience)
- Kropka powinna "pulsować" jak kursor terminala
- Wejście strony: efekt "boot systemu"
- Loading states: monospace counting

### Paleta kolorów

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | White (#ffffff) | Deep Navy (#0a0a0f) |
| Text | Black (#000000) | White/Gray (#f0f0f0) |
| Accent Primary | Cyan (#0ea5e9) | Orange (#fb923c) |
| Accent Secondary | — | Purple (#a855f7) |
| Accent Tertiary | — | Magenta (#e879f9) |

### Brand Voice (ton komunikacji)
- **Techniczny ale przystępny** — nie zakładamy wiedzy o blockchain
- **Pewny siebie** — "prawda" jest w nazwie
- **Minimalistyczny** — krótkie zdania, bez nadmiaru słów
- **Terminal-inspired** — może używać formatowania jak `code` lub → strzałek

---

## RAPORT WERYFIKACJI PRODUKTU

### Format wyświetlania raportu

Gdy użytkownik generuje raport o zabezpieczeniu/weryfikacji assetu, wyświetl w stylu terminala:

```
┌─────────────────────────────────────┐
│  TRVE_                              │
│  ─────────────────────────────────  │
│                                     │
│  ASSET_ID:   [ID produktu]          │
│  VERIFIED:   [timestamp]            │
│  INTEGRITY:  [hash]                 │
│                                     │
│  Status: ✓ VERIFIED                 │
│                                     │
└─────────────────────────────────────┘
```

### Warianty statusu

| Status | EN | PL | Kolor |
|--------|----|----|-------|
| Verified | ✓ VERIFIED | ✓ ZWERYFIKOWANY | Green/Cyan |
| Pending | ◐ PENDING | ◐ OCZEKUJE | Yellow/Orange |
| Stolen | ⚠ REPORTED STOLEN | ⚠ ZGŁOSZONY JAKO SKRADZIONY | Red |
| Unverified | ✗ NOT VERIFIED | ✗ NIEZWERYFIKOWANY | Gray |

### Jak to wyświetlać?

1. **Na stronie produktu** — jako "pieczęć" weryfikacji w rogu
2. **W eksporcie PDF** — pełny raport z QR kodem
3. **Przy transferze własności** — potwierdzenie zmiany właściciela
4. **W komunikacji** — skrócona wersja do udostępniania

### Skrócony format (do social media / udostępniania)

```
TRVE_ ✓
Asset #[ID] | Verified [date]
trve.io/verify/[ID]
```

### Elementy raportu pełnego

| Element | Opis | Przykład |
|---------|------|----------|
| ASSET_ID | Unikalny identyfikator produktu | `TVA-2025-00001` |
| VERIFIED | Data i czas ostatniej weryfikacji | `2025-01-28 12:34:56 UTC` |
| INTEGRITY | Hash blockchain potwierdzający niezmienność | `0x7f3a...8b2c` |
| OWNER | Aktualny właściciel (opcjonalnie zasłonięty) | `user***@***.com` |
| HISTORY | Liczba zdarzeń w historii | `12 events` |
| CREATED | Data pierwszej rejestracji | `2024-06-15` |

### Użycie w różnych kontekstach

**Terminal / CLI:**
```bash
$ trve verify TVA-2025-00001
✓ Asset verified
  Integrity: 0x7f3a...8b2c
  Last update: 2025-01-28
```

**API Response:**
```json
{
  "status": "verified",
  "asset_id": "TVA-2025-00001",
  "integrity": "0x7f3a8b2c...",
  "verified_at": "2025-01-28T12:34:56Z"
}
```

**QR Code** zawiera link: `https://trve.io/v/[ASSET_ID]`

### Stopka raportu (Bot / AI generated)

Kiedy Twój bot (np. Claude, asystent AI) wygeneruje raport o zabezpieczonym aktywie, może go kończyć stopką:

```
──────────────────────────────────
ASSET_ID: 0x567...321
INTEGRITY VERIFIED
GUARDED BY: TRVE_
──────────────────────────────────
```

**Warianty stopki:**

| Kontekst | Format |
|----------|--------|
| Pełna weryfikacja | `INTEGRITY VERIFIED` |
| Częściowa | `INTEGRITY PARTIAL` |
| Oczekuje | `INTEGRITY PENDING` |
| Błąd | `INTEGRITY FAILED` |

**Użycie w chatbotach / asystentach:**
- Dodawaj stopkę na końcu każdego raportu o aktywie
- "GUARDED BY: TRVE_" = pieczęć autentyczności
- Format monospace dla spójności wizualnej

---

## NAWIGACJA

| Key | EN | PL |
|------|-----|-----|
| nav.problem | Problem | Problem |
| nav.howItWorks | How it works | Jak dziala |
| nav.useCases | Use cases | Zastosowania |
| nav.faq | FAQ | FAQ |
| nav.demo | Demo | Demo |
| nav.login | Login | Zaloguj |
| nav.getStarted | Get started | Rozpocznij |

---

## HERO

### English
- **Badge:** Early Access
- **Title line 1:** Immutable history
- **Title line 2:** of your products
- **Subtitle:** TRVE is a registry for every valuable product, recorded on blockchain forever. Document purchases, services, repairs — once recorded, never lost.
- **Primary CTA:** Register for free
- **Secondary CTA:** See how it works →

### Polski
- **Badge:** Early Access
- **Tytuł linia 1:** Niezmienna historia
- **Tytuł linia 2:** Twoich produktów
- **Podtytuł:** TRVE to rejestr każdego wartościowego produktu, zapisany w blockchain na zawsze. Dokumentuj zakupy, serwisy, naprawy — raz zapisane, nigdy nie znikną.
- **CTA główny:** Zarejestruj za darmo
- **CTA dodatkowy:** Zobacz jak działa →

---

## TRUST STATS (Hero section)

| Key | EN | PL |
|------|-----|-----|
| stats.immutable | Immutable | Niezmienny |
| stats.transparent | Transparent | Przejrzysty |
| stats.accessible | Accessible | Dostępny |

Wyświetlane jako: ∞ Immutable | 100% Transparent | 24/7 Accessible

---

## PROBLEM & ROZWIĄZANIE

### Section Header

| EN | PL |
|----|-----|
| Problem & Solution | Problem i Rozwiązanie |

---

### PROBLEM

**English**
- **Label:** Problem
- **Title:** Products lose their history over time
- **Subtitle:** Product data disappears, documents get lost, and history cannot be verified.

**Polski**
- **Label:** Problem
- **Title:** Produkty tracą swoją historię w czasie
- **Subtitle:** Informacje o produkcie znikają, dokumenty giną, a historia nie jest weryfikowalna.

#### Problem Points

| # | EN Title | EN Desc | PL Title | PL Desc |
|---|----------|---------|----------|---------|
| 1 | Lower value | Unverified products lose market value. | Niższa wartość | Produkty bez historii są wyceniane niżej. |
| 2 | Time wasted | You waste time proving what happened. | Strata czasu | Tracisz czas na udowadnianie faktów. |
| 3 | No trust | There is no reliable product record. | Brak zaufania | Brak wiarygodnej historii produktu. |

---

### SOLUTION

**English**
- **Label:** Solution
- **Title:** TRVE: immutable product history
- **Subtitle:** Every product has a unique ID. Events are recorded on blockchain — they cannot be changed.

**Polski**
- **Label:** Rozwiązanie
- **Title:** TRVE: niezmienna historia produktu
- **Subtitle:** Każdy produkt ma unikalny identyfikator. Zdarzenia są zapisywane w blockchain — nie da się ich zmienić.

#### Solution Points

| # | EN Title | EN Desc | PL Title | PL Desc |
|---|----------|---------|----------|---------|
| 1 | Blockchain | Events are recorded on blockchain. | Blockchain | Zdarzenia zapisywane są w blockchain. |
| 2 | Immutability | No one can change or delete the data. | Niezmienność | Nikt nie może zmienić ani usunąć danych. |
| 3 | Verification | Anyone can verify full history. | Weryfikacja | Każdy może zweryfikować historię produktu. |

---

## HOW IT WORKS

### Header

| EN | PL |
|----|-----|
| How it works | Jak to działa |
| Three simple steps to immutable history | Trzy proste kroki do niezmiennej historii |

### Steps


| Step | EN Title | EN Desc | PL Title | PL Desc |
|------|----------|---------|----------|---------|
| 01 | Create product identity | Register product details, photos and proof of origin. | Utwórz tożsamość produktu | Zarejestruj dane produktu, zdjęcia i dowód pochodzenia. |
| 02 | Build product history | Add services, inspections, repairs and updates over time. | Buduj historię produktu | Dodawaj serwisy, przeglądy, naprawy i aktualizacje w czasie. |
| 03 | Verify or transfer ownership | Anyone can verify history. Ownership can be transferred to next owner. | Zweryfikuj lub przekaż własność | Każdy może sprawdzić historię. Własność można przekazać kolejnemu właścicielowi. |

---

## USE CASES

### Header

| EN | PL |
|----|-----|
| Use cases | Zastosowania |
| What products can have a TRVE history | Jakie produkty mogą mieć historię w TRVE |

---

### Product Categories

| Icon | EN Title | EN Desc | PL Title | PL Desc |
|-------|----------|---------|----------|---------|
| car | Vehicles | Service history, inspections, repairs. | Samochody | Historia serwisowa, przeglądy, naprawy. |
| watch | Watches | Proof of purchase, services, authenticity. | Zegarki | Dowód zakupu, serwisy, autentyczność. |
| art | Art | Provenance, exhibitions, ownership. | Sztuka | Proweniencja, wystawy, właściciele. |
| music | Instruments | Setup, services, usage history. | Instrumenty | Setup, serwisy, historia użycia. |
| box | Anything | Any product with value. | Cokolwiek | Każdy produkt, który ma wartość. |

---

## FOR MANUFACTURERS (B2B Section)

### Header

| EN | PL |
|----|-----|
| For manufacturers | Dla producentów |

### Description

**English:**
Manufacturers can create product identity at production stage and attach verified origin data from day one.

**Polski:**
Producenci mogą tworzyć tożsamość produktu już na etapie produkcji i dodawać zweryfikowane dane od pierwszego dnia.

---

### Manufacturer Use Cases

| # | EN Title | EN Desc | PL Title | PL Desc |
|---|----------|---------|----------|---------|
| 01 | Product identity | Each product gets unique blockchain identity at factory. | Tożsamość produktu | Każdy produkt dostaje unikalną tożsamość już w fabryce. |
| 02 | Proof of origin | Verified manufacturing data and certificates. | Dowód pochodzenia | Zweryfikowane dane produkcyjne i certyfikaty. |
| 03 | Anti-counterfeiting | Customers can verify if product is original. | Ochrona przed podróbkami | Klient może sprawdzić, czy produkt jest oryginalny. |
| 04 | Lifecycle tracking | Full visibility across servicing and resale. | Historia w całym cyklu życia | Pełna widoczność przez serwisy i kolejne sprzedaże. |
| 05 | Brand protection | Stolen or fake products damage brand reputation. | Ochrona marki | Kradzione i fałszywe produkty nie psują reputacji marki. |

---

### Summary

**EN:**
TRVE becomes a shared product record between manufacturer, owner and service partners.

**PL:**
TRVE staje się wspólnym rejestrem produktu dla producenta, właściciela i serwisów.

---

## SECURITY - PRODUCT OWNERSHIP & THEFT STATUS

### Header

| EN | PL |
|----|-----|
| Security | Security |
| Product ownership and theft status | Status własności i kradzieży produktu |

### Description

**English:**
Owner can report a product as stolen. The status becomes part of the product history and is visible during every verification.

**Polski:**
Właściciel może zgłosić produkt jako skradziony. Status staje się częścią historii produktu i jest widoczny przy każdej weryfikacji.

### Benefits

| EN | PL |
|----|-----|
| Protects buyers and manufacturers | Ochrona kupujących i producentów |
| Limits illegal resale | Ograniczenie nielegalnego obrotu |
| Increases trust in product history | Większe zaufanie do historii produktu |

### Note

| EN | PL |
|----|-----|
| Applies to all products registered in TRVE. | Dotyczy wszystkich produktów zarejestrowanych w TRVE. |

### Warning Badge

| EN | PL |
|----|-----|
| ITEM REPORTED STOLEN | PRZEDMIOT ZGŁOSZONY JAKO SKRADZIONY |
| This product has been reported as stolen by its owner. The status is permanently recorded on blockchain. | Ten produkt został zgłoszony jako skradziony przez właściciela. Status jest trwale zapisany w blockchain. |

---

## CONSTANTLY EVOLVING (po Security)

| Key | EN | PL |
|------|-----|-----|
| useCases.evolving | Constantly evolving | Ciągle się rozwijamy |
| useCases.evolvingDesc | New features and possibilities are added as the platform grows. This is just the beginning. | Nowe funkcje i możliwości pojawiają się wraz z rozwojem platformy. To dopiero początek. |

---

## ROADMAP

### Header

| EN | PL |
|----|-----|
| Roadmap | Roadmapa |
| Where we're heading | Gdzie zmierzamy |

---

### Phase 1 — Blockchain Anchoring

| EN | PL |
|----|-----|
| Blockchain anchoring | Zakotwiczenie w blockchain |
| Item registration | Rejestracja produktu |
| Merkle proof verification | Weryfikacja Merkle proof |
| Blockchain records | Zapis w blockchain |
| Public verification | Publiczna weryfikacja |
| QR / product ID | QR / identyfikator produktu |

---

### Phase 2 — Data & Integrations

| EN | PL |
|----|-----|
| Data & integrations | Dane i integracje |
| Manufacturer integrations | Integracje z producentami |
| Service center partnerships | Partnerstwa z serwisami |
| Certificates on-chain | Certyfikaty w blockchain |
| Ownership transfer | Transfer własności |
| NFT-ready data structure | Struktura danych gotowa na NFT |

---

### Phase 3 — Decentralized Storage

| EN | PL |
|----|-----|
| Decentralized storage | Zdecentralizowane przechowywanie |
| Stolen goods registry | Rejestr kradzionych produktów |
| Insurance integration | Integracje z ubezpieczycielami |
| Compliance & reporting | Compliance i raportowanie |
| Public APIs | Publiczne API |
| IPFS integration | Integracja IPFS |
| Decentralized asset storage | Zdecentralizowane przechowywanie danych |

---

### Phase 4 — NFT & Ownership

| EN | PL |
|----|-----|
| NFT & ownership | NFT i własność |
| Mobile apps | Aplikacje mobilne |
| AI verification | Weryfikacja AI |
| Fraud detection | Wykrywanie nadużyć |
| Global partnerships | Globalne partnerstwa |
| NFT for each asset | NFT dla każdego assetu |
| On-chain ownership transfers | Transfery własności on-chain |
| Wallet integration (optional) | Integracja z walletami (opcjonalna) |


---

## FAQ

### Header

| EN | PL |
|----|-----|
| FAQ | FAQ |
| Frequently asked questions | Często zadawane pytania |

### Q1

**Is it really free?**
MVP — yes, completely free. Test it and give feedback.

**Czy to naprawdę darmowe?**
MVP — tak, całkowicie za darmo. Testuj i dawaj feedback.

---

### Q2

**Do I need to understand blockchain?**
No. TRVE works like a normal app. Blockchain runs under the hood.

**Czy muszę znać blockchain?**
Nie. TRVE działa jak zwykła aplikacja. Blockchain jest pod spodem.

---

### Q3

**Can I register anything?**
Yes. Any product that has value.

**Czy mogę zarejestrować cokolwiek?**
Tak. Każdy produkt, który ma wartość.

---

### Q4

**Can I edit the history?**
No. Once recorded, it cannot be changed.

**Czy mogę edytować historię?**
Nie. Raz zapisane, nie da się zmienić.

---

## FINAL CTA

### English
- **Badge:** Get started now
- **Title:** Build immutable history of your products
- **Subtitle:** Free. No commitments. First 1000 items — free forever.
- **Primary CTA:** Register your first product
- **Secondary CTA:** See demo →

### Polski
- **Badge:** Rozpocznij teraz
- **Title:** Zbuduj niezmienną historię swoich produktów
- **Subtitle:** Darmowe. Bez zobowiązań. Pierwsze 1000 produktów — free forever.
- **Primary CTA:** Zarejestruj pierwszy produkt
- **Secondary CTA:** Zobacz demo →

---

## CONTACT SECTION

### Header

| Key | EN | PL |
|------|-----|-----|
| contact.sectionTitle | Contact | Kontakt |
| contact.headline | Let's build the future of product identity together | Zbudujmy razem przyszłość tożsamości produktów |

### Contact Card

| Key | EN | PL |
|------|-----|-----|
| contact.questions | Got questions? | Masz pytania? |
| contact.writeUs | Write to us | Napisz do nas |
| contact.response | We typically respond within 24 hours. Real humans, real answers. | Odpowiadamy zwykle w ciągu 24 godzin. Prawdziwi ludzie, prawdziwe odpowiedzi. |
| contact.emailAddress | hello@trve.io | hello@trve.io |
| contact.status | Online and ready to help | Online i gotowi do pomocy |

### Newsletter Card

| Key | EN | PL |
|------|-----|-----|
| newsletter.title | Newsletter | Newsletter |
| newsletter.stayUpdated | Stay in the loop | Bądź na bieżąco |
| newsletter.newsDesc | Product updates, new features, and insights delivered to your inbox. | Aktualizacje produktu, nowe funkcje i inspiracje prosto na Twój email. |
| newsletter.placeholder | Enter your email | Wpisz swój email |
| newsletter.submit | Subscribe | Zapisz się |
| newsletter.submitting | Subscribing... | Zapisuję... |
| newsletter.success | You're in! Check your inbox. | Jesteś na liście! Sprawdź skrzynkę. |
| newsletter.error | An error occurred. Please try again. | Wystąpił błąd. Spróbuj ponownie. |
| newsletter.privacy | No spam. Unsubscribe anytime. | Bez spamu. Wypisz się kiedy chcesz. |
| newsletter.feature1 | Monthly updates | Miesięczne aktualizacje |
| newsletter.feature2 | Early access | Wczesny dostęp |

---

## FOOTER

### Brand

| Key | EN | PL |
|------|-----|-----|
| footer.tagline | The immutable registry for valuable products. Every item has a story — we make sure it's never lost. | Niezmienny rejestr wartościowych produktów. Każdy przedmiot ma swoją historię — my sprawiamy, że nigdy nie zostanie utracona. |
| footer.version | Early Access v0.1 | Early Access v0.1 |
| footer.tech | Blockchain-powered | Zasilany blockchain |
| footer.slogan | Built on blockchain. Built for trust. | Built on blockchain. Built for trust. |

### Links

| Key | EN | PL |
|------|-----|-----|
| footer.product | Product | Produkt |
| footer.resources | Resources | Zasoby |
| footer.contact | Connect | Kontakt |
| footer.docs | Documentation | Dokumentacja |
| footer.api | API (coming soon) | API (wkrótce) |
| footer.status | System status | Status systemu |
| footer.contactForm | Contact form | Formularz kontaktowy |

### Bottom Bar

| Key | EN | PL |
|------|-----|-----|
| footer.copyright | © 2025 TRVE.co | © 2025 TRVE.co |
| footer.backToTop | Back to top | Wróć na górę |

---

## STRUKTURA SEKCJI NA STRONIE

1. **Navigation** (fixed)
2. **Hero** + Blockchain visualization + Trust Stats
3. **Problem & Solution**
4. **How It Works** (timeline)
5. **Use Cases** (categories)
6. **For Manufacturers** (B2B)
7. **Security** (Stolen Flag)
8. **Constantly Evolving** (rozwój platformy)
9. **Roadmap** (4 phases)
10. **FAQ** (accordion)
11. **Final CTA**
12. **Contact** (email + newsletter)
13. **Footer**
