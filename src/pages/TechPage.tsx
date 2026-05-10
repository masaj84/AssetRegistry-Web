import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { GenesisProof } from '../components/GenesisProof';
import { useLanguage } from '../context/LanguageContext';

const tokens = {
  warmTerra: '#E67347',
  paperCream: '#FAF7F0',
  charcoal: '#3C3835',
  sage: '#8B956D',
  inkBlue: '#2B4C5E',
  fontAccent: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontDisplay: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const sections = [1, 2, 3, 4, 5] as const;

export default function TechPage() {
  const { t, language } = useLanguage();

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

      <main className="mx-auto" style={{ maxWidth: '760px', padding: '5rem 2rem 6rem' }}>
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
          {t('tech.label')}
        </div>
        <h1
          className="text-center mb-5"
          style={{
            fontFamily: tokens.fontDisplay,
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: tokens.charcoal,
            letterSpacing: '-0.015em',
          }}
        >
          {t('tech.title')}
        </h1>
        <p
          className="text-center mx-auto mb-14"
          style={{
            fontFamily: tokens.fontBody,
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: tokens.charcoal,
            opacity: 0.78,
            maxWidth: '560px',
          }}
        >
          {t('tech.subtitle')}
        </p>

        <div className="space-y-7">
          {sections.map((i) => (
            <section
              key={i}
              style={{
                backgroundColor: tokens.paperCream,
                border: `1px solid ${tokens.warmTerra}30`,
                borderRadius: '14px 10px 16px 12px',
                padding: '2rem 2rem 2rem 2.25rem',
                boxShadow: `0 4px 14px rgba(60,56,53,0.04)`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '1.5rem',
                  height: '2px',
                  width: '2.5rem',
                  backgroundColor: tokens.warmTerra,
                  opacity: 0.7,
                }}
              />
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  style={{
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    fontSize: '0.75rem',
                    color: tokens.warmTerra,
                    opacity: 0.85,
                    fontWeight: 500,
                  }}
                >
                  0{i}
                </span>
                <h2
                  style={{
                    fontFamily: tokens.fontDisplay,
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: tokens.charcoal,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t(`tech.section${i}.title`)}
                </h2>
              </div>
              <p
                style={{
                  fontFamily: tokens.fontBody,
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: tokens.charcoal,
                  opacity: 0.86,
                }}
              >
                {t(`tech.section${i}.body`)}
              </p>
            </section>
          ))}
        </div>
      </main>

      {/* Genesis proof - moved here from landing */}
      <GenesisProof />

      {/* CTA back to landing */}
      <section
        style={{
          padding: '3rem 2rem 5rem',
          textAlign: 'center',
          borderTop: `1px solid ${tokens.warmTerra}25`,
        }}
      >
        <p
          className="mb-4"
          style={{
            fontFamily: tokens.fontBody,
            fontSize: '1rem',
            color: tokens.charcoal,
            opacity: 0.78,
          }}
        >
          {language === 'pl' ? 'Gotowy żeby porozmawiać o wdrożeniu?' : 'Ready to talk about a deployment?'}
        </p>
        <Link to="/#contact">
          <Button size="lg">{language === 'pl' ? 'Umów demo' : 'Book a demo'}</Button>
        </Link>
      </section>
    </div>
  );
}
