import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ContactSection } from '../components/ContactSection';

// Section Header component - Palantir style
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          {title}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      {subtitle && (
        <p className="text-3xl md:text-4xl font-light max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Language Toggle component
function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
    >
      {language === 'en' ? 'PL' : 'EN'}
    </button>
  );
}

// Minimalist icons
const Icons = {
  car: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M8 17h.01M16 17h.01M4 12h16M5 17h14a2 2 0 002-2v-4a2 2 0 00-2-2l-2-3H7L5 9a2 2 0 00-2 2v4a2 2 0 002 2z" />
    </svg>
  ),
  watch: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="6" />
      <path d="M12 9v3l2 2M9 2h6M9 22h6" />
    </svg>
  ),
  laptop: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM2 18h20" />
    </svg>
  ),
  art: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M4 4h16v16H4zM4 8h16M8 4v16" />
    </svg>
  ),
  music: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  lock: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  shield: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M12 2l8 4v6c0 5.25-3.5 10-8 11-4.5-1-8-5.75-8-11V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  block: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 5.5l13 13" />
    </svg>
  ),
  money: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M12 2v20M5 10h14M5 14h14" />
    </svg>
  ),
  clock: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  handshake: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M7 11l3-3 4 4 6-6M3 15l4 4 4-4M17 15l4 4-4 4" />
    </svg>
  ),
  box: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM12 13l9-5M12 13v9M12 13L3 8" />
    </svg>
  ),
  flag: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M3 21v-18" />
      <path d="M3 4h13l-3 4 3 4H3" />
    </svg>
  ),
};

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { t } = useLanguage();
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    setIsDemoLoading(true);
    try {
      await loginAsDemo();
      navigate('/app');
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const useCases = [
    { icon: 'car' as const, title: t('useCases.vehicles'), desc: t('useCases.vehicles.desc') },
    { icon: 'watch' as const, title: t('useCases.watches'), desc: t('useCases.watches.desc') },
    { icon: 'art' as const, title: t('useCases.art'), desc: t('useCases.art.desc') },
    { icon: 'music' as const, title: t('useCases.instruments'), desc: t('useCases.instruments.desc') },
    { icon: 'box' as const, title: t('useCases.anything'), desc: t('useCases.anything.desc') },
  ];

  const steps = [
    { num: '01', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
    { num: '02', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
    { num: '03', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') },
  ];

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
  ];

  const roadmapItems = [
    { phase: 'Phase 1', title: t('roadmap.phase1'), items: [t('roadmap.phase1.item1'), t('roadmap.phase1.item2'), t('roadmap.phase1.item3'), t('roadmap.phase1.item4')] },
    { phase: 'Phase 2', title: t('roadmap.phase2'), items: [t('roadmap.phase2.item1'), t('roadmap.phase2.item2'), t('roadmap.phase2.item3'), t('roadmap.phase2.item4')] },
    { phase: 'Phase 3', title: t('roadmap.phase3'), items: [t('roadmap.phase3.item1'), t('roadmap.phase3.item2'), t('roadmap.phase3.item3'), t('roadmap.phase3.item4')] },
    { phase: 'Phase 4', title: t('roadmap.phase4'), items: [t('roadmap.phase4.item1'), t('roadmap.phase4.item2'), t('roadmap.phase4.item3'), t('roadmap.phase4.item4')] },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-foreground flex items-center justify-center">
                <span className="text-xs font-bold">TV</span>
              </div>
              <span className="text-sm font-medium tracking-wide">TRUVALUE</span>
            </div>
             <div className="hidden md:flex items-center gap-8 text-sm">
               <a href="#problem" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.problem')}</a>
               <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.howItWorks')}</a>
               <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.useCases')}</a>
               <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.faq')}</a>
               <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Kontakt</a>
             </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button variant="ghost" className="text-sm" onClick={handleDemo} disabled={isDemoLoading}>
                {isDemoLoading ? '...' : t('nav.demo')}
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="text-sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button className="text-sm">{t('nav.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6">
              {t('hero.badge')}
            </p>
            <h1 className="text-5xl md:text-7xl font-light mb-8 leading-[1.1]">
              {t('hero.title1')}<br />
              <span className="font-normal">{t('hero.title2')}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl font-light">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center gap-4">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  {t('hero.cta')}
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg">
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 px-6 border-t border-border" id="problem">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title={t('problemSolution.title')} />

          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Problem - Left */}
            <div className="border border-border p-8 md:p-12">
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6">
                {t('problem.label')}
              </p>
              <h3 className="text-2xl font-light mb-6">
                {t('problem.title')}
              </h3>
              <p className="text-muted-foreground mb-8">
                {t('problem.subtitle')}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground flex-shrink-0">{Icons.money}</div>
                  <div>
                    <h4 className="font-medium mb-1">{t('problem.item1.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('problem.item1.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground flex-shrink-0">{Icons.clock}</div>
                  <div>
                    <h4 className="font-medium mb-1">{t('problem.item2.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('problem.item2.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground flex-shrink-0">{Icons.block}</div>
                  <div>
                    <h4 className="font-medium mb-1">{t('problem.item3.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('problem.item3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution - Right */}
            <div className="border border-foreground p-8 md:p-12">
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6">
                {t('solution.label')}
              </p>
              <h3 className="text-2xl font-light mb-6">
                {t('solution.title')}
              </h3>
              <p className="text-muted-foreground mb-8">
                {t('solution.subtitle')}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-foreground flex-shrink-0">{Icons.lock}</div>
                  <div>
                    <h4 className="font-medium mb-1">{t('solution.item1.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('solution.item1.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-foreground flex-shrink-0">{Icons.block}</div>
                  <div>
                    <h4 className="font-medium mb-1">{t('solution.item2.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('solution.item2.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-foreground flex-shrink-0">{Icons.shield}</div>
                  <div>
                    <h4 className="font-medium mb-1">{t('solution.item3.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('solution.item3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 border-t border-border" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={t('howItWorks.title')}
            subtitle={t('howItWorks.subtitle')}
          />

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-6xl font-light text-muted-foreground/20 mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 border-t border-border" id="use-cases">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={t('useCases.title')}
            subtitle={t('useCases.subtitle')}
          />

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="group">
                <div className="border border-border p-6 h-full hover:border-foreground transition-colors">
                  <div className="mb-4 text-foreground">{Icons[useCase.icon]}</div>
                  <h3 className="font-medium mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* For Manufacturers */}
          <div className="mt-16">
            <div className="mb-12">
              <p className="text-3xl md:text-4xl font-light max-w-3xl">
                {t('manufacturers.title')}
              </p>
              <p className="text-muted-foreground mt-4 max-w-2xl">
                {t('manufacturers.desc')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <h3 className="font-medium mb-2">{t('manufacturers.item1.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('manufacturers.item1.desc')}</p>
              </div>
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <h3 className="font-medium mb-2">{t('manufacturers.item2.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('manufacturers.item2.desc')}</p>
              </div>
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <h3 className="font-medium mb-2">{t('manufacturers.item3.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('manufacturers.item3.desc')}</p>
              </div>
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <h3 className="font-medium mb-2">{t('manufacturers.item4.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('manufacturers.item4.desc')}</p>
              </div>
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <h3 className="font-medium mb-2">{t('manufacturers.item5.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('manufacturers.item5.desc')}</p>
              </div>
            </div>

            <p className="text-muted-foreground mt-8 italic">
              {t('manufacturers.summary')}
            </p>
          </div>

          {/* Security - Stolen Flag */}
          <div className="mt-16">
            {/* Sub-header */}
            <div className="mb-12">
              <p className="text-3xl md:text-4xl font-light max-w-3xl">
                {t('security.flag.title')}
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 - Description */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <div className="mb-4 text-foreground">{Icons.flag}</div>
                <p className="text-muted-foreground">
                  {t('security.flag.desc')}
                </p>
              </div>

              {/* Card 2 - Benefits */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-muted-foreground">{t('security.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-muted-foreground">{t('security.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-muted-foreground">{t('security.benefit3')}</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground italic mt-4">{t('security.note')}</p>
              </div>

              {/* Card 3 - Warning preview */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {t('security.warning')}
                </div>
                <p className="text-sm text-muted-foreground">{t('security.warningDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={t('roadmap.title')}
            subtitle={t('roadmap.subtitle')}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmapItems.map((item, i) => (
              <div key={item.phase} className={`border-l-2 pl-6 ${i === 0 ? 'border-foreground' : 'border-border'}`}>
                <p className="text-sm text-muted-foreground mb-1">{item.phase}</p>
                <h3 className="text-xl font-medium mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((listItem) => (
                    <li key={listItem} className="text-muted-foreground text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {listItem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 border-t border-border" id="faq">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={t('faq.title')}
            subtitle={t('faq.subtitle')}
          />

          <div className="max-w-3xl">
            <div className="divide-y divide-border">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="py-6 cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{faq.q}</h3>
                    <span className="text-muted-foreground text-2xl">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </div>
                  {openFaq === i && (
                    <p className="text-muted-foreground mt-4">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6">
              {t('cta.badge')}
            </p>
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              {t('cta.subtitle')}
            </p>
            <div className="flex items-center gap-4">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  {t('cta.primary')}
                </Button>
              </Link>
              <Button variant="ghost" size="lg" onClick={handleDemo} disabled={isDemoLoading}>
                {isDemoLoading ? '...' : t('cta.secondary')}
              </Button>
            </div>
          </div>
        </div>
       </section>

       {/* Contact Section */}
       <ContactSection />

       {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border border-foreground flex items-center justify-center">
                  <span className="text-xs font-bold">TV</span>
                </div>
                <span className="text-sm font-medium tracking-wide">TRUVALUE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('footer.tagline')}
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <h4 className="font-medium mb-3">{t('footer.product')}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#how-it-works" className="hover:text-foreground transition-colors">{t('nav.howItWorks')}</a></li>
                  <li><a href="#use-cases" className="hover:text-foreground transition-colors">{t('nav.useCases')}</a></li>
                  <li><a href="#faq" className="hover:text-foreground transition-colors">{t('nav.faq')}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">{t('footer.contact')}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="mailto:hello@truvalue.co" className="hover:text-foreground transition-colors">hello@truvalue.co</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
            <p>{t('footer.slogan')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
