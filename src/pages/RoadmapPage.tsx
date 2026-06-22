import { Link } from 'react-router-dom';
import { TrveLayout } from '../components/layout/TrveLayout';
import { useLanguage } from '../context/LanguageContext';

const phases: Array<{ key: 1 | 2 | 3 | 4; status: 'shipped' | 'now' | 'next' | 'later' }> = [
  { key: 1, status: 'shipped' },
  { key: 2, status: 'now' },
  { key: 3, status: 'next' },
  { key: 4, status: 'later' },
];

export default function RoadmapPage() {
  const { t, language } = useLanguage();

  const statusLabels: Record<string, Record<string, string>> = {
    pl: { shipped: 'Zrobione', now: 'Teraz', next: 'Następne', later: 'Później' },
    en: { shipped: 'Shipped', now: 'Now', next: 'Next', later: 'Later' },
  };

  return (
    <TrveLayout>
      <main className="trve-wrap trve-sub">
        <div className="trve-sub-head">
          <span className="trve-eyebrow">{t('roadmap.title')}</span>
          <h1>{t('roadmap.title')}</h1>
          <p>{t('roadmap.subtitle')}</p>
        </div>

        <div className="trve-sub-grid">
          {phases.map((phase) => (
            <section className="trve-card" key={phase.key}>
              <div className="trve-card-head" style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span className="trve-card-num">Phase 0{phase.key}</span>
                  <h2>{t(`roadmap.phase${phase.key}`)}</h2>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '.62rem',
                    letterSpacing: '.16em',
                    textTransform: 'uppercase',
                    padding: '.3rem .65rem',
                    border: '1px solid var(--line)',
                    color: 'var(--fg)',
                  }}
                >
                  {statusLabels[language]?.[phase.status] ?? phase.status}
                </span>
              </div>
              <ul className="trve-card-list">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>{t(`roadmap.phase${phase.key}.item${i}`)}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="trve-cta-banner">
          <p style={{ fontStyle: 'italic' }}>
            {language === 'pl'
              ? 'Roadmapa odzwierciedla nasze obecne plany. Daty i kolejność mogą się zmieniać w oparciu o feedback od pierwszych salonów.'
              : 'The roadmap reflects our current plans. Dates and ordering may shift based on feedback from the first dealerships.'}
          </p>
          <div className="trve-cta-row">
            <Link to="/#demo" className="trve-btn trve-btn-primary">{t('dealer.subpage.ctaButton')}</Link>
          </div>
        </div>
      </main>
    </TrveLayout>
  );
}
