import { Link } from 'react-router-dom';
import { TrveLayout } from '../components/layout/TrveLayout';
import { useLanguage } from '../context/LanguageContext';

const sections = [1, 2, 3, 4, 5] as const;

export default function TechPage() {
  const { t } = useLanguage();

  return (
    <TrveLayout>
      <main className="trve-wrap trve-sub">
        <div className="trve-sub-head">
          <span className="trve-eyebrow">{t('tech.label')}</span>
          <h1>{t('tech.title')}</h1>
          <p>{t('tech.subtitle')}</p>
        </div>

        <div className="trve-sub-grid">
          {sections.map((i) => (
            <section className="trve-card" key={i}>
              <div className="trve-card-head">
                <span className="trve-card-num">0{i}</span>
                <h2>{t(`tech.section${i}.title`)}</h2>
              </div>
              <p>{t(`tech.section${i}.body`)}</p>
            </section>
          ))}
        </div>

        <div className="trve-cta-banner">
          <p>{t('dealer.subpage.ctaTitle')}</p>
          <div className="trve-cta-row">
            <Link to="/#demo" className="trve-btn trve-btn-primary">{t('dealer.subpage.ctaButton')}</Link>
          </div>
        </div>
      </main>
    </TrveLayout>
  );
}
