import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carAssetsService } from '../services/carAssetsService';
import { carTimelineService } from '../services/carTimelineService';
import { useLanguage } from '../context/LanguageContext';
import type { PublicCarAsset } from '../types/carAsset';
import type { PublicCarTimelineEntry } from '../types/timeline';

const tokens = {
  warmTerra: '#E67347',
  paperCream: '#FAF7F0',
  charcoal: '#3C3835',
  sage: '#8B956D',
  rust: '#A0522D',
  fontAccent: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontDisplay: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontMono: 'ui-monospace, "SF Mono", Menlo, "Cascadia Code", monospace',
};

const statusColors: Record<string, { bg: string; fg: string; border: string }> = {
  AVAILABLE: { bg: `${tokens.sage}15`, fg: tokens.sage, border: `${tokens.sage}40` },
  RESERVED: { bg: `${tokens.warmTerra}15`, fg: tokens.warmTerra, border: `${tokens.warmTerra}40` },
  IN_SERVICE: { bg: `${tokens.warmTerra}15`, fg: tokens.warmTerra, border: `${tokens.warmTerra}40` },
  LEASED: { bg: `${tokens.charcoal}10`, fg: tokens.charcoal, border: `${tokens.charcoal}30` },
  SOLD: { bg: `${tokens.charcoal}10`, fg: tokens.charcoal, border: `${tokens.charcoal}30` },
  DAMAGED: { bg: `${tokens.rust}15`, fg: tokens.rust, border: `${tokens.rust}40` },
};

export default function PublicCarPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [car, setCar] = useState<PublicCarAsset | null>(null);
  const [timeline, setTimeline] = useState<PublicCarTimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const [data, timelineData] = await Promise.all([
          carAssetsService.getPublicById(id),
          carTimelineService.listPublic(id).catch(() => [] as PublicCarTimelineEntry[]),
        ]);
        if (!cancelled) {
          setCar(data);
          setTimeline(timelineData);
        }
      } catch {
        if (!cancelled) setError(language === 'pl' ? 'Nie znaleziono auta' : 'Car not found');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, language]);

  const labels = {
    pl: {
      label: 'Karta auta',
      vin: 'VIN',
      year: 'Rok',
      mileage: 'Przebieg',
      color: 'Kolor',
      status: 'Status',
      dealership: 'Salon',
      registered: 'Zarejestrowane',
      lastUpdate: 'Ostatnia aktualizacja',
      blockchainTitle: 'Weryfikacja blockchain',
      anchored: 'Zakotwiczone w publicznym rejestrze',
      notAnchored: 'Oczekuje na zakotwiczenie',
      hash: 'Hash',
      poweredBy: 'Powered by',
      learnMore: 'Co to znaczy?',
      AVAILABLE: 'Dostępne',
      RESERVED: 'Zarezerwowane',
      IN_SERVICE: 'W serwisie',
      LEASED: 'Wynajęte',
      SOLD: 'Sprzedane',
      DAMAGED: 'Uszkodzone',
      timelineTitle: 'Historia',
      timelineEmpty: 'Brak wpisów w historii.',
      timelineWorkshop: 'Warsztat',
      typeSERVICE: 'Serwis',
      typeINSPECTION: 'Przegląd',
      typeREPAIR: 'Naprawa',
      typeDETAILING: 'Detailing',
      typeMILEAGE_CHECK: 'Odczyt licznika',
      typeOWNERSHIP_CHANGE: 'Zmiana właściciela',
      typePURCHASE: 'Zakup',
      typeSALE: 'Sprzedaż',
      typeACCIDENT_REPORT: 'Zgłoszenie szkody',
      typeOTHER: 'Inne',
      aiSummaryTitle: 'Podsumowanie AI',
      aiSummaryPlaceholder: 'AI w 2-3 zdaniach podsumuje historię tego auta — regularność serwisu, anomalie, wiarygodność danych. Funkcja w drodze.',
      aiChatTooltip: 'Zapytaj AI o to auto — wkrótce dostępne',
    },
    en: {
      label: 'Car record',
      vin: 'VIN',
      year: 'Year',
      mileage: 'Mileage',
      color: 'Color',
      status: 'Status',
      dealership: 'Dealership',
      registered: 'Registered',
      lastUpdate: 'Last update',
      blockchainTitle: 'Blockchain verification',
      anchored: 'Anchored in public registry',
      notAnchored: 'Pending anchoring',
      hash: 'Hash',
      poweredBy: 'Powered by',
      learnMore: 'What does this mean?',
      AVAILABLE: 'Available',
      RESERVED: 'Reserved',
      IN_SERVICE: 'In service',
      LEASED: 'Leased',
      SOLD: 'Sold',
      DAMAGED: 'Damaged',
      timelineTitle: 'History',
      timelineEmpty: 'No entries yet.',
      timelineWorkshop: 'Workshop',
      typeSERVICE: 'Service',
      typeINSPECTION: 'Inspection',
      typeREPAIR: 'Repair',
      typeDETAILING: 'Detailing',
      typeMILEAGE_CHECK: 'Odometer check',
      typeOWNERSHIP_CHANGE: 'Owner change',
      typePURCHASE: 'Purchase',
      typeSALE: 'Sale',
      typeACCIDENT_REPORT: 'Accident report',
      typeOTHER: 'Other',
      aiSummaryTitle: 'AI summary',
      aiSummaryPlaceholder: 'AI will summarise this car\u2019s history in 2-3 sentences — service regularity, anomalies, data reliability. Coming soon.',
      aiChatTooltip: 'Ask AI about this car — coming soon',
    },
  }[language];

  const typeLabel = (type: string): string => {
    const key = `type${type}` as keyof typeof labels;
    return (labels as Record<string, string>)[key] ?? type;
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: tokens.paperCream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.fontBody,
          color: tokens.charcoal,
        }}
      >
        <div className="flex items-center gap-3 opacity-60">
          <svg width="20" height="20" className="animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>...</span>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: tokens.paperCream,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.fontBody,
          color: tokens.charcoal,
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>{error || 'Not found'}</p>
        <Link to="/" style={{ color: tokens.warmTerra, fontWeight: 500 }}>
          ← TRVE
        </Link>
      </div>
    );
  }

  const status = statusColors[car.status] ?? statusColors.LEASED;
  const formatKm = (km?: number | null) =>
    km != null ? `${km.toLocaleString('pl-PL')} km` : '—';
  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US') : '—';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.paperCream, fontFamily: tokens.fontBody, color: tokens.charcoal }}>
      {/* Top bar */}
      <div
        style={{
          borderBottom: `1px solid ${tokens.warmTerra}25`,
          padding: '1rem 1.25rem',
        }}
      >
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: '640px' }}>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div
              className="flex items-center justify-center"
              style={{
                width: '2rem',
                height: '2rem',
                border: `2px solid ${tokens.warmTerra}`,
                backgroundColor: `${tokens.warmTerra}10`,
                borderRadius: '6px 4px 8px 5px',
              }}
            >
              <span style={{ fontFamily: tokens.fontAccent, fontSize: '0.625rem', fontWeight: 600, color: tokens.warmTerra }}>
                T_
              </span>
            </div>
            <span style={{ fontFamily: tokens.fontAccent, fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.15em' }}>
              TRVE<span style={{ color: tokens.warmTerra }}>_</span>
            </span>
          </Link>
          <span
            style={{
              fontFamily: tokens.fontAccent,
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: tokens.warmTerra,
            }}
          >
            {labels.label}
          </span>
        </div>
      </div>

      <main className="mx-auto" style={{ maxWidth: '560px', padding: '2rem 1.25rem 4rem' }}>
        {/* Hero card */}
        <div
          className="relative"
          style={{
            backgroundColor: tokens.paperCream,
            border: `1px solid ${tokens.warmTerra}30`,
            borderRadius: '14px 10px 16px 12px',
            padding: '1.75rem 1.5rem',
            boxShadow: `0 12px 32px rgba(60,56,53,0.08), 0 4px 12px rgba(60,56,53,0.06)`,
            backgroundImage: `radial-gradient(circle at 90% 0%, ${tokens.warmTerra}10 0%, transparent 45%)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '1.25rem',
              height: '2px',
              width: '2.75rem',
              backgroundColor: tokens.warmTerra,
              opacity: 0.7,
            }}
          />

          {/* Status pill */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.7rem',
                borderRadius: '999px',
                backgroundColor: status.bg,
                border: `1px solid ${status.border}`,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: status.fg,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: tokens.fontAccent,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: status.fg,
                }}
              >
                {labels[car.status as keyof typeof labels] ?? car.status}
              </span>
            </div>
            <span
              style={{
                fontFamily: tokens.fontMono,
                fontSize: '0.6875rem',
                opacity: 0.5,
              }}
            >
              #{car.id.slice(0, 8)}
            </span>
          </div>

          {/* Make / Model */}
          <h1
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: 'clamp(1.875rem, 7vw, 2.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              marginBottom: '0.4rem',
            }}
          >
            {car.make} {car.model}
          </h1>
          <p
            style={{
              fontFamily: tokens.fontMono,
              fontSize: '0.875rem',
              opacity: 0.55,
              marginBottom: '1.5rem',
            }}
          >
            {car.vin}
          </p>

          {/* Spec rows */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.875rem 1rem',
              paddingTop: '1.25rem',
              borderTop: `1px dashed ${tokens.warmTerra}25`,
            }}
          >
            <SpecRow label={labels.year} value={String(car.year)} mono />
            <SpecRow label={labels.mileage} value={formatKm(car.mileage)} mono />
            {car.color && <SpecRow label={labels.color} value={car.color} />}
            <SpecRow label={labels.dealership} value={car.dealershipName} />
          </div>
        </div>

        {/* Blockchain verification */}
        <div
          className="mt-5"
          style={{
            backgroundColor: tokens.paperCream,
            border: `1px solid ${car.blockchainAnchoredAt ? tokens.sage : tokens.warmTerra}30`,
            borderRadius: '12px 8px 14px 10px',
            padding: '1.25rem 1.5rem',
            boxShadow: `0 4px 14px rgba(60,56,53,0.04)`,
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontAccent,
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: car.blockchainAnchoredAt ? tokens.sage : tokens.warmTerra,
              marginBottom: '0.5rem',
            }}
          >
            {labels.blockchainTitle}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: car.blockchainAnchoredAt ? tokens.sage : tokens.warmTerra,
              }}
            />
            <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {car.blockchainAnchoredAt ? labels.anchored : labels.notAnchored}
            </span>
          </div>
          {car.blockchainHash && (
            <div className="mt-2">
              <span
                style={{
                  fontFamily: tokens.fontMono,
                  fontSize: '0.75rem',
                  opacity: 0.65,
                  wordBreak: 'break-all',
                }}
              >
                {labels.hash}: {car.blockchainHash.slice(0, 14)}...{car.blockchainHash.slice(-10)}
              </span>
            </div>
          )}
          {car.blockchainAnchoredAt && (
            <div
              style={{
                fontSize: '0.8125rem',
                opacity: 0.6,
                marginTop: '0.5rem',
              }}
            >
              {formatDate(car.blockchainAnchoredAt)}
            </div>
          )}
          <Link
            to="/jak-dziala"
            style={{
              display: 'inline-block',
              marginTop: '0.75rem',
              fontSize: '0.8125rem',
              color: tokens.warmTerra,
              textDecoration: 'none',
              borderBottom: `1px solid ${tokens.warmTerra}40`,
              fontWeight: 500,
            }}
          >
            {labels.learnMore} →
          </Link>
        </div>

        {/* AI Summary (placeholder) */}
        <div
          className="mt-5 relative"
          style={{
            border: `1px dashed ${tokens.warmTerra}50`,
            borderRadius: '12px 8px 14px 10px',
            padding: '1.25rem 1.5rem',
            backgroundColor: `${tokens.warmTerra}06`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '0.25rem 0.625rem',
              backgroundColor: tokens.warmTerra,
              color: '#FFF',
              fontFamily: tokens.fontAccent,
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              borderRadius: '0 8px 0 6px',
            }}
          >
            Wkrótce · AI
          </div>
          <div
            style={{
              fontFamily: tokens.fontAccent,
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: tokens.warmTerra,
              marginBottom: '0.5rem',
            }}
          >
            {labels.aiSummaryTitle}
          </div>
          <p style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.55, margin: 0 }}>
            {labels.aiSummaryPlaceholder}
          </p>
        </div>

        {/* Timeline */}
        <div
          className="mt-5"
          style={{
            backgroundColor: tokens.paperCream,
            border: `1px solid ${tokens.warmTerra}30`,
            borderRadius: '12px 8px 14px 10px',
            padding: '1.25rem 1.5rem',
            boxShadow: `0 4px 14px rgba(60,56,53,0.04)`,
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontAccent,
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: tokens.warmTerra,
              marginBottom: '0.75rem',
            }}
          >
            {labels.timelineTitle}
          </div>
          {timeline.length === 0 ? (
            <p style={{ fontSize: '0.875rem', opacity: 0.6, fontStyle: 'italic', margin: 0 }}>
              {labels.timelineEmpty}
            </p>
          ) : (
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {timeline.map((entry, idx) => (
                <li
                  key={entry.id}
                  style={{
                    paddingLeft: '0.875rem',
                    paddingTop: idx === 0 ? 0 : '0.625rem',
                    paddingBottom: idx === timeline.length - 1 ? 0 : '0.625rem',
                    borderLeft: `2px solid ${tokens.warmTerra}40`,
                    marginLeft: '0.25rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: tokens.fontAccent,
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: tokens.warmTerra,
                      }}
                    >
                      {typeLabel(entry.type)}
                    </span>
                    <span
                      style={{
                        fontFamily: tokens.fontMono,
                        fontSize: '0.6875rem',
                        opacity: 0.55,
                      }}
                    >
                      {formatDate(entry.occurredAt)}
                    </span>
                    {entry.mileage != null && (
                      <span
                        style={{
                          fontFamily: tokens.fontMono,
                          fontSize: '0.6875rem',
                          opacity: 0.55,
                        }}
                      >
                        · {entry.mileage.toLocaleString('pl-PL')} km
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>{entry.description}</p>
                  {entry.workshop && (
                    <p
                      style={{
                        fontSize: '0.75rem',
                        opacity: 0.55,
                        margin: '0.2rem 0 0',
                        fontStyle: 'italic',
                      }}
                    >
                      {labels.timelineWorkshop}: {entry.workshop}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Meta dates */}
        <div
          className="mt-5 flex justify-between gap-3"
          style={{
            fontFamily: tokens.fontBody,
            fontSize: '0.8125rem',
            opacity: 0.55,
          }}
        >
          <span>{labels.registered}: {formatDate(car.createdAt)}</span>
          <span>{labels.lastUpdate}: {formatDate(car.updatedAt)}</span>
        </div>

        {/* Powered by */}
        <div
          className="mt-10 text-center"
          style={{
            fontFamily: tokens.fontAccent,
            fontSize: '0.6875rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: 0.5,
          }}
        >
          {labels.poweredBy}{' '}
          <Link
            to="/"
            style={{ color: tokens.warmTerra, textDecoration: 'none', fontWeight: 600 }}
          >
            TRVE
          </Link>
        </div>
      </main>

      {/* AI Chat — floating button (placeholder) */}
      <button
        type="button"
        disabled
        title={labels.aiChatTooltip}
        aria-label={labels.aiChatTooltip}
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          width: '3.25rem',
          height: '3.25rem',
          borderRadius: '50%',
          backgroundColor: tokens.warmTerra,
          color: '#FFF',
          border: 'none',
          cursor: 'not-allowed',
          opacity: 0.85,
          boxShadow: '0 8px 24px rgba(230,115,71,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.fontAccent,
        }}
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            fontSize: '0.5rem',
            backgroundColor: '#3C3835',
            color: '#FFF',
            padding: '2px 5px',
            borderRadius: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Wkrótce
        </span>
      </button>
    </div>
  );
}

function SpecRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontFamily: tokens.fontAccent,
          fontSize: '0.625rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.55,
          marginBottom: '0.2rem',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: mono ? tokens.fontMono : tokens.fontBody,
          fontSize: '0.9375rem',
          fontWeight: 500,
        }}
      >
        {value}
      </div>
    </div>
  );
}
