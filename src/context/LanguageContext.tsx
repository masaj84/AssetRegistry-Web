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
    'hero.title2': 'of your things',
    'hero.subtitle': 'Truvalue is a registry for every valuable item, recorded on blockchain forever. Document purchases, services, repairs — once recorded, never lost.',
    'hero.cta': 'Register for free',
    'hero.ctaSecondary': 'See how it works →',

    // Problem & Solution
    'problemSolution.title': 'Problem & Solution',
    'problem.label': 'Problem',
    'problem.title': 'The used goods market has a verification problem',
    'problem.subtitle': 'Buyers cannot verify if the seller\'s information is true. Documents can be forged, history can be hidden.',
    'problem.item1.title': 'Lower prices',
    'problem.item1.desc': 'Buyers pay less "just in case".',
    'problem.item2.title': 'Long negotiations',
    'problem.item2.desc': 'You waste time proving the truth.',
    'problem.item3.title': 'No trust',
    'problem.item3.desc': 'There\'s no way to verify history.',
    'solution.label': 'Solution',
    'solution.title': 'Truvalue: immutable item history',
    'solution.subtitle': 'Every item has a unique identifier. Events are recorded on blockchain — they cannot be changed.',
    'solution.item1.title': 'Blockchain',
    'solution.item1.desc': 'Events are recorded on blockchain.',
    'solution.item2.title': 'Immutability',
    'solution.item2.desc': 'No one can change or delete the data.',
    'solution.item3.title': 'Verification',
    'solution.item3.desc': 'Buyers see full, verifiable history.',

    // How it works
    'howItWorks.title': 'How it works',
    'howItWorks.subtitle': 'Three simple steps to immutable history',
    'howItWorks.step1.title': 'Register your item',
    'howItWorks.step1.desc': 'Add the basics: brand, model, serial number. Upload photos and proof of purchase.',
    'howItWorks.step2.title': 'Document over time',
    'howItWorks.step2.desc': 'Every service, inspection, part replacement. Everything goes to blockchain.',
    'howItWorks.step3.title': 'Show when selling',
    'howItWorks.step3.desc': 'Buyer scans QR, sees full history. Pays more because they have certainty.',

    // Use cases
    'useCases.title': 'Use cases',
    'useCases.subtitle': 'What you can register in Truvalue',
    'useCases.vehicles': 'Vehicles',
    'useCases.vehicles.desc': 'Service history, inspections, repairs - all recorded.',
    'useCases.watches': 'Watches',
    'useCases.watches.desc': 'Proof of purchase, services, authenticity.',
    'useCases.art': 'Art',
    'useCases.art.desc': 'Provenance, exhibitions, ownership.',
    'useCases.instruments': 'Instruments',
    'useCases.instruments.desc': 'History, setup, authenticity.',
    'useCases.anything': 'Anything',
    'useCases.anything.desc': 'Everything that holds value for you.',

    // Security - Stolen Flag
    'security.title': 'Market security',
    'security.flag.title': '"Stolen" flag — market security',
    'security.flag.desc': 'Owner can mark an item as stolen. The status is permanently recorded on blockchain and visible to everyone.',
    'security.benefit1': 'Warning for buyers',
    'security.benefit2': 'Stolen goods unsellable',
    'security.benefit3': 'Greater trust on the market',
    'security.note': 'Applies to all registered items.',
    'security.warning': 'ITEM REPORTED STOLEN',
    'security.warningDesc': 'This item has been marked as stolen by its owner. The status is permanently recorded on blockchain.',

    // Roadmap
    'roadmap.title': 'Roadmap',
    'roadmap.subtitle': 'Where we\'re heading',
    'roadmap.mvp': 'Start',
    'roadmap.mvp.item1': 'Item registration',
    'roadmap.mvp.item2': 'Blockchain records',
    'roadmap.mvp.item3': 'Public verification',
    'roadmap.mvp1': 'Verification',
    'roadmap.mvp1.item1': 'Service partnerships',
    'roadmap.mvp1.item2': 'Trust system',
    'roadmap.mvp1.item3': 'API',
    'roadmap.mvp2': 'Expansion',
    'roadmap.mvp2.item1': 'Mobile app',
    'roadmap.mvp2.item2': 'AI verification',
    'roadmap.mvp2.item3': 'Marketplace',

    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Frequently asked questions',
    'faq.q1': 'Is it really free?',
    'faq.a1': 'MVP - yes, completely free. Test it, give us feedback.',
    'faq.q2': 'Do I need to understand blockchain?',
    'faq.a2': 'No. Truvalue looks like a normal app. Blockchain runs under the hood.',
    'faq.q3': 'Can I register anything?',
    'faq.a3': 'Yes. Cars, watches, electronics, art - anything that has value.',
    'faq.q4': 'Can I edit the history?',
    'faq.a4': 'NO. That\'s the whole point. Once recorded, it cannot be changed.',

    // CTA
    'cta.badge': 'Get started now',
    'cta.title': 'Build immutable history of your things',
    'cta.subtitle': 'Free. No commitments. First 1000 items — free forever.',
    'cta.primary': 'Register your first item',
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
    'footer.tagline': 'Blockchain registry for valuable items.',
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
    'hero.title2': 'Twoich rzeczy',
    'hero.subtitle': 'Truvalue to rejestr każdej cennej rzeczy, zapisany w blockchain na zawsze. Dokumentuj zakupy, serwisy, naprawy — raz zapisane, nigdy nie znikną.',
    'hero.cta': 'Zarejestruj za darmo',
    'hero.ctaSecondary': 'Zobacz jak działa →',

    // Problem & Solution
    'problemSolution.title': 'Problem i Rozwiązanie',
    'problem.label': 'Problem',
    'problem.title': 'Rynek rzeczy używanych ma problem z weryfikacją',
    'problem.subtitle': 'Kupujący nie są w stanie sprawdzić, czy informacje od sprzedawcy są prawdziwe. Dokumenty można podrobić, historię można ukryć.',
    'problem.item1.title': 'Niższe ceny',
    'problem.item1.desc': 'Kupujący płaci mniej „na wszelki wypadek".',
    'problem.item2.title': 'Długie negocjacje',
    'problem.item2.desc': 'Tracisz czas na udowadnianie prawdy.',
    'problem.item3.title': 'Brak zaufania',
    'problem.item3.desc': 'Nie ma sposobu na weryfikację historii.',
    'solution.label': 'Rozwiązanie',
    'solution.title': 'Truvalue: niezmienna historia przedmiotu',
    'solution.subtitle': 'Każdy przedmiot ma unikalny identyfikator. Zdarzenia zapisywane są w blockchain — nie da się ich zmienić.',
    'solution.item1.title': 'Blockchain',
    'solution.item1.desc': 'Zdarzenia zapisywane są w blockchain.',
    'solution.item2.title': 'Niezmienność',
    'solution.item2.desc': 'Nikt nie może zmienić ani usunąć danych.',
    'solution.item3.title': 'Weryfikacja',
    'solution.item3.desc': 'Kupujący widzi pełną, weryfikowalną historię.',

    // How it works
    'howItWorks.title': 'Jak to działa',
    'howItWorks.subtitle': 'Trzy proste kroki do niezmiennej historii',
    'howItWorks.step1.title': 'Zapisz swoją rzecz',
    'howItWorks.step1.desc': 'Dodaj podstawy: marka, model, numer seryjny. Wrzuć zdjęcia i dowód zakupu.',
    'howItWorks.step2.title': 'Dokumentuj przez cały czas',
    'howItWorks.step2.desc': 'Każdy serwis, przegląd, wymiana części. Wszystko ląduje w blockchain.',
    'howItWorks.step3.title': 'Pokaż przy sprzedaży',
    'howItWorks.step3.desc': 'Kupujący skanuje QR, widzi całą historię. Płaci więcej bo ma pewność.',

    // Use cases
    'useCases.title': 'Zastosowania',
    'useCases.subtitle': 'Co możesz zarejestrować w Truvalue',
    'useCases.vehicles': 'Samochody',
    'useCases.vehicles.desc': 'Historia serwisowa, przeglądy, naprawy - wszystko zapisane.',
    'useCases.watches': 'Zegarki',
    'useCases.watches.desc': 'Dowód zakupu, serwisy, autentyczność.',
    'useCases.art': 'Sztuka',
    'useCases.art.desc': 'Proweniencja, wystawy, właściciele.',
    'useCases.instruments': 'Instrumenty',
    'useCases.instruments.desc': 'Historia, setup, autentyczność.',
    'useCases.anything': 'Cokolwiek',
    'useCases.anything.desc': 'Wszystko, co ma dla Ciebie wartość.',

    // Security - Stolen Flag
    'security.title': 'Bezpieczeństwo rynku',
    'security.flag.title': 'Flaga „skradzione" — zwiększa bezpieczeństwo',
    'security.flag.desc': 'Właściciel może oznaczyć przedmiot jako skradziony. Status jest trwale zapisany w blockchain i widoczny dla każdego.',
    'security.benefit1': 'Ostrzeżenie dla kupujących',
    'security.benefit2': 'Kradziony towar niesprzedawalny',
    'security.benefit3': 'Większe zaufanie na rynku',
    'security.note': 'Dotyczy wszystkich zarejestrowanych przedmiotów.',
    'security.warning': 'PRZEDMIOT ZGŁOSZONY JAKO SKRADZIONY',
    'security.warningDesc': 'Ten przedmiot został oznaczony jako skradziony przez właściciela. Status jest trwale zapisany w blockchain.',

    // Roadmap
    'roadmap.title': 'Roadmapa',
    'roadmap.subtitle': 'Gdzie zmierzamy',
    'roadmap.mvp': 'Start',
    'roadmap.mvp.item1': 'Rejestracja rzeczy',
    'roadmap.mvp.item2': 'Blockchain zapis',
    'roadmap.mvp.item3': 'Publiczna weryfikacja',
    'roadmap.mvp1': 'Weryfikacja',
    'roadmap.mvp1.item1': 'Partnerstwa z serwisami',
    'roadmap.mvp1.item2': 'System zaufania',
    'roadmap.mvp1.item3': 'API',
    'roadmap.mvp2': 'Rozszerzenie',
    'roadmap.mvp2.item1': 'Mobile app',
    'roadmap.mvp2.item2': 'AI weryfikacja',
    'roadmap.mvp2.item3': 'Marketplace',

    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Często zadawane pytania',
    'faq.q1': 'To naprawdę jest darmowe?',
    'faq.a1': 'MVP - tak, całkowicie za darmo. Testuj, dawaj feedback.',
    'faq.q2': 'Muszę znać blockchain?',
    'faq.a2': 'Nie. Truvalue wygląda jak normalna aplikacja. Blockchain jest pod spodem.',
    'faq.q3': 'Czy mogę zarejestrować cokolwiek?',
    'faq.a3': 'Tak. Samochody, zegarki, elektronika, sztuka - wszystko co ma wartość.',
    'faq.q4': 'Czy mogę edytować historię?',
    'faq.a4': 'NIE. To jest cały punkt. Raz zapisane, nie da się zmienić.',

    // CTA
    'cta.badge': 'Rozpocznij teraz',
    'cta.title': 'Zbuduj niezmienną historię swoich rzeczy',
    'cta.subtitle': 'Darmowe. Bez zobowiązań. Pierwsze 1000 rzeczy — free forever.',
    'cta.primary': 'Zarejestruj pierwszą rzecz',
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
    'footer.tagline': 'Blockchain registry for valuable items.',
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
