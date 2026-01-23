import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'pl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.problem': 'Problem',
    'nav.howItWorks': 'How it works',
    'nav.useCases': 'Use cases',
    'nav.faq': 'FAQ',
    'nav.demo': 'Demo',
    'nav.login': 'Login',
    'nav.getStarted': 'Get started',

    // Hero
    'hero.badge': 'Early Access',
    'hero.title1': 'Immutable history',
    'hero.title2': 'of your products',
    'hero.subtitle': 'Truvalue is a registry for every valuable product, recorded on blockchain forever. Document purchases, services, repairs — once recorded, never lost.',
    'hero.cta': 'Register for free',
    'hero.ctaSecondary': 'See how it works →',

    // Problem & Solution
    'problemSolution.title': 'Problem & Solution',
    'problem.label': 'Problem',
    'problem.title': 'Products lose their history over time',
    'problem.subtitle': 'Product data disappears, documents get lost, and history cannot be verified.',
    'problem.item1.title': 'Lower value',
    'problem.item1.desc': 'Unverified products lose market value.',
    'problem.item2.title': 'Time wasted',
    'problem.item2.desc': 'You waste time proving what happened.',
    'problem.item3.title': 'No trust',
    'problem.item3.desc': 'There is no reliable product record.',
    'solution.label': 'Solution',
    'solution.title': 'Truvalue: immutable product history',
    'solution.subtitle': 'Every product has a unique ID. Events are recorded on blockchain — they cannot be changed.',
    'solution.item1.title': 'Blockchain',
    'solution.item1.desc': 'Events are recorded on blockchain.',
    'solution.item2.title': 'Immutability',
    'solution.item2.desc': 'No one can change or delete the data.',
    'solution.item3.title': 'Verification',
    'solution.item3.desc': 'Anyone can verify full history.',

    // How it works
    'howItWorks.title': 'How it works',
    'howItWorks.subtitle': 'Three simple steps to immutable history',
    'howItWorks.step1.title': 'Create product identity',
    'howItWorks.step1.desc': 'Register product details, photos and proof of origin.',
    'howItWorks.step2.title': 'Build product history',
    'howItWorks.step2.desc': 'Add services, inspections, repairs and updates over time.',
    'howItWorks.step3.title': 'Verify or transfer ownership',
    'howItWorks.step3.desc': 'Anyone can verify history. Ownership can be transferred to next owner.',

    // Use cases
    'useCases.title': 'Use cases',
    'useCases.subtitle': 'What products can have a Truvalue history',
    'useCases.vehicles': 'Vehicles',
    'useCases.vehicles.desc': 'Service history, inspections, repairs.',
    'useCases.watches': 'Watches',
    'useCases.watches.desc': 'Proof of purchase, services, authenticity.',
    'useCases.art': 'Art',
    'useCases.art.desc': 'Provenance, exhibitions, ownership.',
    'useCases.instruments': 'Instruments',
    'useCases.instruments.desc': 'Setup, services, usage history.',
    'useCases.anything': 'Anything',
    'useCases.anything.desc': 'Any product with value.',

    // For Manufacturers
    'manufacturers.title': 'For manufacturers',
    'manufacturers.desc': 'Manufacturers can create product identity at production stage and attach verified origin data from day one.',
    'manufacturers.item1.title': 'Product identity',
    'manufacturers.item1.desc': 'Each product gets unique blockchain identity at factory.',
    'manufacturers.item2.title': 'Proof of origin',
    'manufacturers.item2.desc': 'Verified manufacturing data and certificates.',
    'manufacturers.item3.title': 'Anti-counterfeiting',
    'manufacturers.item3.desc': 'Customers can verify if product is original.',
    'manufacturers.item4.title': 'Lifecycle tracking',
    'manufacturers.item4.desc': 'Full visibility across servicing and resale.',
    'manufacturers.item5.title': 'Brand protection',
    'manufacturers.item5.desc': 'Stolen or fake products damage brand reputation.',
    'manufacturers.summary': 'Truvalue becomes a shared product record between manufacturer, owner and service partners.',

    // Security - Stolen Flag
    'security.title': 'Product status',
    'security.flag.title': 'Product ownership and theft status',
    'security.flag.desc': 'Owner can report a product as stolen. The status becomes part of the product history and is visible during every verification.',
    'security.benefit1': 'Protects buyers and manufacturers',
    'security.benefit2': 'Limits illegal resale',
    'security.benefit3': 'Increases trust in product history',
    'security.note': 'Applies to all products registered in Truvalue.',
    'security.warning': 'ITEM REPORTED STOLEN',
    'security.warningDesc': 'This product has been reported as stolen by its owner. The status is permanently recorded on blockchain.',

    // Roadmap
    'roadmap.title': 'Roadmap',
    'roadmap.subtitle': 'Where we\'re heading',
    'roadmap.phase1': 'Product identity',
    'roadmap.phase1.item1': 'Item registration',
    'roadmap.phase1.item2': 'Blockchain records',
    'roadmap.phase1.item3': 'Public verification',
    'roadmap.phase1.item4': 'QR / product ID',
    'roadmap.phase2': 'Verified sources',
    'roadmap.phase2.item1': 'Manufacturer integrations',
    'roadmap.phase2.item2': 'Service center partnerships',
    'roadmap.phase2.item3': 'Certificates on-chain',
    'roadmap.phase2.item4': 'Ownership transfer',
    'roadmap.phase3': 'Market infrastructure',
    'roadmap.phase3.item1': 'Stolen goods registry',
    'roadmap.phase3.item2': 'Insurance integration',
    'roadmap.phase3.item3': 'Compliance & reporting',
    'roadmap.phase3.item4': 'Public APIs',
    'roadmap.phase4': 'Scale & intelligence',
    'roadmap.phase4.item1': 'Mobile apps',
    'roadmap.phase4.item2': 'AI verification',
    'roadmap.phase4.item3': 'Fraud detection',
    'roadmap.phase4.item4': 'Global partnerships',

    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Frequently asked questions',
    'faq.q1': 'Is it really free?',
    'faq.a1': 'MVP — yes, completely free. Test it and give feedback.',
    'faq.q2': 'Do I need to understand blockchain?',
    'faq.a2': 'No. Truvalue works like a normal app. Blockchain runs under the hood.',
    'faq.q3': 'Can I register anything?',
    'faq.a3': 'Yes. Any product that has value.',
    'faq.q4': 'Can I edit the history?',
    'faq.a4': 'No. Once recorded, it cannot be changed.',

    // CTA
    'cta.badge': 'Get started now',
    'cta.title': 'Build immutable history of your products',
    'cta.subtitle': 'Free. No commitments. First 1000 items — free forever.',
    'cta.primary': 'Register your first product',
    'cta.secondary': 'See demo →',

    // Contact
    'contact.sectionTitle': 'Contact',
    'contact.questions': 'Got questions?',
    'contact.writeUs': 'Write to us',
    'contact.email': 'Email',
    'contact.response': 'Response within 24 hours',
    'contact.emailAddress': 'hello@truvalue.co',

    // Newsletter
    'newsletter.title': 'Newsletter',
    'newsletter.stayUpdated': 'Stay updated',
    'newsletter.news': 'Truvalue news',
    'newsletter.newsDesc': 'New features, guides, inspiration',
    'newsletter.placeholder': 'Your email',
    'newsletter.submit': 'Subscribe',
    'newsletter.submitting': '...',
    'newsletter.success': 'Thank you for subscribing!',
    'newsletter.error': 'An error occurred. Please try again.',

    // Footer
    'footer.tagline': 'Blockchain registry for valuable products.',
    'footer.product': 'Product',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2025 Truvalue.co',
    'footer.slogan': 'Built on blockchain. Built for trust.',
  },
  pl: {
    // Nav
    'nav.problem': 'Problem',
    'nav.howItWorks': 'Jak działa',
    'nav.useCases': 'Zastosowania',
    'nav.faq': 'FAQ',
    'nav.demo': 'Demo',
    'nav.login': 'Zaloguj',
    'nav.getStarted': 'Rozpocznij',

    // Hero
    'hero.badge': 'Early Access',
    'hero.title1': 'Niezmienna historia',
    'hero.title2': 'Twoich produktów',
    'hero.subtitle': 'Truvalue to rejestr każdego wartościowego produktu, zapisany w blockchain na zawsze. Dokumentuj zakupy, serwisy, naprawy — raz zapisane, nigdy nie znikną.',
    'hero.cta': 'Zarejestruj za darmo',
    'hero.ctaSecondary': 'Zobacz jak działa →',

    // Problem & Solution
    'problemSolution.title': 'Problem i Rozwiązanie',
    'problem.label': 'Problem',
    'problem.title': 'Produkty tracą swoją historię w czasie',
    'problem.subtitle': 'Informacje o produkcie znikają, dokumenty giną, a historia nie jest weryfikowalna.',
    'problem.item1.title': 'Niższa wartość',
    'problem.item1.desc': 'Produkty bez historii są wyceniane niżej.',
    'problem.item2.title': 'Strata czasu',
    'problem.item2.desc': 'Tracisz czas na udowadnianie faktów.',
    'problem.item3.title': 'Brak zaufania',
    'problem.item3.desc': 'Brak wiarygodnej historii produktu.',
    'solution.label': 'Rozwiązanie',
    'solution.title': 'Truvalue: niezmienna historia produktu',
    'solution.subtitle': 'Każdy produkt ma unikalny identyfikator. Zdarzenia są zapisywane w blockchain — nie da się ich zmienić.',
    'solution.item1.title': 'Blockchain',
    'solution.item1.desc': 'Zdarzenia zapisywane są w blockchain.',
    'solution.item2.title': 'Niezmienność',
    'solution.item2.desc': 'Nikt nie może zmienić ani usunąć danych.',
    'solution.item3.title': 'Weryfikacja',
    'solution.item3.desc': 'Każdy może zweryfikować historię produktu.',

    // How it works
    'howItWorks.title': 'Jak to działa',
    'howItWorks.subtitle': 'Trzy proste kroki do niezmiennej historii',
    'howItWorks.step1.title': 'Utwórz tożsamość produktu',
    'howItWorks.step1.desc': 'Zarejestruj dane produktu, zdjęcia i dowód pochodzenia.',
    'howItWorks.step2.title': 'Buduj historię produktu',
    'howItWorks.step2.desc': 'Dodawaj serwisy, przeglądy, naprawy i aktualizacje w czasie.',
    'howItWorks.step3.title': 'Zweryfikuj lub przekaż własność',
    'howItWorks.step3.desc': 'Każdy może sprawdzić historię. Własność można przekazać kolejnemu właścicielowi.',

    // Use cases
    'useCases.title': 'Zastosowania',
    'useCases.subtitle': 'Jakie produkty mogą mieć historię w Truvalue',
    'useCases.vehicles': 'Samochody',
    'useCases.vehicles.desc': 'Historia serwisowa, przeglądy, naprawy.',
    'useCases.watches': 'Zegarki',
    'useCases.watches.desc': 'Dowód zakupu, serwisy, autentyczność.',
    'useCases.art': 'Sztuka',
    'useCases.art.desc': 'Proweniencja, wystawy, właściciele.',
    'useCases.instruments': 'Instrumenty',
    'useCases.instruments.desc': 'Setup, serwisy, historia użycia.',
    'useCases.anything': 'Cokolwiek',
    'useCases.anything.desc': 'Każdy produkt, który ma wartość.',

    // For Manufacturers
    'manufacturers.title': 'Dla producentów',
    'manufacturers.desc': 'Producenci mogą tworzyć tożsamość produktu już na etapie produkcji i dodawać zweryfikowane dane od pierwszego dnia.',
    'manufacturers.item1.title': 'Tożsamość produktu',
    'manufacturers.item1.desc': 'Każdy produkt dostaje unikalną tożsamość już w fabryce.',
    'manufacturers.item2.title': 'Dowód pochodzenia',
    'manufacturers.item2.desc': 'Zweryfikowane dane produkcyjne i certyfikaty.',
    'manufacturers.item3.title': 'Ochrona przed podróbkami',
    'manufacturers.item3.desc': 'Klient może sprawdzić, czy produkt jest oryginalny.',
    'manufacturers.item4.title': 'Historia w całym cyklu życia',
    'manufacturers.item4.desc': 'Pełna widoczność przez serwisy i kolejne sprzedaże.',
    'manufacturers.item5.title': 'Ochrona marki',
    'manufacturers.item5.desc': 'Kradzione i fałszywe produkty nie psują reputacji marki.',
    'manufacturers.summary': 'Truvalue staje się wspólnym rejestrem produktu dla producenta, właściciela i serwisów.',

    // Security - Stolen Flag
    'security.title': 'Status produktu',
    'security.flag.title': 'Status własności i kradzieży produktu',
    'security.flag.desc': 'Właściciel może zgłosić produkt jako skradziony. Status staje się częścią historii produktu i jest widoczny przy każdej weryfikacji.',
    'security.benefit1': 'Ochrona kupujących i producentów',
    'security.benefit2': 'Ograniczenie nielegalnego obrotu',
    'security.benefit3': 'Większe zaufanie do historii produktu',
    'security.note': 'Dotyczy wszystkich produktów zarejestrowanych w Truvalue.',
    'security.warning': 'PRZEDMIOT ZGŁOSZONY JAKO SKRADZIONY',
    'security.warningDesc': 'Ten produkt został zgłoszony jako skradziony przez właściciela. Status jest trwale zapisany w blockchain.',

    // Roadmap
    'roadmap.title': 'Roadmapa',
    'roadmap.subtitle': 'Gdzie zmierzamy',
    'roadmap.phase1': 'Tożsamość produktu',
    'roadmap.phase1.item1': 'Rejestracja produktu',
    'roadmap.phase1.item2': 'Zapis w blockchain',
    'roadmap.phase1.item3': 'Publiczna weryfikacja',
    'roadmap.phase1.item4': 'QR / identyfikator produktu',
    'roadmap.phase2': 'Zweryfikowane źródła danych',
    'roadmap.phase2.item1': 'Integracje z producentami',
    'roadmap.phase2.item2': 'Partnerstwa z serwisami',
    'roadmap.phase2.item3': 'Certyfikaty w blockchain',
    'roadmap.phase2.item4': 'Transfer własności',
    'roadmap.phase3': 'Infrastruktura rynku',
    'roadmap.phase3.item1': 'Rejestr kradzionych produktów',
    'roadmap.phase3.item2': 'Integracje z ubezpieczycielami',
    'roadmap.phase3.item3': 'Compliance i raportowanie',
    'roadmap.phase3.item4': 'Publiczne API',
    'roadmap.phase4': 'Skala i inteligencja',
    'roadmap.phase4.item1': 'Aplikacje mobilne',
    'roadmap.phase4.item2': 'Weryfikacja AI',
    'roadmap.phase4.item3': 'Wykrywanie nadużyć',
    'roadmap.phase4.item4': 'Globalne partnerstwa',

    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Często zadawane pytania',
    'faq.q1': 'Czy to naprawdę darmowe?',
    'faq.a1': 'MVP — tak, całkowicie za darmo. Testuj i dawaj feedback.',
    'faq.q2': 'Czy muszę znać blockchain?',
    'faq.a2': 'Nie. Truvalue działa jak zwykła aplikacja. Blockchain jest pod spodem.',
    'faq.q3': 'Czy mogę zarejestrować cokolwiek?',
    'faq.a3': 'Tak. Każdy produkt, który ma wartość.',
    'faq.q4': 'Czy mogę edytować historię?',
    'faq.a4': 'Nie. Raz zapisane, nie da się zmienić.',

    // CTA
    'cta.badge': 'Rozpocznij teraz',
    'cta.title': 'Zbuduj niezmienną historię swoich produktów',
    'cta.subtitle': 'Darmowe. Bez zobowiązań. Pierwsze 1000 produktów — free forever.',
    'cta.primary': 'Zarejestruj pierwszy produkt',
    'cta.secondary': 'Zobacz demo →',

    // Contact
    'contact.sectionTitle': 'Kontakt',
    'contact.questions': 'Masz pytania?',
    'contact.writeUs': 'Napisz do nas',
    'contact.email': 'Email',
    'contact.response': 'Odpowiedź w ciągu 24h',
    'contact.emailAddress': 'hello@truvalue.co',

    // Newsletter
    'newsletter.title': 'Newsletter',
    'newsletter.stayUpdated': 'Bądź na bieżąco',
    'newsletter.news': 'Aktualności Truvalue',
    'newsletter.newsDesc': 'Nowe funkcje, poradniki, inspiracje',
    'newsletter.placeholder': 'Twój email',
    'newsletter.submit': 'Zapisz się',
    'newsletter.submitting': '...',
    'newsletter.success': 'Dziękujemy za zapisanie się do newslettera!',
    'newsletter.error': 'Wystąpił błąd. Spróbuj ponownie.',

    // Footer
    'footer.tagline': 'Rejestr wartościowych produktów na blockchain.',
    'footer.product': 'Produkt',
    'footer.contact': 'Kontakt',
    'footer.copyright': '© 2025 Truvalue.co',
    'footer.slogan': 'Built on blockchain. Built for trust.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
