import { Link } from 'react-router-dom';
import { TrveLayout } from '../components/layout/TrveLayout';
import { useLanguage } from '../context/LanguageContext';

type IndustryKey = 'watches' | 'art' | 'instruments' | 'other';

interface IndustryPageProps {
  industry: IndustryKey;
}

export default function IndustryPage({ industry }: IndustryPageProps) {
  const { t } = useLanguage();

  return (
    <TrveLayout>
      <main className="trve-wrap trve-sub">
        <div className="trve-sub-head">
          <span className="trve-eyebrow">{t('industry.label')}</span>
          <h1>{t(`industry.${industry}.title`)}</h1>
          <p>{t('industry.subtitle')}</p>
        </div>

        <div className="trve-sub-grid">
          <section className="trve-card">
            <div className="trve-card-head">
              <span className="trve-card-num">01</span>
              <h2>{t(`industry.${industry}.title`)}</h2>
            </div>
            <p>{t(`industry.${industry}.body`)}</p>
          </section>
        </div>

        <div className="trve-cta-banner">
          <p style={{ fontWeight: 500, color: 'var(--fg)' }}>{t('industry.cta.title')}</p>
          <p>{t('industry.cta.body')}</p>
          <div className="trve-cta-row">
            <Link to="/#demo" className="trve-btn trve-btn-primary">{t('industry.cta.button')}</Link>
            <Link to="/#demo" className="trve-btn trve-btn-ghost">{t('dealer.subpage.ctaWrite')}</Link>
          </div>
        </div>
      </main>
    </TrveLayout>
  );
}
