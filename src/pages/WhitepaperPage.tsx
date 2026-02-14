import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium font-mono"
    >
      {language === 'en' ? 'PL' : 'EN'}
    </button>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 flex items-center justify-center border transition-all duration-300 group relative overflow-hidden ${
        theme === 'dark'
          ? 'border-orange/40 hover:border-orange hover:shadow-[0_0_12px_rgba(251,146,60,0.3)]'
          : 'border-border hover:border-foreground'
      }`}
      aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange/15 to-purple/10 opacity-50 group-hover:opacity-100 transition-opacity" />
      )}
      {theme === 'light' ? (
        <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors relative z-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-orange-light group-hover:text-orange transition-colors relative z-10 drop-shadow-[0_0_4px_rgba(251,146,60,0.5)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

function Divider() {
  return (
    <div className="my-12 relative">
      <hr className="border-border dark:border-border/50" />
      <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-orange/30 via-orange/50 to-transparent" />
    </div>
  );
}

// Whitepaper translations
const wpContent = {
  en: {
    badge: 'Developer Whitepaper v0.1',
    subtitle: 'Immutable product registry, anchored on blockchain.',
    vision: {
      title: 'Vision',
      whatIs: 'What is TRVE?',
      whatIsText: 'TRVE (pronounced "TRUE") is an immutable registry for valuable products, anchored on blockchain. We create permanent, verifiable histories for anything of value — from vehicles and watches to art and instruments.',
      underscoreTitle: 'The underscore in TRVE_ represents:',
      underscore: [
        'A terminal cursor — system ready for action',
        'A placeholder — space for your data',
        'A private variable — suggesting security',
        'An immutable base — the foundation you build upon',
      ],
    },
    problem: {
      title: 'The Problem',
      headline: 'Products lose their history over time.',
      text: 'Every valuable product has a story. But that story gets lost. This affects everyone: owners trying to sell, buyers trying to verify, and manufacturers watching counterfeits damage their brand.',
      items: [
        { title: 'Lost documentation', desc: 'Purchase receipts, service records, and certificates disappear' },
        { title: 'No verification', desc: "Buyers can't verify claims about history or authenticity" },
        { title: 'Lower value', desc: 'Unverified products sell for less, even if genuine' },
        { title: 'Wasted time', desc: 'Hours spent proving what should be easily verifiable' },
        { title: 'No trust', desc: 'No reliable, tamper-proof record exists' },
      ],
    },
    solution: {
      title: 'The Solution',
      headline: 'TRVE: Immutable product history, anchored on blockchain.',
      text: "Every product gets a unique digital identity. Every event — purchase, service, repair, ownership transfer — is recorded permanently. The data can't be changed, deleted, or faked.",
      benefits: 'Benefits',
      forOwners: 'For Owners',
      ownerBenefits: ["Prove your product's history instantly", 'Increase resale value with verified records', 'Report theft with permanent blockchain record'],
      forBuyers: 'For Buyers',
      buyerBenefits: ['Verify before you buy', 'See complete, tamper-proof history', 'Check if product was reported stolen'],
      forManufacturers: 'For Manufacturers',
      manufacturerBenefits: ['Create product identity at factory', 'Track products through their lifecycle', 'Protect brand from counterfeits'],
      howItWorks: 'How It Works',
      steps: [
        { title: 'Create Identity', desc: 'Register product details, photos, and proof of origin. Each product receives a unique blockchain-anchored ID.' },
        { title: 'Build History', desc: 'Add services, inspections, repairs, and updates over time. Each event is timestamped and anchored.' },
        { title: 'Verify or Transfer', desc: 'Anyone can verify the complete history. Ownership can be securely transferred to the next owner.' },
      ],
    },
    useCases: {
      title: 'Use Cases',
      items: [
        { title: 'Vehicles', desc: 'Service history, inspections, repairs, mileage, accidents' },
        { title: 'Watches', desc: 'Purchase proof, services, authenticity certificates' },
        { title: 'Art', desc: 'Provenance, exhibitions, ownership chain, restoration' },
        { title: 'Instruments', desc: 'Setup history, repairs, professional use, modifications' },
        { title: 'Electronics', desc: 'Warranty records, repairs, component replacements' },
        { title: 'Anything Valuable', desc: 'Any product worth protecting' },
      ],
      b2b: 'For Manufacturers (B2B)',
      b2bText: 'Manufacturers can integrate TRVE at the production stage:',
      b2bItems: [
        { title: 'Product Identity', desc: 'Each product gets unique blockchain identity at factory' },
        { title: 'Proof of Origin', desc: 'Verified manufacturing data and certificates' },
        { title: 'Anti-Counterfeiting', desc: 'Customers can verify if product is original' },
        { title: 'Lifecycle Tracking', desc: 'Full visibility through service and resale' },
        { title: 'Brand Protection', desc: "Stolen/fake products don't damage reputation" },
      ],
      b2bFooter: 'TRVE becomes a shared product record between manufacturer, owner, and service partners.',
    },
    security: {
      title: 'Security',
      theftTitle: 'Theft Reporting',
      theftText: 'Owners can report products as stolen. The status becomes part of the permanent blockchain record, visible during every verification.',
      benefits: 'Benefits:',
      items: [
        'Protects buyers from purchasing stolen goods',
        'Limits illegal resale markets',
        'Increases trust in verified products',
      ],
    },
    tech: {
      title: 'Tech Stack',
      architecture: 'Architecture',
      frontend: 'Frontend',
      backend: 'Backend',
      blockchain: 'Blockchain',
      whyPolygon: 'Why Polygon?',
      polygonReasons: [
        { title: 'Cost', desc: '~$0.003 per batch anchor' },
        { title: 'Speed', desc: '2-second block times' },
        { title: 'Compatibility', desc: 'Full Ethereum compatibility' },
        { title: 'Ecosystem', desc: 'Large developer community' },
        { title: 'Reliability', desc: 'Battle-tested infrastructure' },
      ],
    },
    roadmap: {
      title: 'Roadmap',
      intro: 'TRVE evolves progressively toward full decentralization. We start with a proven, cost-effective solution and expand capabilities as the platform grows.',
      evolutionLabel: 'Blockchain Evolution Path:',
      evolutionSteps: 'Hash on-chain → Data on IPFS → Full ownership on-chain',
      phase1: {
        label: 'CURRENT',
        title: 'Phase 1 — Blockchain Anchoring',
        desc: 'Daily batch anchoring using Merkle Trees. Asset data stays in our database, only cryptographic proof goes to Polygon. Cost: ~$0.003 per batch (unlimited records).',
        items: ['Product registration', 'Merkle proof verification', 'Blockchain record anchoring', 'Public verification', 'Basic ownership management'],
        technical: 'PostgreSQL → Merkle Tree → Polygon Smart Contract',
      },
      phase2: {
        title: 'Phase 2 — Data & Integrations',
        desc: 'Partner integrations and NFT-ready data structure. Metadata format compatible with ERC-721 standard, preparing for future NFT capabilities.',
        items: ['QR code / product ID', 'Manufacturer integrations', 'Service center partnerships', 'Certificates on-chain', 'Ownership transfer protocol', 'API for partners', 'NFT-ready data structure'],
      },
      phase3: {
        title: 'Phase 3 — Decentralized Storage',
        desc: 'IPFS integration for decentralized asset storage. Content-addressed data with permanent CID links. Asset metadata stored on IPFS, hash anchored on Polygon.',
        items: ['Stolen goods registry (global)', 'Insurance integration', 'Compliance & reporting', 'Public APIs', 'Marketplace connections', 'IPFS integration', 'Decentralized asset storage'],
        technical: 'PostgreSQL → IPFS (CID) → Merkle Tree → Polygon',
      },
      phase4: {
        title: 'Phase 4 — NFT & Ownership',
        desc: 'Each asset becomes an NFT (ERC-721). Ownership recorded on-chain, enabling trustless transfers. Optional wallet integration for users who want full blockchain control.',
        items: ['Mobile apps (iOS/Android)', 'AI-powered verification', 'Fraud detection systems', 'Global partnerships', 'Enterprise solutions', 'NFT for each asset', 'On-chain ownership transfers', 'Wallet integration (optional)'],
        technical: 'Asset → IPFS Metadata → NFT (ERC-721) → ownerOf() on-chain',
      },
      backwardsTitle: 'Backwards Compatibility',
      backwardsText: 'Assets registered in earlier phases remain fully verifiable. Migration to NFT is optional for users. All APIs maintain backward compatibility.',
      genesisTitle: 'Genesis Asset: This Whitepaper',
      genesisText1: 'The first asset registered in TRVE is this whitepaper itself — in both English and Polish versions. We use our own product to prove it works. Every update to this document is permanently recorded on blockchain.',
      genesisText2: 'As TRVE evolves, so does the Genesis Asset — it will migrate through all phases: from Merkle anchoring, to IPFS storage, to finally becoming a collectible NFT.',
      genesisId: 'Asset ID: TRVE-GENESIS-001 • Verify: trve.io/verify/TRVE-GENESIS-001',
    },
    footer: {
      line1: 'TRVE_ Developer Whitepaper v0.1',
      line2: 'Built on blockchain. Built for trust.',
    },
  },
  pl: {
    badge: 'Developer Whitepaper v0.1',
    subtitle: 'Niezmienny rejestr produktów, zakotwiczony w blockchain.',
    vision: {
      title: 'Wizja',
      whatIs: 'Co to jest TRVE?',
      whatIsText: 'TRVE (wymawiane "TRUE") to niezmienny rejestr cennych produktów, oparty na technologii blockchain. Tworzymy trwałe, weryfikowalne historie dla wszystkiego, co ma wartość — od pojazdów i zegarków po dzieła sztuki i instrumenty.',
      underscoreTitle: 'Podkreślenie w TRVE_ reprezentuje:',
      underscore: [
        'Kursor terminala — system gotowy do działania',
        'Puste miejsce — przestrzeń na Twoje dane',
        'Zmienna prywatna — sugerująca bezpieczeństwo',
        'Niezmienna podstawa — fundament, na którym budujesz',
      ],
    },
    problem: {
      title: 'Problem',
      headline: 'Historia produktów zanika w czasie.',
      text: 'Każdy cenny produkt ma swoją historię. Jednak ta historia zanika. To dotyczy wszystkich: właścicieli próbujących sprzedać, kupujących próbujących zweryfikować oraz producentów obserwujących, jak podróbki szkodzą ich markom.',
      items: [
        { title: 'Utracona dokumentacja', desc: 'Paragony, zapisy serwisowe i certyfikaty znikają' },
        { title: 'Brak weryfikacji', desc: 'Nabywcy nie mogą zweryfikować historii ani autentyczności' },
        { title: 'Niższa wartość', desc: 'Produkty bez weryfikacji sprzedają się taniej, nawet jeśli są oryginalne' },
        { title: 'Strata czasu', desc: 'Godziny poświęcone na udowodnienie czegoś, co powinno być łatwe do zweryfikowania' },
        { title: 'Brak zaufania', desc: 'Nie istnieje żadna rzetelna, niezmienna dokumentacja' },
      ],
    },
    solution: {
      title: 'Rozwiązanie',
      headline: 'TRVE: Niezmienna historia produktu, zakotwiczona w blockchain.',
      text: 'Każdy produkt otrzymuje unikalną tożsamość cyfrową. Każde zdarzenie — zakup, serwis, naprawa, przekazanie własności — jest zapisywane na stałe. Dane nie mogą zostać zmienione, usunięte ani podrobione.',
      benefits: 'Korzyści',
      forOwners: 'Dla właścicieli',
      ownerBenefits: ['Udowodnij historię swojego produktu natychmiast', 'Zwiększ wartość odsprzedaży dzięki zweryfikowanym zapisom', 'Zgłoś kradzież z trwałym zapisem na blockchain'],
      forBuyers: 'Dla kupujących',
      buyerBenefits: ['Zweryfikuj przed zakupem', 'Zobacz pełną, niezmienną historię', 'Sprawdź, czy produkt nie został zgłoszony jako skradziony'],
      forManufacturers: 'Dla producentów',
      manufacturerBenefits: ['Stwórz tożsamość produktu w fabryce', 'Śledź produkty przez ich cykl życia', 'Chroń markę przed podróbkami'],
      howItWorks: 'Jak to działa',
      steps: [
        { title: 'Stwórz tożsamość', desc: 'Zarejestruj dane produktu, zdjęcia i dowody pochodzenia. Każdy produkt otrzymuje unikalny identyfikator zakotwiczony w blockchain.' },
        { title: 'Buduj historię', desc: 'Dodaj serwisy, inspekcje, naprawy i aktualizacje. Każde zdarzenie jest znakowane czasem i zakotwiczone.' },
        { title: 'Weryfikuj lub przenieś', desc: 'Każdy może zweryfikować pełną historię. Własność może być bezpiecznie przeniesiona na następnego właściciela.' },
      ],
    },
    useCases: {
      title: 'Przypadki użycia',
      items: [
        { title: 'Pojazdy', desc: 'Historia serwisowa, inspekcje, naprawy, przebieg, wypadki' },
        { title: 'Zegarki', desc: 'Dowody zakupu, serwisy, certyfikaty autentyczności' },
        { title: 'Sztuka', desc: 'Proweniencja, wystawy, łańcuch własności, renowacja' },
        { title: 'Instrumenty', desc: 'Historia konfiguracji, naprawy, profesjonalne użycie, modyfikacje' },
        { title: 'Elektronika', desc: 'Zapisy gwarancyjne, naprawy, wymiany komponentów' },
        { title: 'Cokolwiek wartościowego', desc: 'Każdy produkt wart ochrony' },
      ],
      b2b: 'Dla producentów (B2B)',
      b2bText: 'Producenci mogą zintegrować TRVE już na etapie produkcji:',
      b2bItems: [
        { title: 'Tożsamość produktu', desc: 'Każdy produkt otrzymuje unikalną tożsamość blockchain w fabryce' },
        { title: 'Dowód pochodzenia', desc: 'Zweryfikowane dane produkcji i certyfikaty' },
        { title: 'Anty-podrabianie', desc: 'Klienci mogą zweryfikować, czy produkt jest oryginalny' },
        { title: 'Śledzenie cyklu życia', desc: 'Pełna widoczność przez serwis i odsprzedaż' },
        { title: 'Ochrona marki', desc: 'Skradzione/fałszywe produkty nie szkodzą reputacji' },
      ],
      b2bFooter: 'TRVE staje się wspólnym zapisem produktu między producentem, właścicielem a partnerami serwisowymi.',
    },
    security: {
      title: 'Bezpieczeństwo',
      theftTitle: 'Zgłaszanie kradzieży',
      theftText: 'Właściciele mogą zgłosić produkty jako skradzione. Status staje się częścią trwałego zapisu blockchain, widocznego podczas każdej weryfikacji.',
      benefits: 'Korzyści:',
      items: [
        'Chroni nabywców przed zakupem skradzionych produktów',
        'Ogranicza nielegalne rynki odsprzedaży',
        'Zwiększa zaufanie do zweryfikowanych produktów',
      ],
    },
    tech: {
      title: 'Stos technologiczny',
      architecture: 'Architektura',
      frontend: 'Frontend',
      backend: 'Backend',
      blockchain: 'Blockchain',
      whyPolygon: 'Dlaczego Polygon?',
      polygonReasons: [
        { title: 'Koszt', desc: '~$0.003 za batch anchor' },
        { title: 'Szybkość', desc: '2-sekundowe bloki' },
        { title: 'Kompatybilność', desc: 'Pełna kompatybilność z Ethereum' },
        { title: 'Ekosystem', desc: 'Duża społeczność deweloperów' },
        { title: 'Niezawodność', desc: 'Sprawdzona infrastruktura' },
      ],
    },
    roadmap: {
      title: 'Roadmapa',
      intro: 'TRVE ewoluuje stopniowo w kierunku pełnej decentralizacji. Zaczynamy od sprawdzonego, ekonomicznego rozwiązania i rozszerzamy możliwości wraz z rozwojem platformy.',
      evolutionLabel: 'Ścieżka ewolucji blockchain:',
      evolutionSteps: 'Hash on-chain → Dane na IPFS → Pełna własność on-chain',
      phase1: {
        label: 'OBECNA',
        title: 'Faza 1 — Zakotwiczenie blockchain',
        desc: 'Codzienne batchowe zakotwiczenie przy użyciu Merkle Trees. Dane assetów pozostają w naszej bazie, tylko kryptograficzny dowód trafia na Polygon. Koszt: ~$0.003 za batch (nieograniczona liczba rekordów).',
        items: ['Rejestracja produktu', 'Weryfikacja Merkle proof', 'Zakotwiczenie w blockchain', 'Publiczna weryfikacja', 'Podstawowe zarządzanie własnością'],
        technical: 'PostgreSQL → Merkle Tree → Polygon Smart Contract',
      },
      phase2: {
        title: 'Faza 2 — Dane i integracje',
        desc: 'Integracje z partnerami i struktura danych gotowa na NFT. Format metadanych kompatybilny ze standardem ERC-721, przygotowujący do przyszłych możliwości NFT.',
        items: ['QR code / ID produktu', 'Integracje z producentami', 'Partnerstwa z centrami serwisowymi', 'Certyfikaty on-chain', 'Protokół transferu własności', 'API dla partnerów', 'Struktura danych NFT-ready'],
      },
      phase3: {
        title: 'Faza 3 — Zdecentralizowane przechowywanie',
        desc: 'Integracja IPFS dla zdecentralizowanego przechowywania assetów. Adresowanie przez content z trwałymi linkami CID. Metadane assetów przechowywane na IPFS, hash zakotwiczony na Polygon.',
        items: ['Globalny rejestr skradzionych produktów', 'Integracja z ubezpieczeniami', 'Zgodność i raportowanie', 'Publiczne API', 'Połączenia z marketplace\'ami', 'Integracja IPFS', 'Zdecentralizowane przechowywanie assetów'],
        technical: 'PostgreSQL → IPFS (CID) → Merkle Tree → Polygon',
      },
      phase4: {
        title: 'Faza 4 — NFT i własność',
        desc: 'Każdy asset staje się NFT (ERC-721). Własność zapisana on-chain, umożliwiająca transfery bez zaufania. Opcjonalna integracja z walletami dla użytkowników chcących pełnej kontroli blockchain.',
        items: ['Aplikacje mobilne (iOS/Android)', 'Weryfikacja wspomagana przez AI', 'Systemy wykrywania oszustw', 'Globalne partnerstwa', 'Rozwiązania enterprise', 'NFT dla każdego assetu', 'Transfery własności on-chain', 'Integracja z walletami (opcjonalna)'],
        technical: 'Asset → IPFS Metadata → NFT (ERC-721) → ownerOf() on-chain',
      },
      backwardsTitle: 'Kompatybilność wsteczna',
      backwardsText: 'Assety zarejestrowane we wcześniejszych fazach pozostają w pełni weryfikowalne. Migracja do NFT jest opcjonalna dla użytkowników. Wszystkie API zachowują kompatybilność wsteczną.',
      genesisTitle: 'Genesis Asset: Ten Whitepaper',
      genesisText1: 'Pierwszy asset zarejestrowany w TRVE to sam ten whitepaper — w wersji angielskiej i polskiej. Używamy własnego produktu, aby udowodnić, że działa. Każda aktualizacja tego dokumentu jest trwale zapisywana na blockchain.',
      genesisText2: 'W miarę ewolucji TRVE, Genesis Asset również ewoluuje — przejdzie przez wszystkie fazy: od Merkle anchoring, przez przechowywanie na IPFS, aż do stania się kolekcjonerskim NFT.',
      genesisId: 'Asset ID: TRVE-GENESIS-001 • Weryfikuj: trve.io/verify/TRVE-GENESIS-001',
    },
    footer: {
      line1: 'TRVE_ Developer Whitepaper v0.1',
      line2: 'Zbudowany na blockchain. Zbudowany dla zaufania.',
    },
  },
};

export function WhitepaperPage() {
  const { language } = useLanguage();
  const content = wpContent[language];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange/5 bg-orange/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/5 bg-purple/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border dark:border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 border-2 border-orange/60 flex items-center justify-center group-hover:bg-foreground group-hover:bg-orange/20 transition-colors">
                <span className="text-[10px] font-mono font-bold tracking-tighter group-hover:text-background group-hover:text-orange transition-colors text-orange/90">T_</span>
              </div>
              <span className="text-sm font-mono font-medium tracking-widest hidden sm:block">TRVE<span className="text-orange">_</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-mono">
              <a href="#vision" className="text-muted-foreground hover:text-orange transition-colors">Vision</a>
              <a href="#solution" className="text-muted-foreground hover:text-orange transition-colors">Solution</a>
              <a href="#tech" className="text-muted-foreground hover:text-orange transition-colors">Tech</a>
              <a href="#roadmap" className="text-muted-foreground hover:text-orange transition-colors">Roadmap</a>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <LanguageToggle />
              <ThemeToggleButton />
              <Link to="/">
                <Button variant="ghost" className="text-sm font-mono">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-16 px-6 relative">
        <article className="max-w-4xl mx-auto">

          {/* Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-border border-orange/30 mb-6">
              <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">{content.badge}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-4">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 from-white to-orange bg-clip-text text-transparent">TRVE</span>
              <span className="text-orange">_</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {content.subtitle}
            </p>
          </header>

          <Divider />

          {/* Vision */}
          <section id="vision" className="scroll-mt-24">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-orange to-transparent" />
              <span className="text-orange">01</span>
              <span>{content.vision.title}</span>
            </h2>

            <h3 className="text-lg font-medium mb-3 text-orange/90">{content.vision.whatIs}</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {content.vision.whatIsText}
            </p>

            <p className="font-medium mb-3">{content.vision.underscoreTitle}</p>
            <ul className="list-none text-muted-foreground space-y-2 mb-6">
              {content.vision.underscore.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-orange/60 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <Divider />

          {/* Problem */}
          <section className="scroll-mt-24">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-magenta to-transparent" />
              <span className="text-magenta">02</span>
              <span>{content.problem.title}</span>
            </h2>

            <p className="font-medium mb-4 text-lg">{content.problem.headline}</p>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {content.problem.text}
            </p>

            <ul className="text-muted-foreground space-y-3 mb-6">
              {content.problem.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-magenta/60 flex-shrink-0" />
                  <span><strong className="text-foreground">{item.title}</strong> — {item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <Divider />

          {/* Solution */}
          <section id="solution" className="scroll-mt-24">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-purple to-transparent" />
              <span className="text-purple-light">03</span>
              <span>{content.solution.title}</span>
            </h2>

            <p className="font-medium mb-4 text-lg text-purple-light">{content.solution.headline}</p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {content.solution.text}
            </p>

            <h3 className="text-lg font-medium mb-4 text-purple-light/90">{content.solution.benefits}</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="border-l-2 border-orange/50 pl-4">
                <p className="font-medium mb-2 text-orange">{content.solution.forOwners}</p>
                <ul className="text-muted-foreground text-sm space-y-1">
                  {content.solution.ownerBenefits.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border-l-2 border-magenta/50 pl-4">
                <p className="font-medium mb-2 text-magenta">{content.solution.forBuyers}</p>
                <ul className="text-muted-foreground text-sm space-y-1">
                  {content.solution.buyerBenefits.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border-l-2 border-purple/50 pl-4">
                <p className="font-medium mb-2 text-purple-light">{content.solution.forManufacturers}</p>
                <ul className="text-muted-foreground text-sm space-y-1">
                  {content.solution.manufacturerBenefits.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4 text-purple-light/90">{content.solution.howItWorks}</h3>

            <div className="space-y-4">
              {content.solution.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className={`text-2xl font-light ${i === 0 ? 'text-orange/50' : i === 1 ? 'text-magenta/50' : 'text-purple/50'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Use Cases */}
          <section className="scroll-mt-24">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-orange to-transparent" />
              <span className="text-orange">04</span>
              <span>{content.useCases.title}</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {content.useCases.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-border/50 dark:border-border/30 hover:border-orange/30 transition-colors">
                  <span className="w-1.5 h-1.5 mt-2 bg-orange/60 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{item.title}</span>
                    <span className="text-muted-foreground"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-medium mb-4 text-orange/90">{content.useCases.b2b}</h3>

            <p className="text-muted-foreground mb-4">{content.useCases.b2bText}</p>

            <ol className="text-muted-foreground space-y-2 mb-4">
              {content.useCases.b2bItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-orange/70 font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                  <span><strong className="text-foreground">{item.title}</strong> — {item.desc}</span>
                </li>
              ))}
            </ol>

            <p className="text-muted-foreground italic">{content.useCases.b2bFooter}</p>
          </section>

          <Divider />

          {/* Security */}
          <section className="scroll-mt-24">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-magenta to-transparent" />
              <span className="text-magenta">05</span>
              <span>{content.security.title}</span>
            </h2>

            <h3 className="text-lg font-medium mb-4 text-magenta/90">{content.security.theftTitle}</h3>

            <p className="text-muted-foreground mb-4 leading-relaxed">
              {content.security.theftText}
            </p>

            <p className="font-medium mb-2">{content.security.benefits}</p>
            <ul className="text-muted-foreground space-y-2">
              {content.security.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-magenta/60 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <Divider />

          {/* Tech Stack */}
          <section id="tech" className="scroll-mt-24">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-purple to-transparent" />
              <span className="text-purple-light">06</span>
              <span>{content.tech.title}</span>
            </h2>

            <h3 className="text-lg font-medium mb-3 text-purple-light/90">{content.tech.architecture}</h3>
            <div className="font-mono text-sm text-muted-foreground mb-6 p-4 border border-border/50 border-purple/20 bg-muted/20">
              <span className="text-orange">{content.tech.frontend} (React)</span>
              <span className="mx-2">→</span>
              <span className="text-magenta">{content.tech.backend} (ASP.NET)</span>
              <span className="mx-2">→</span>
              <span className="text-purple-light">Polygon {content.tech.blockchain}</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-orange">{content.tech.frontend}</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>React 19 + TypeScript</li>
                  <li>Vite 7</li>
                  <li>Tailwind CSS 4</li>
                  <li>React Router DOM 7</li>
                  <li>React Hook Form + Zod</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 text-magenta">{content.tech.backend}</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>ASP.NET Core 8</li>
                  <li>PostgreSQL</li>
                  <li>Entity Framework Core</li>
                  <li>Merkle Trees</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 text-purple-light">{content.tech.blockchain}</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>Polygon (MATIC)</li>
                  <li>Solidity Smart Contracts</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3 text-purple-light/90">{content.tech.whyPolygon}</h3>
            <ul className="text-muted-foreground space-y-2">
              {content.tech.polygonReasons.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-purple/60 flex-shrink-0" />
                  <span><strong className="text-foreground">{item.title}</strong> — {item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <Divider />

          {/* Roadmap */}
          <section id="roadmap" className="scroll-mt-24">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-orange to-transparent" />
              <span className="text-orange">07</span>
              <span>{content.roadmap.title}</span>
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {content.roadmap.intro}
            </p>

            {/* Evolution Diagram */}
            <div className="mb-10 p-4 border border-border/50 border-purple/20 bg-muted/20 font-mono text-sm overflow-x-auto">
              <div className="text-muted-foreground mb-2">{content.roadmap.evolutionLabel}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-orange/20 text-orange border border-orange/30">{language === 'en' ? 'Phase 1: Anchoring' : 'Faza 1: Anchoring'}</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-3 py-1 bg-purple/20 text-purple-light border border-purple/30">{language === 'en' ? 'Phase 2-3: IPFS' : 'Faza 2-3: IPFS'}</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-3 py-1 bg-magenta/20 text-magenta border border-magenta/30">{language === 'en' ? 'Phase 4: NFT' : 'Faza 4: NFT'}</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {content.roadmap.evolutionSteps}
              </div>
            </div>

            <div className="space-y-10">
              {/* Phase 1 */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs bg-orange/20 text-orange border border-orange/30">{content.roadmap.phase1.label}</span>
                  {content.roadmap.phase1.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {content.roadmap.phase1.desc}
                </p>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  {content.roadmap.phase1.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange/60" /> {item}</li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-muted/30 border-l-2 border-orange/50 text-sm">
                  <span className="text-orange font-medium">Technical: </span>
                  <span className="text-muted-foreground">{content.roadmap.phase1.technical}</span>
                </div>
              </div>

              {/* Phase 2 */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-muted-foreground">{content.roadmap.phase2.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {content.roadmap.phase2.desc}
                </p>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  {content.roadmap.phase2.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 ${i === content.roadmap.phase2.items.length - 1 ? 'bg-purple/60' : 'bg-muted-foreground/40'}`} /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase 3 */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-muted-foreground">{content.roadmap.phase3.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {content.roadmap.phase3.desc}
                </p>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  {content.roadmap.phase3.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 ${i >= content.roadmap.phase3.items.length - 2 ? 'bg-purple/60' : 'bg-muted-foreground/40'}`} /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-muted/30 border-l-2 border-purple/50 text-sm">
                  <span className="text-purple-light font-medium">Technical: </span>
                  <span className="text-muted-foreground">{content.roadmap.phase3.technical}</span>
                </div>
              </div>

              {/* Phase 4 */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-muted-foreground">{content.roadmap.phase4.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {content.roadmap.phase4.desc}
                </p>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  {content.roadmap.phase4.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 ${i >= content.roadmap.phase4.items.length - 3 ? 'bg-purple/60' : 'bg-muted-foreground/40'}`} /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-muted/30 border-l-2 border-magenta/50 text-sm">
                  <span className="text-magenta font-medium">Technical: </span>
                  <span className="text-muted-foreground">{content.roadmap.phase4.technical}</span>
                </div>
              </div>
            </div>

            {/* Backwards Compatibility Note */}
            <div className="mt-10 p-4 border border-border/50 dark:border-border/30">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {content.roadmap.backwardsTitle}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {content.roadmap.backwardsText}
              </p>
            </div>

            {/* Genesis Asset Callout */}
            <div className="mt-10 p-6 border border-orange/30 bg-orange/5 bg-orange/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-orange/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange text-lg">01</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-orange">{content.roadmap.genesisTitle}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {content.roadmap.genesisText1}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {content.roadmap.genesisText2}
                  </p>
                  <p className="text-sm font-mono text-orange/80">
                    {content.roadmap.genesisId}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* Footer */}
          <footer className="text-center text-sm text-muted-foreground">
            <p className="mb-1">TRVE<span className="text-orange">_</span> {content.footer.line1.replace('TRVE_ ', '')}</p>
            <p>{content.footer.line2}</p>
          </footer>

        </article>
      </main>
    </div>
  );
}
