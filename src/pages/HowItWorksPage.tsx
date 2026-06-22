import { Link } from 'react-router-dom';
import { TrveLayout } from '../components/layout/TrveLayout';
import { useLanguage } from '../context/LanguageContext';

const steps = [
  { number: '01', titleKey: 'howItWorks.step1Title', descKey: 'howItWorks.step1Desc' },
  { number: '02', titleKey: 'howItWorks.step2Title', descKey: 'howItWorks.step2Desc' },
  { number: '03', titleKey: 'howItWorks.step3Title', descKey: 'howItWorks.step3Desc' },
  { number: '04', titleKey: 'howItWorks.step4Title', descKey: 'howItWorks.step4Desc' },
];

const benefits = [
  { titleKey: 'howItWorks.benefit1Title', descKey: 'howItWorks.benefit1Desc' },
  { titleKey: 'howItWorks.benefit2Title', descKey: 'howItWorks.benefit2Desc' },
  { titleKey: 'howItWorks.benefit3Title', descKey: 'howItWorks.benefit3Desc' },
  { titleKey: 'howItWorks.benefit4Title', descKey: 'howItWorks.benefit4Desc' },
];

const statusExplanations = [
  { status: 'DRAFT', labelKey: 'status.draft', descKey: 'howItWorks.statusDraftDesc' },
  { status: 'VERIFIED', labelKey: 'status.verified', descKey: 'howItWorks.statusVerifiedDesc' },
  { status: 'MINTED', labelKey: 'status.minted', descKey: 'howItWorks.statusMintedDesc' },
];

export function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <TrveLayout>
      <main className="trve-wrap trve-sub">
        <div className="trve-sub-head">
          <span className="trve-eyebrow">TRVE_</span>
          <h1>{t('howItWorks.heroTitle')}</h1>
          <p>{t('howItWorks.heroSubtitle')}</p>
        </div>

        <div className="trve-sub-grid">
          <section className="trve-card">
            <div className="trve-card-head">
              <span className="trve-card-num">01</span>
              <h2>{t('howItWorks.whatIsAssetTitle')}</h2>
            </div>
            <p>{t('howItWorks.whatIsAssetDesc')}</p>
          </section>

          <section className="trve-card">
            <div className="trve-card-head">
              <span className="trve-card-num">02</span>
              <h2>{t('howItWorks.stepsTitle')}</h2>
            </div>
            <ul className="trve-card-list">
              {steps.map((s) => (
                <li key={s.number}>
                  <b>{s.number} · {t(s.titleKey)}</b> — {t(s.descKey)}
                </li>
              ))}
            </ul>
          </section>

          <section className="trve-card">
            <div className="trve-card-head">
              <span className="trve-card-num">03</span>
              <h2>{t('howItWorks.statusTitle')}</h2>
            </div>
            <ul className="trve-card-list">
              {statusExplanations.map((s) => (
                <li key={s.status}>
                  <b>{t(s.labelKey)}</b> — {t(s.descKey)}
                </li>
              ))}
            </ul>
          </section>

          <section className="trve-card">
            <div className="trve-card-head">
              <span className="trve-card-num">04</span>
              <h2>{t('howItWorks.benefitsTitle')}</h2>
            </div>
            <ul className="trve-card-list">
              {benefits.map((b, i) => (
                <li key={i}>
                  <b>{t(b.titleKey)}</b> — {t(b.descKey)}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="trve-cta-banner">
          <p style={{ fontWeight: 500, color: 'var(--fg)' }}>{t('howItWorks.ctaTitle')}</p>
          <p>{t('howItWorks.ctaDesc')}</p>
          <div className="trve-cta-row">
            <Link to="/#demo" className="trve-btn trve-btn-primary">{t('dealer.subpage.ctaButton')}</Link>
            <Link to="/whitepaper" className="trve-btn trve-btn-ghost">{t('howItWorks.readWhitepaper')}</Link>
          </div>
        </div>
      </main>
    </TrveLayout>
  );
}

export default HowItWorksPage;
