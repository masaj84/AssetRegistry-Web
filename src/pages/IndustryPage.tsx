import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

const tokens = {
  warmTerra: '#E67347',
  paperCream: '#FAF7F0',
  charcoal: '#3C3835',
  sage: '#8B956D',
  fontAccent: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontDisplay: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

type IndustryKey = 'watches' | 'art' | 'instruments' | 'other';

interface IndustryPageProps {
  industry: IndustryKey;
}

export default function IndustryPage({ industry }: IndustryPageProps) {
  const { t } = useLanguage();

  return (
    <div style={{ backgroundColor: tokens.paperCream, minHeight: '100vh' }}>
      {/* Top bar with logo + back link */}
      <div
        style={{
          borderBottom: `1px solid ${tokens.warmTerra}25`,
          padding: '1.25rem 2rem',
        }}
      >
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
            <span
              style={{ fontFamily: tokens.fontAccent, fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.15em', color: tokens.charcoal }}
            >
              TRVE<span style={{ color: tokens.warmTerra }}>_</span>
            </span>
          </Link>
          <Link
            to="/"
            style={{
              fontFamily: tokens.fontBody,
              fontSize: '0.875rem',
              color: tokens.charcoal,
              opacity: 0.7,
              textDecoration: 'none',
            }}
          >
            {t('industry.back')}
          </Link>
        </div>
      </div>

      <main className="mx-auto" style={{ maxWidth: '760px', padding: '5rem 2rem 6rem' }}>
        {/* Industry label */}
        <div
          className="text-center mb-6"
          style={{
            fontFamily: tokens.fontAccent,
            fontSize: '0.6875rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: tokens.warmTerra,
          }}
        >
          {t('industry.label')}
        </div>

        {/* Headline */}
        <h1
          className="text-center mb-6"
          style={{
            fontFamily: tokens.fontDisplay,
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: tokens.charcoal,
            letterSpacing: '-0.015em',
          }}
        >
          {t(`industry.${industry}.title`)}
        </h1>

        {/* Subtitle (generic for all industries) */}
        <p
          className="text-center mx-auto mb-10"
          style={{
            fontFamily: tokens.fontBody,
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: tokens.charcoal,
            opacity: 0.78,
            maxWidth: '600px',
          }}
        >
          {t('industry.subtitle')}
        </p>

        {/* Industry-specific body */}
        <div
          className="mx-auto mb-10"
          style={{
            maxWidth: '640px',
            backgroundColor: tokens.paperCream,
            border: `1px solid ${tokens.warmTerra}30`,
            borderRadius: '14px 10px 16px 12px',
            padding: '2.25rem 2.25rem',
            boxShadow: `0 8px 24px rgba(60,56,53,0.06), 0 2px 8px rgba(60,56,53,0.04)`,
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
              backgroundColor: tokens.warmTerra,
              opacity: 0.7,
            }}
          />
          <p
            style={{
              fontFamily: tokens.fontBody,
              fontSize: '1.0625rem',
              lineHeight: 1.65,
              color: tokens.charcoal,
              opacity: 0.88,
            }}
          >
            {t(`industry.${industry}.body`)}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p
            className="mb-3"
            style={{
              fontFamily: tokens.fontBody,
              fontSize: '1.0625rem',
              fontWeight: 500,
              color: tokens.charcoal,
            }}
          >
            {t('industry.cta.title')}
          </p>
          <p
            className="mb-6"
            style={{
              fontFamily: tokens.fontBody,
              fontSize: '0.9375rem',
              color: tokens.charcoal,
              opacity: 0.78,
            }}
          >
            {t('industry.cta.body')}
          </p>
          <a href="mailto:hello@trve.io">
            <Button size="lg">{t('industry.cta.button')}</Button>
          </a>
          <div
            className="mt-4"
            style={{
              fontFamily: tokens.fontBody,
              fontSize: '0.875rem',
              color: tokens.charcoal,
              opacity: 0.6,
            }}
          >
            <a
              href="mailto:hello@trve.io"
              style={{
                color: tokens.warmTerra,
                textDecoration: 'none',
                borderBottom: `1px solid ${tokens.warmTerra}40`,
                fontWeight: 500,
              }}
            >
              {t('industry.cta.email')}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
