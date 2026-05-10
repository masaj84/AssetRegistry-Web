import { Button } from './ui/Button';
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

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        paddingTop: '5rem',
        paddingBottom: '6rem',
        paddingLeft: '1.75rem',
        paddingRight: '2.1rem',
        borderTop: `1px solid ${tokens.warmTerra}20`,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '760px' }}>
        <div className="text-center mb-10">
          <div
            style={{
              fontFamily: tokens.fontAccent,
              fontSize: '0.6875rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: tokens.warmTerra,
              marginBottom: '1.25rem',
            }}
          >
            {t('contact.sectionTitle')}
          </div>
          <h2
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: 'clamp(1.75rem, 4vw, 2.625rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: tokens.charcoal,
              marginBottom: '1.25rem',
              letterSpacing: '-0.015em',
            }}
          >
            {t('contact.headline')}
          </h2>
          <p
            className="mx-auto"
            style={{
              fontFamily: tokens.fontBody,
              fontSize: '1rem',
              lineHeight: 1.6,
              color: tokens.charcoal,
              opacity: 0.78,
              maxWidth: '520px',
            }}
          >
            {t('contact.body')}
          </p>
        </div>

        <div
          className="relative mx-auto"
          style={{
            backgroundColor: tokens.paperCream,
            border: `1px solid ${tokens.warmTerra}30`,
            borderRadius: '14px 10px 16px 12px',
            padding: '2.25rem 2.25rem',
            boxShadow: `0 12px 28px rgba(60,56,53,0.06), 0 4px 10px rgba(60,56,53,0.04)`,
            backgroundImage: `radial-gradient(circle at 90% 0%, ${tokens.warmTerra}10 0%, transparent 45%)`,
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

          {/* Email block */}
          <div className="mb-6">
            <div
              style={{
                fontFamily: tokens.fontAccent,
                fontSize: '0.625rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: tokens.charcoal,
                opacity: 0.55,
                marginBottom: '0.5rem',
              }}
            >
              {t('contact.email')}
            </div>
            <a
              href={`mailto:${t('contact.emailAddress')}`}
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: '1.125rem',
                color: tokens.warmTerra,
                textDecoration: 'none',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                borderBottom: `1px solid ${tokens.warmTerra}40`,
                paddingBottom: '2px',
              }}
            >
              {t('contact.emailAddress')}
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <a href={`mailto:${t('contact.emailAddress')}`}>
              <Button size="lg">{t('contact.writeUs')}</Button>
            </a>
          </div>

          {/* Status indicator */}
          <div
            className="flex items-center gap-3 pt-5"
            style={{ borderTop: `1px dashed ${tokens.warmTerra}25` }}
          >
            <span
              className="inline-block animate-pulse"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: tokens.sage,
                boxShadow: `0 0 8px ${tokens.sage}80`,
              }}
            />
            <span
              style={{
                fontFamily: tokens.fontBody,
                fontSize: '0.875rem',
                color: tokens.charcoal,
                opacity: 0.72,
              }}
            >
              {t('contact.status')}
            </span>
            <span
              className="ml-auto"
              style={{
                fontFamily: tokens.fontBody,
                fontSize: '0.8125rem',
                color: tokens.charcoal,
                opacity: 0.55,
                fontStyle: 'italic',
              }}
            >
              {t('contact.response')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
