import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const tokens = {
  warmTerra: '#E67347',
  richClay: '#B85C38',
  paperCream: '#FAF7F0',
  charcoal: '#3C3835',
  sage: '#8B956D',
  rust: '#A0522D',
  inkBlue: '#2B4C5E',
  fontAccent: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontDisplay: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const phases: Array<{ key: 1 | 2 | 3 | 4; status: 'shipped' | 'now' | 'next' | 'later'; accent: string }> = [
  { key: 1, status: 'shipped', accent: tokens.sage },
  { key: 2, status: 'now', accent: tokens.warmTerra },
  { key: 3, status: 'next', accent: tokens.inkBlue },
  { key: 4, status: 'later', accent: tokens.rust },
];

export default function RoadmapPage() {
  const { t, language } = useLanguage();

  const statusLabels: Record<string, Record<string, string>> = {
    pl: { shipped: 'Zrobione', now: 'Teraz', next: 'Następne', later: 'Później' },
    en: { shipped: 'Shipped', now: 'Now', next: 'Next', later: 'Later' },
  };

  return (
    <div style={{ backgroundColor: tokens.paperCream, minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${tokens.warmTerra}25`, padding: '1.25rem 2rem' }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: '1080px' }}>
          <Link to="/" className="inline-flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '2.25rem',
                height: '2.25rem',
                border: `2px solid ${tokens.warmTerra}`,
                backgroundColor: `${tokens.warmTerra}10`,
                borderRadius: '6px 4px 8px 5px',
              }}
            >
              <span style={{ fontFamily: tokens.fontAccent, fontSize: '0.625rem', fontWeight: 600, color: tokens.warmTerra }}>
                T_
              </span>
            </div>
            <span style={{ fontFamily: tokens.fontAccent, fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.15em', color: tokens.charcoal }}>
              TRVE<span style={{ color: tokens.warmTerra }}>_</span>
            </span>
          </Link>
          <Link to="/" style={{ fontFamily: tokens.fontBody, fontSize: '0.875rem', color: tokens.charcoal, opacity: 0.7, textDecoration: 'none' }}>
            ← {language === 'pl' ? 'Strona główna' : 'Home'}
          </Link>
        </div>
      </div>

      <main className="mx-auto" style={{ maxWidth: '960px', padding: '5rem 2rem 6rem' }}>
        <div
          className="text-center mb-4"
          style={{
            fontFamily: tokens.fontAccent,
            fontSize: '0.6875rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: tokens.warmTerra,
          }}
        >
          {t('roadmap.title')}
        </div>
        <h1
          className="text-center mb-4"
          style={{
            fontFamily: tokens.fontDisplay,
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: tokens.charcoal,
            letterSpacing: '-0.015em',
          }}
        >
          {t('roadmap.title')}
        </h1>
        <p
          className="text-center mx-auto mb-14"
          style={{
            fontFamily: tokens.fontBody,
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: tokens.charcoal,
            opacity: 0.78,
            maxWidth: '600px',
          }}
        >
          {t('roadmap.subtitle')}
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {phases.map((phase) => (
            <div
              key={phase.key}
              style={{
                backgroundColor: tokens.paperCream,
                border: `1px solid ${phase.accent}30`,
                borderRadius: '14px 10px 16px 12px',
                padding: '2rem 1.875rem',
                boxShadow: `0 6px 18px rgba(60,56,53,0.05)`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '1.5rem',
                  height: '2px',
                  width: '3rem',
                  backgroundColor: phase.accent,
                  opacity: 0.7,
                }}
              />
              <div className="flex items-center justify-between mb-4">
                <div
                  style={{
                    fontFamily: tokens.fontAccent,
                    fontSize: '0.625rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: phase.accent,
                  }}
                >
                  Phase {phase.key}
                </div>
                <span
                  style={{
                    fontFamily: tokens.fontAccent,
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    padding: '0.25rem 0.625rem',
                    borderRadius: '4px',
                    backgroundColor: `${phase.accent}15`,
                    border: `1px solid ${phase.accent}40`,
                    color: phase.accent,
                  }}
                >
                  {statusLabels[language]?.[phase.status] ?? phase.status}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: tokens.fontDisplay,
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: tokens.charcoal,
                  marginBottom: '1.125rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {t(`roadmap.phase${phase.key}`)}
              </h3>

              <ul className="space-y-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: phase.accent,
                        marginTop: '0.6rem',
                        opacity: 0.6,
                      }}
                    />
                    <span style={{ fontFamily: tokens.fontBody, fontSize: '0.9375rem', color: tokens.charcoal, opacity: 0.85, lineHeight: 1.5 }}>
                      {t(`roadmap.phase${phase.key}.item${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="text-center mt-12 mx-auto max-w-xl"
          style={{
            fontFamily: tokens.fontBody,
            fontSize: '0.875rem',
            fontStyle: 'italic',
            color: tokens.charcoal,
            opacity: 0.6,
            lineHeight: 1.6,
          }}
        >
          {language === 'pl'
            ? 'Roadmapa odzwierciedla nasze obecne plany. Daty i kolejność mogą się zmieniać w oparciu o feedback od pierwszych salonów.'
            : 'The roadmap reflects our current plans. Dates and ordering may shift based on feedback from the first dealerships.'}
        </p>
      </main>
    </div>
  );
}
