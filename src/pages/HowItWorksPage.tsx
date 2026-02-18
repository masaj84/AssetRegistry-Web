import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const steps = [
  {
    number: '01',
    titleKey: 'howItWorks.step1Title',
    descKey: 'howItWorks.step1Desc',
    icon: 'M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z',
    colorClass: 'text-blue-500 dark:text-blue-400',
    bgClass: 'bg-blue-500/10 dark:bg-blue-500/20',
  },
  {
    number: '02',
    titleKey: 'howItWorks.step2Title',
    descKey: 'howItWorks.step2Desc',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
    colorClass: 'text-orange dark:text-orange',
    bgClass: 'bg-orange/10 dark:bg-orange/20',
  },
  {
    number: '03',
    titleKey: 'howItWorks.step3Title',
    descKey: 'howItWorks.step3Desc',
    icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
    colorClass: 'text-amber-500 dark:text-amber-400',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
  },
  {
    number: '04',
    titleKey: 'howItWorks.step4Title',
    descKey: 'howItWorks.step4Desc',
    icon: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6',
    colorClass: 'text-emerald-500 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
  },
];

const benefits = [
  {
    titleKey: 'howItWorks.benefit1Title',
    descKey: 'howItWorks.benefit1Desc',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z',
  },
  {
    titleKey: 'howItWorks.benefit2Title',
    descKey: 'howItWorks.benefit2Desc',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    titleKey: 'howItWorks.benefit3Title',
    descKey: 'howItWorks.benefit3Desc',
    icon: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z',
  },
  {
    titleKey: 'howItWorks.benefit4Title',
    descKey: 'howItWorks.benefit4Desc',
    icon: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
  },
];

const statusExplanations = [
  {
    status: 'DRAFT',
    labelKey: 'status.draft',
    descKey: 'howItWorks.statusDraftDesc',
    colorClass: 'text-muted-foreground',
    dotClass: 'bg-muted-foreground/50',
  },
  {
    status: 'VERIFIED',
    labelKey: 'status.verified',
    descKey: 'howItWorks.statusVerifiedDesc',
    colorClass: 'text-amber-500',
    dotClass: 'bg-amber-500',
  },
  {
    status: 'MINTED',
    labelKey: 'status.minted',
    descKey: 'howItWorks.statusMintedDesc',
    colorClass: 'text-emerald-500',
    dotClass: 'bg-emerald-500',
  },
];

export function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border dark:border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground dark:bg-gradient-to-br dark:from-orange dark:to-purple flex items-center justify-center">
              <span className="text-background text-sm font-bold">T</span>
            </div>
            <span className="font-semibold tracking-tight">TRVE</span>
          </Link>
          <Link
            to="/app"
            className="h-10 px-4 border border-border dark:border-border/50 hover:border-foreground dark:hover:border-orange/60 flex items-center gap-2 text-sm transition-colors"
          >
            {t('common.goToApp')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-light">
            <span className="text-gradient dark:text-gradient-hero">{t('howItWorks.heroTitle')}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.heroSubtitle')}
          </p>
        </section>

        {/* What is TRVE Asset */}
        <section className="border border-border dark:border-border/50 p-8 card-hover-glow">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 border border-border dark:border-purple/40 flex items-center justify-center flex-shrink-0 dark:glow-purple">
              <svg className="w-7 h-7 text-muted-foreground dark:text-purple" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-light mb-3 dark:text-purple-light">{t('howItWorks.whatIsAssetTitle')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('howItWorks.whatIsAssetDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* 4 Steps */}
        <section className="space-y-8">
          <h2 className="text-2xl font-light text-center">{t('howItWorks.stepsTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border border-border dark:border-border/50 p-6 relative group hover:border-foreground/30 dark:hover:border-orange/30 transition-all card-hover-glow"
              >
                <div className="absolute top-4 right-4 text-4xl font-light text-border dark:text-border/30">
                  {step.number}
                </div>
                <div className={`w-12 h-12 ${step.bgClass} flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 ${step.colorClass}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d={step.icon} />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Status Explanations */}
        <section className="space-y-8">
          <h2 className="text-2xl font-light text-center">{t('howItWorks.statusTitle')}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {statusExplanations.map((item) => (
              <div
                key={item.status}
                className="border border-border dark:border-border/50 p-5 text-center card-hover-glow"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${item.dotClass}`} />
                  <span className={`font-medium ${item.colorClass}`}>{t(item.labelKey)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-8">
          <h2 className="text-2xl font-light text-center">{t('howItWorks.benefitsTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 border border-border dark:border-border/50 card-hover-glow"
              >
                <div className="w-10 h-10 border border-border dark:border-orange/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-muted-foreground dark:text-orange" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d={benefit.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t(benefit.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(benefit.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center border border-border dark:border-purple/30 bg-foreground/[0.02] dark:bg-purple/5 p-10 space-y-6">
          <h2 className="text-2xl font-light">{t('howItWorks.ctaTitle')}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('howItWorks.ctaDesc')}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/app/assets/new"
              className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" />
              </svg>
              {t('howItWorks.ctaButton')}
            </Link>
            <Link
              to="/whitepaper"
              className="h-12 px-8 border border-border dark:border-border/50 hover:border-foreground dark:hover:border-orange/60 flex items-center gap-2 transition-colors"
            >
              {t('howItWorks.readWhitepaper')}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border/50 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 TRVE. {t('footer.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
}

export default HowItWorksPage;
