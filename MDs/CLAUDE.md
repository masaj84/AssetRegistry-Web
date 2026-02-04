# TRVE - Kontekst Projektu

## O Projekcie
TRVE (wymawiane jak TRUE) - niezmienny rejestr cennych przedmiotów oparty na blockchain. Niezmienna historia rzeczy (samochody, zegarki, elektronika, sztuka). MVP w fazie rozwoju.

## Stack Technologiczny
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4 (dark theme, styl Palantir Warpspeed)
- React Router DOM 7
- React Hook Form + Zod (walidacja)
- React Query (przygotowane, nie użyte jeszcze)
- Radix UI (przygotowane komponenty)

## Struktura Projektu
```
src/
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx      # Layout MVP app (sidebar + topbar)
│   ├── ui/
│   │   ├── Badge.tsx          # Badge/tag component
│   │   ├── Button.tsx         # Button component
│   │   ├── Card.tsx           # Card + CardHeader/Title/Content
│   │   ├── Input.tsx          # Input z label i error
│   │   ├── Select.tsx         # Select dropdown
│   │   └── ThemeToggle.tsx    # Przełącznik light/dark
│   ├── ContactSection.tsx     # Sekcja kontaktu + newsletter
│   └── ProtectedRoute.tsx     # Ochrona tras (auth)
├── context/
│   ├── AuthContext.tsx        # Kontekst autoryzacji (demo localStorage)
│   ├── LanguageContext.tsx    # System tłumaczeń (EN/PL)
│   └── ThemeContext.tsx       # Kontekst motywu (light/dark)
├── data/
│   └── mockData.ts            # Mock dane (8 assetów, statystyki)
├── lib/
│   └── utils.ts               # Helpers (cn, formatCurrency, formatDate)
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx      # Strona logowania
│   │   └── RegisterPage.tsx   # Strona rejestracji
│   ├── app/
│   │   ├── DashboardPage.tsx  # Dashboard ze statystykami
│   │   ├── AssetsPage.tsx     # Lista assetów (tabela + filtry)
│   │   ├── AssetFormPage.tsx  # Formularz dodawania/edycji
│   │   └── ReportsPage.tsx    # Placeholder "wkrótce"
│   └── LandingPage.tsx        # Strona główna (marketing)
├── types/
│   └── index.ts               # TypeScript typy (Asset, User, etc.)
├── App.tsx                    # Routing
├── main.tsx                   # Entry point
└── index.css                  # Tailwind theme (@theme)
```

## Routing
- `/` - Landing page (publiczna)
- `/login` - Logowanie
- `/register` - Rejestracja
- `/app` - Dashboard (chronione)
- `/app/assets` - Lista assetów (chronione)
- `/app/assets/new` - Nowy asset (chronione)
- `/app/assets/:id` - Edycja assetu (chronione)
- `/app/reports` - Raporty (chronione)

## Komendy
```bash
npm run dev      # Serwer deweloperski (localhost:3000)
npm run build    # Build produkcyjny
npm run preview  # Podgląd builda
```

## Co Działa (MVP)
- [x] Landing page z opisem produktu (EN/PL)
- [x] System logowania demo (localStorage)
- [x] Dashboard ze statystykami
- [x] Lista assetów z filtrowaniem
- [x] Formularz dodawania/edycji assetów
- [x] Responsywny layout
- [x] Light/Dark theme z przełącznikiem (ThemeToggle)
- [x] Zapisywanie preferencji motywu w localStorage
- [x] System tłumaczeń EN/PL (LanguageContext)
- [x] Sekcja kontaktu z formularzem newslettera

## Co Do Zrobienia (Następne Kroki)
- [ ] Podłączenie do backend API (proxy na localhost:5000)
- [ ] Persystencja danych (teraz tylko mock)
- [ ] React Query do pobierania danych
- [ ] Integracja blockchain
- [ ] Moduł raportów
- [ ] Walidacja formularzy z Zod
- [ ] Toasty/powiadomienia (Radix Toast)
- [ ] Wyszukiwarka globalna
- [ ] Eksport danych (CSV/PDF)

## Design
Inspiracja: https://www.palantir.com/warpspeed/
- Dark theme (domyślnie)
- Kolory: primary cyan/blue (#0ea5e9), tło ciemny granat
- Minimalistyczny, enterprise look
- Glass effect na kartach
- Glow effect na ważnych elementach

## Landing Page
Sekcje na stronie głównej:
1. **Hero** - nagłówek + CTA
2. **Problem & Solution** - opis problemu rynku używanych rzeczy i rozwiązania
3. **How It Works** - 3 kroki (zapisz, dokumentuj, pokaż)
4. **Use Cases** - kategorie (samochody, zegarki, sztuka, instrumenty, cokolwiek)
5. **Roadmap** - MVP → Weryfikacja → Rozszerzenie
6. **FAQ** - najczęstsze pytania
7. **CTA** - wezwanie do działania
8. **Contact** - formularz kontaktu + newsletter
9. **Footer**

Teksty landing page są w `src/context/LanguageContext.tsx` (system tłumaczeń EN/PL).

## Uwagi
- Dane demo w `src/data/mockData.ts`
- Typy w `src/types/index.ts`
- Tailwind v4 używa `@theme` w CSS zamiast tailwind.config.js
- Autoryzacja demo - każdy email/hasło działa
- Tłumaczenia: `useLanguage()` hook, funkcja `t('klucz')`
