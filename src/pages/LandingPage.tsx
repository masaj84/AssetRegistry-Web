import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ContactSection } from '../components/ContactSection';

// TEASER MODE - Controlled by VITE_TEASER_MODE env variable
const TEASER_MODE = import.meta.env.VITE_TEASER_MODE === 'true';

// Coming Soon Toast Component
function ComingSoonToast({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-background border border-orange/50 border-orange/30 px-6 py-4 rounded-lg shadow-lg shadow-[0_0_30px_rgba(251,146,60,0.15)] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-orange/10 bg-orange/20 flex items-center justify-center">
          <span className="text-xl">🚀</span>
        </div>
        <div>
          <p className="font-medium text-orange-light">Coming Soon!</p>
          <p className="text-sm text-muted-foreground">Sign up for our newsletter to be notified when we launch.</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Coming Soon Banner
function ComingSoonBanner() {
  const { language } = useLanguage();
  if (!TEASER_MODE) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange/90 via-magenta/90 to-purple/90 text-white py-2 px-4 text-center text-sm">
      <span className="font-medium">
        {language === 'pl' 
          ? '🚀 MVP już wkrótce! Zapisz się do newslettera, aby być na bieżąco.' 
          : '🚀 MVP coming soon! Subscribe to our newsletter to stay updated.'}
      </span>
      <a href="#contact" className="ml-2 underline hover:no-underline font-semibold">
        {language === 'pl' ? 'Zapisz się →' : 'Subscribe →'}
      </a>
    </div>
  );
}

// Section Header component - Palantir style
function SectionHeader({ title, subtitle, centered = false }: { title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-6 mb-6 ${centered ? 'justify-center' : ''}`}>
        {centered && <div className="flex-1 h-px bg-border bg-gradient-to-r to-orange/30 max-w-24" />}
        <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground text-orange/70">
          {title}
        </h2>
        <div className={`flex-1 h-px bg-border bg-gradient-to-r from-purple/30 ${centered ? 'max-w-24' : ''}`} />
      </div>
      {subtitle && (
        <p className={`text-3xl md:text-4xl font-light ${centered ? 'mx-auto' : ''} max-w-3xl dark:text-foreground/90`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Animated blockchain visualization for hero
function BlockchainVisual() {
  const blockColors = [
    'border-orange/40 hover:border-orange hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]',
    'border-orange-dark/40 hover:border-orange-light hover:shadow-[0_0_30px_rgba(251,146,60,0.25)]',
    'border-magenta/40 hover:border-magenta hover:shadow-[0_0_30px_rgba(232,121,249,0.3)]',
    'border-purple/40 hover:border-purple-light hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    'border-purple-dark/40 hover:border-purple hover:shadow-[0_0_30px_rgba(147,51,234,0.25)]',
  ];

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      {/* Chain links */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 md:gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            {/* Block */}
            <div
              className={`w-16 h-16 md:w-24 md:h-24 border-2 border-foreground/20 bg-background flex items-center justify-center relative group hover:border-foreground transition-all duration-300 ${blockColors[i]}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="absolute inset-2 border border-orange/10" />
              <span className="text-xs md:text-sm font-mono text-muted-foreground group-hover:text-orange-light transition-colors">
                {['#001', '#002', '#003', '#004', '#005'][i]}
              </span>
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange/10 to-purple/10" />
            </div>
            {/* Connector */}
            {i < 4 && (
              <div className="flex items-center gap-1">
                <div className={`w-4 md:w-8 h-0.5 bg-foreground/20 ${i < 2 ? 'bg-gradient-to-r from-orange/40 to-magenta/40' : 'bg-gradient-to-r from-magenta/40 to-purple/40'}`} />
                <div className={`w-1.5 h-1.5 rotate-45 bg-foreground/40 ${i < 2 ? 'bg-orange/60' : 'bg-purple/60'}`} />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

// Trust stats component
function TrustStats() {
  const { t } = useLanguage();
  const stats = [
    { value: '∞', label: t('stats.immutable'), color: 'text-orange' },
    { value: '100%', label: t('stats.transparent'), color: 'text-magenta' },
    { value: '24/7', label: t('stats.accessible'), color: 'text-purple-light' },
  ];

  return (
    <div className="grid grid-cols-3 gap-8 py-12 border-t border-b border-border dark:border-border/50 relative">
      {/* Gradient line at top in dark mode */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/50 to-transparent block" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple/50 to-transparent block" />
      {stats.map((stat, i) => (
        <div key={i} className="text-center group">
          <div className={`text-3xl md:text-4xl font-light mb-2 transition-all duration-300 ${stat.color} group-hover:drop-shadow-[0_0_8px_currentColor]`}>{stat.value}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
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

// Theme Toggle component for landing page
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 flex items-center justify-center border transition-all duration-300 group relative overflow-hidden ${
        theme === 'dark'
          ? 'border-orange/40 hover:border-orange hover:shadow-[0_0_12px_rgba(251,146,60,0.3)]'
          : 'border-border hover:border-foreground'
      }`}
      aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      {/* Glow effect in dark mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange/15 to-purple/10 opacity-50 group-hover:opacity-100 transition-opacity" />
      )}
      {theme === 'light' ? (
        <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors relative z-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-orange-light group-hover:text-orange transition-colors relative z-10 drop-shadow-[0_0_4px_rgba(251,146,60,0.5)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
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
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { t } = useLanguage();
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleComingSoon = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 5000);
  };

  const handleDemo = async () => {
    if (TEASER_MODE) {
      handleComingSoon();
      return;
    }
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
    { phase: 'Phase 1', title: t('roadmap.phase1'), items: [t('roadmap.phase1.item1'), t('roadmap.phase1.item2'), t('roadmap.phase1.item3'), t('roadmap.phase1.item4'), t('roadmap.phase1.item5')] },
    { phase: 'Phase 2', title: t('roadmap.phase2'), items: [t('roadmap.phase2.item1'), t('roadmap.phase2.item2'), t('roadmap.phase2.item3'), t('roadmap.phase2.item4'), t('roadmap.phase2.item5')] },
    { phase: 'Phase 3', title: t('roadmap.phase3'), items: [t('roadmap.phase3.item1'), t('roadmap.phase3.item2'), t('roadmap.phase3.item3'), t('roadmap.phase3.item4'), t('roadmap.phase3.item5')] },
    { phase: 'Phase 4', title: t('roadmap.phase4'), items: [t('roadmap.phase4.item1'), t('roadmap.phase4.item2'), t('roadmap.phase4.item3'), t('roadmap.phase4.item4'), t('roadmap.phase4.item5')] },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Coming Soon Banner & Toast */}
      <ComingSoonBanner />
      <ComingSoonToast show={showComingSoon} onClose={() => setShowComingSoon(false)} />
      
      {/* Dark mode ambient background effects */}
      <div className="block fixed inset-0 pointer-events-none">
        {/* Top-left orange glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Top-right purple glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple/25 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        {/* Bottom-left magenta glow */}
        <div className="absolute bottom-40 -left-20 w-72 h-72 bg-magenta/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        {/* Bottom-right mixed glow */}
        <div className="absolute -bottom-20 right-20 w-96 h-96 bg-purple-dark/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }} />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-orange/5 via-purple/5 to-transparent rounded-full blur-[80px]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border dark:border-border/50 ${TEASER_MODE ? 'top-10' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 border-2 border-orange/60 flex items-center justify-center group-hover:bg-orange/20 transition-colors group-hover:shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                <span className="text-[10px] font-mono font-bold tracking-tighter text-orange/90 group-hover:text-orange transition-colors">T_</span>
              </div>
              <span className="text-sm font-mono font-medium tracking-widest hidden sm:block">TRVE<span className="text-orange">_</span></span>
            </a>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-mono">
              <a href="#problem" className="text-muted-foreground hover:text-orange transition-colors">{t('nav.problem')}</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-orange transition-colors">{t('nav.howItWorks')}</a>
              <a href="#use-cases" className="text-muted-foreground hover:text-orange transition-colors">{t('nav.useCases')}</a>
              <a href="#faq" className="text-muted-foreground hover:text-orange transition-colors">{t('nav.faq')}</a>
              <Link to="/whitepaper" className="text-muted-foreground hover:text-orange transition-colors">{t('nav.whitepaper')}</Link>
              <a href="#contact" className="text-muted-foreground hover:text-orange transition-colors">Kontakt</a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4 font-mono">
              <ThemeToggleButton />
              <LanguageToggle />
              <Button variant="ghost" className="text-sm hidden sm:inline-flex font-mono" onClick={handleDemo} disabled={isDemoLoading}>
                {isDemoLoading ? '...' : t('nav.demo')}
              </Button>
              {TEASER_MODE ? (
                <>
                  <Button variant="ghost" className="text-sm hidden sm:inline-flex font-mono" onClick={handleComingSoon}>
                    {t('nav.login')}
                  </Button>
                  <Button className="text-sm font-mono" onClick={handleComingSoon}>
                    {t('nav.getStarted')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block">
                    <Button variant="ghost" className="text-sm font-mono">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="text-sm font-mono">{t('nav.getStarted')}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pb-16 px-6 relative ${TEASER_MODE ? 'pt-40' : 'pt-32'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Main hero content */}
          <div className="text-center mb-16 relative">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6 inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-orange rounded-full animate-pulse shadow-[0_0_12px_rgba(251,146,60,0.6)]" />
              {t('hero.badge')}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-[1.05]">
              <span className="text-gradient-hero">{t('hero.title1')}</span><br />
              <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-orange-light via-magenta to-purple-light">{t('hero.title2')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground dark:text-muted-foreground/80 mb-12 max-w-3xl mx-auto font-light">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {TEASER_MODE ? (
                <Button size="lg" className="px-8 h-14 text-base bg-gradient-to-r from-orange to-orange-dark text-white border-0 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-shadow" onClick={handleComingSoon}>
                  {t('hero.cta')}
                </Button>
              ) : (
                <Link to="/register">
                  <Button size="lg" className="px-8 h-14 text-base bg-gradient-to-r from-orange to-orange-dark text-white border-0 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-shadow">
                    {t('hero.cta')}
                  </Button>
                </Link>
              )}
              <a href="#how-it-works">
                <Button variant="ghost" size="lg" className="h-14 text-base border-purple/30 hover:border-purple hover:bg-purple/10 hover:text-purple-light">
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </div>
          </div>

          {/* Blockchain visualization */}
          <BlockchainVisual />

          {/* Trust stats */}
          <TrustStats />
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 px-6 border-t border-border dark:border-border/50 relative" id="problem">
        {/* Section background glow */}
        <div className="absolute inset-0 bg-gradient-to-b via-purple/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <SectionHeader title={t('problemSolution.title')} centered />

          <div className="relative">
            {/* Arrow between - desktop only */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 bg-background border border-orange/50 flex items-center justify-center shadow-[0_0_20px_rgba(251,146,60,0.2)]">
                <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-stretch">
              {/* Problem - Left */}
              <div className="border border-border md:border-r-0 p-8 md:p-12 relative bg-gradient-to-br from-orange/[0.03] border-orange/20">
                {/* Red/Orange accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange/60 to-transparent" />

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-orange/20 border border-orange/50" />
                  <p className="text-sm font-medium tracking-widest uppercase text-orange/70">
                    {t('problem.label')}
                  </p>
                </div>
                <h3 className="text-2xl md:text-3xl font-light mb-4">
                  {t('problem.title')}
                </h3>
                <p className="text-muted-foreground mb-10">
                  {t('problem.subtitle')}
                </p>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="text-muted-foreground/60 flex-shrink-0 mt-1">{Icons.money}</div>
                    <div>
                      <h4 className="font-medium mb-1">{t('problem.item1.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('problem.item1.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="text-muted-foreground/60 flex-shrink-0 mt-1">{Icons.clock}</div>
                    <div>
                      <h4 className="font-medium mb-1">{t('problem.item2.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('problem.item2.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="text-muted-foreground/60 flex-shrink-0 mt-1">{Icons.block}</div>
                    <div>
                      <h4 className="font-medium mb-1">{t('problem.item3.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('problem.item3.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution - Right */}
              <div className="border border-purple/40 p-8 md:p-12 relative bg-gradient-to-br from-purple/[0.05] shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                {/* Green/Purple accent line */}
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple/60 to-transparent" />

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-purple/20 border border-purple/50" />
                  <p className="text-sm font-medium tracking-widest uppercase text-purple-light/80">
                    {t('solution.label')}
                  </p>
                </div>
                <h3 className="text-2xl md:text-3xl font-light mb-4">
                  {t('solution.title')}
                </h3>
                <p className="text-muted-foreground mb-10">
                  {t('solution.subtitle')}
                </p>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="text-foreground flex-shrink-0 mt-1">{Icons.lock}</div>
                    <div>
                      <h4 className="font-medium mb-1">{t('solution.item1.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('solution.item1.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="text-foreground flex-shrink-0 mt-1">{Icons.block}</div>
                    <div>
                      <h4 className="font-medium mb-1">{t('solution.item2.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('solution.item2.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="text-foreground flex-shrink-0 mt-1">{Icons.shield}</div>
                    <div>
                      <h4 className="font-medium mb-1">{t('solution.item3.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('solution.item3.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 border-t border-border dark:border-border/50 relative" id="how-it-works">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange/5 to-purple/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <SectionHeader
            title={t('howItWorks.title')}
            subtitle={t('howItWorks.subtitle')}
            centered
          />

          {/* Steps as connected timeline */}
          <div className="relative">
            {/* Connection line - desktop */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-border bg-gradient-to-r from-orange/40 via-magenta/40 to-purple/40" />

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, i) => {
                const stepColors = [
                  'border-orange/30 group-hover:border-orange group-hover:shadow-[0_0_40px_rgba(251,146,60,0.2)]',
                  'border-magenta/30 group-hover:border-magenta group-hover:shadow-[0_0_40px_rgba(232,121,249,0.2)]',
                  'border-purple/30 group-hover:border-purple group-hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]',
                ];
                const textColors = ['group-hover:text-orange', 'group-hover:text-magenta', 'group-hover:text-purple-light'];
                const cornerColors = ['border-orange', 'border-magenta', 'border-purple'];

                return (
                <div key={step.num} className="relative group">
                  {/* Step number circle */}
                  <div className="flex justify-center mb-8">
                    <div className={`w-32 h-32 border-2 border-border group-hover:border-foreground transition-all duration-300 flex items-center justify-center relative bg-background ${stepColors[i]}`}>
                      <span className={`text-5xl font-light text-muted-foreground group-hover:text-foreground transition-colors ${textColors[i]}`}>
                        {step.num}
                      </span>
                      {/* Corner accents */}
                      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-foreground ${cornerColors[i]} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-foreground ${cornerColors[i]} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-foreground ${cornerColors[i]} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-foreground ${cornerColors[i]} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">{step.desc}</p>
                  </div>

                  {/* Arrow connector - mobile */}
                  {i < 2 && (
                    <div className="md:hidden flex justify-center my-6">
                      <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 border-t border-border dark:border-border/50 relative" id="use-cases">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple/5 to-orange/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <SectionHeader
            title={t('useCases.title')}
            subtitle={t('useCases.subtitle')}
            centered
          />

          {/* Categories - larger cards with better hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {useCases.map((useCase, idx) => {
              const cardGlows = [
                'hover:border-orange/50 hover:shadow-[0_0_30px_rgba(251,146,60,0.15)]',
                'hover:border-orange-dark/50 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]',
                'hover:border-magenta/50 hover:shadow-[0_0_30px_rgba(232,121,249,0.15)]',
                'hover:border-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
                'hover:border-purple-light/50 hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]',
              ];
              const iconColors = ['group-hover:text-orange', 'group-hover:text-orange-light', 'group-hover:text-magenta', 'group-hover:text-purple-light', 'group-hover:text-purple'];

              return (
              <div
                key={useCase.title}
                className="group relative"
              >
                <div className={`border border-border dark:border-border/50 p-6 md:p-8 h-full hover:border-foreground transition-all duration-300 bg-card dark:bg-white/5 relative overflow-hidden ${cardGlows[idx]}`}>
                  {/* Background pattern on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 0%, var(--color-foreground) 0%, transparent 50%)',
                      opacity: 0,
                    }}
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 bg-foreground" />

                  {/* Content */}
                  <div className="relative">
                    <div className={`mb-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300 transform group-hover:scale-110 origin-left ${iconColors[idx]}`}>
                      {Icons[useCase.icon]}
                    </div>
                    <h3 className="font-medium mb-2 text-lg">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-transparent group-hover:border-foreground/20 group-hover:border-purple/30 transition-colors duration-300" />
                </div>
              </div>
              );
            })}
          </div>

          {/* For Manufacturers */}
          <div className="mt-24 pt-16 border-t border-border dark:border-border/50">
            <div className="flex items-center gap-6 mb-6">
              <div className="flex-1 h-px bg-border bg-gradient-to-r to-orange/30" />
              <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground text-orange/60">
                B2B
              </span>
              <div className="flex-1 h-px bg-border bg-gradient-to-r from-purple/30" />
            </div>

            <div className="text-center mb-12">
              <p className="text-3xl md:text-4xl font-light max-w-3xl mx-auto">
                {t('manufacturers.title')}
              </p>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                {t('manufacturers.desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              {[
                { title: t('manufacturers.item1.title'), desc: t('manufacturers.item1.desc'), num: '01' },
                { title: t('manufacturers.item2.title'), desc: t('manufacturers.item2.desc'), num: '02' },
                { title: t('manufacturers.item3.title'), desc: t('manufacturers.item3.desc'), num: '03' },
                { title: t('manufacturers.item4.title'), desc: t('manufacturers.item4.desc'), num: '04' },
                { title: t('manufacturers.item5.title'), desc: t('manufacturers.item5.desc'), num: '05' },
              ].map((item, idx) => {
                const numColors = ['text-orange/40 group-hover:text-orange/70', 'text-orange-dark/40 group-hover:text-orange-dark/70', 'text-magenta/40 group-hover:text-magenta/70', 'text-purple/40 group-hover:text-purple/70', 'text-purple-light/40 group-hover:text-purple-light/70'];
                const borderHovers = ['hover:border-orange/40', 'hover:border-orange-dark/40', 'hover:border-magenta/40', 'hover:border-purple/40', 'hover:border-purple-light/40'];
                return (
                <div key={item.num} className={`border border-border dark:border-border/50 p-6 hover:border-foreground transition-colors group ${borderHovers[idx]}`}>
                  <span className={`text-3xl font-light text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors ${numColors[idx]}`}>{item.num}</span>
                  <h3 className="font-medium mb-2 mt-4">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                );
              })}
            </div>

            <p className="text-muted-foreground mt-8 text-center italic">
              {t('manufacturers.summary')}
            </p>
          </div>

          {/* Security - Stolen Flag */}
          <div className="mt-24 pt-16 border-t border-border dark:border-border/50">
            <div className="flex items-center gap-6 mb-6">
              <div className="flex-1 h-px bg-border bg-gradient-to-r to-purple/30" />
              <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground text-purple-light/70">
                Security
              </span>
              <div className="flex-1 h-px bg-border bg-gradient-to-r from-orange/30" />
            </div>

            <div className="text-center mb-12">
              <p className="text-3xl md:text-4xl font-light max-w-3xl mx-auto">
                {t('security.flag.title')}
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 - Description */}
              <div className="border border-border border-purple/30 p-8 hover:border-purple transition-colors relative overflow-hidden group hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-6 text-purple-light">{Icons.flag}</div>
                <p className="text-muted-foreground">
                  {t('security.flag.desc')}
                </p>
              </div>

              {/* Card 2 - Benefits */}
              <div className="border border-border dark:border-border/50 p-8 hover:border-magenta/50 transition-colors hover:shadow-[0_0_30px_rgba(232,121,249,0.1)]">
                <ul className="space-y-4">
                  {[t('security.benefit1'), t('security.benefit2'), t('security.benefit3')].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 border border-magenta/50 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-magenta" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground italic mt-6 pt-4 border-t border-border dark:border-border/50">{t('security.note')}</p>
              </div>

              {/* Card 3 - Warning preview */}
              <div className="border border-orange/40 p-8 bg-orange/[0.05] relative overflow-hidden shadow-[0_0_30px_rgba(251,146,60,0.1)]">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange to-orange-dark" />
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange/20 border border-orange/50 text-orange text-sm font-medium mb-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {t('security.warning')}
                </div>
                <p className="text-muted-foreground">{t('security.warningDesc')}</p>
              </div>
            </div>
          </div>

          {/* Constantly evolving notice */}
          <div className="mt-24 pt-16 border-t border-border dark:border-border/50">
            <div className="border border-dashed border-border border-purple/30 p-8 md:p-10 text-center relative overflow-hidden group hover:border-foreground/50 hover:border-orange/40 transition-colors">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-orange/40 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-magenta/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 bg-purple/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-sm font-medium tracking-wider uppercase text-muted-foreground text-orange/70">
                    {t('useCases.evolving')}
                  </span>
                </div>
                <div className="hidden md:block w-px h-6 bg-border bg-purple/30" />
                <p className="text-muted-foreground text-sm md:text-base">
                  {t('useCases.evolvingDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 px-6 border-t border-border dark:border-border/50 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={t('roadmap.title')}
            subtitle={t('roadmap.subtitle')}
            centered
          />

          {/* Timeline */}
          <div className="relative">
            {/* Horizontal line - desktop */}
            <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-border bg-gradient-to-r from-orange/50 via-magenta/30 to-purple/50" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {roadmapItems.map((item, i) => {
                const phaseColors = [
                  { border: 'border-orange', text: 'text-orange', bullet: 'bg-orange', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]' },
                  { border: 'border-orange-dark/50', text: 'text-orange-dark', bullet: 'bg-orange-dark/50', glow: '' },
                  { border: 'border-magenta/50', text: 'text-magenta/70', bullet: 'bg-magenta/50', glow: '' },
                  { border: 'border-purple/50', text: 'text-purple/70', bullet: 'bg-purple/50', glow: '' },
                ];
                const pc = phaseColors[i];

                return (
                <div key={item.phase} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden lg:flex items-center justify-start mb-8">
                    <div className={`w-12 h-12 border-2 flex items-center justify-center bg-background ${i === 0 ? 'border-foreground ' + pc.border + ' ' + pc.glow : 'border-border ' + pc.border}`}>
                      <span className={`text-sm font-medium ${i === 0 ? 'text-foreground ' + pc.text : 'text-muted-foreground ' + pc.text}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`border-l-2 pl-6 ${i === 0 ? 'border-foreground ' + pc.border : 'border-border ' + pc.border} lg:border-l-0 lg:pl-0`}>
                    <p className={`text-sm mb-1 ${i === 0 ? 'text-foreground font-medium ' + pc.text : 'text-muted-foreground ' + pc.text}`}>
                      {item.phase}
                    </p>
                    <h3 className="text-xl font-medium mb-4">{item.title}</h3>
                    <ul className="space-y-2">
                      {item.items.map((listItem) => (
                        <li key={listItem} className="text-muted-foreground text-sm flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-foreground ' + pc.bullet : 'bg-muted-foreground/50 ' + pc.bullet}`} />
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 border-t border-border dark:border-border/50 relative" id="faq">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple/5 to-orange/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={t('faq.title')}
            subtitle={t('faq.subtitle')}
            centered
          />

          <div className="max-w-3xl mx-auto relative">
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`border transition-all duration-300 ${openFaq === i ? 'border-purple shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-border dark:border-border/50 hover:border-foreground/50 hover:border-purple/40'}`}
                >
                  <button
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <h3 className="font-medium text-lg">{faq.q}</h3>
                    <span className={`flex-shrink-0 w-8 h-8 border flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'border-orange text-orange rotate-45' : 'border-border dark:border-border/50'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                    <p className="text-muted-foreground px-6 pb-6">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-border dark:border-border/50 relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple/10 via-magenta/5 to-orange/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="relative border border-orange/30 p-8 md:p-16 bg-gradient-to-br from-background/80 to-background/60 overflow-hidden">
            {/* Gradient border effect for dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange/20 via-magenta/10 to-purple/20 opacity-0 opacity-100 -z-10" />
            <div className="absolute inset-[1px] -z-10" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange" />

            {/* Glow effects */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange/20 rounded-full blur-[80px] block" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple/20 rounded-full blur-[80px] block" />

            <div className="text-center max-w-3xl mx-auto relative">
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6 inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-orange rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
                {t('cta.badge')}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-gradient-hero">
                {t('cta.title')}
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-light">
                {t('cta.subtitle')}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {TEASER_MODE ? (
                  <Button size="lg" className="px-10 h-14 text-base bg-gradient-to-r from-orange to-orange-dark text-white border-0 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-shadow" onClick={handleComingSoon}>
                    {t('cta.primary')}
                  </Button>
                ) : (
                  <Link to="/register">
                    <Button size="lg" className="px-10 h-14 text-base bg-gradient-to-r from-orange to-orange-dark text-white border-0 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-shadow">
                      {t('cta.primary')}
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="lg" className="h-14 text-base border-purple/30 hover:border-purple hover:bg-purple/10 hover:text-purple-light" onClick={handleDemo} disabled={isDemoLoading}>
                  {isDemoLoading ? '...' : t('cta.secondary')}
                </Button>
              </div>
            </div>
          </div>
        </div>
       </section>

       {/* Contact Section */}
       <ContactSection />

       {/* Footer */}
      <footer className="py-20 px-6 border-t border-border dark:border-border/50 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />
        {/* Dark mode ambient glows */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange/10 rounded-full blur-[100px] block" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple/10 rounded-full blur-[100px] block" />

        <div className="max-w-7xl mx-auto relative">
          {/* Top section with brand and tech badge */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
            {/* Brand */}
            <div className="max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 border-2 border-orange/50 flex items-center justify-center group hover:bg-orange/20 transition-colors hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]">
                  <span className="text-sm font-mono font-bold tracking-tighter text-orange/90 group-hover:text-orange transition-colors">T_</span>
                </div>
                <div>
                  <span className="text-sm font-mono font-medium tracking-widest block">TRVE<span className="text-orange">_</span></span>
                  <span className="text-xs text-muted-foreground">{t('footer.version')}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                {t('footer.tagline')}
              </p>

              {/* Tech stack badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-border border-purple/30 bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange rounded-full animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                  <span className="text-xs font-mono text-muted-foreground">{t('footer.tech')}</span>
                </div>
                <div className="w-px h-4 bg-border bg-purple/30" />
                <span className="text-xs font-mono text-muted-foreground/60">{t('footer.slogan')}</span>
              </div>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
              {/* Product links */}
              <div>
                <h4 className="font-medium mb-5 text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-4 h-px bg-gradient-to-r from-orange" />
                  <span className="text-orange/80">{t('footer.product')}</span>
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><a href="#how-it-works" className="hover:text-orange transition-colors inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-orange transition-all" />{t('nav.howItWorks')}</a></li>
                  <li><a href="#use-cases" className="hover:text-orange transition-colors inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-orange transition-all" />{t('nav.useCases')}</a></li>
                  <li><a href="#faq" className="hover:text-orange transition-colors inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-orange transition-all" />{t('nav.faq')}</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-medium mb-5 text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-4 h-px bg-gradient-to-r from-magenta" />
                  <span className="text-magenta/80">{t('footer.resources')}</span>
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link to="/how-it-works" className="hover:text-magenta transition-colors inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-magenta transition-all" />Guide</Link></li>
                  <li><Link to="/whitepaper" className="hover:text-magenta transition-colors inline-flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-magenta transition-all" />{t('footer.docs')}</Link></li>
                  <li><span className="text-muted-foreground/60 inline-flex items-center gap-2">{t('footer.api')} <span className="text-xs">({t('common.phase2')})</span></span></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-medium mb-5 text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-4 h-px bg-gradient-to-r from-purple" />
                  <span className="text-purple-light/80">{t('footer.contact')}</span>
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="mailto:contact@trve.io" className="hover:text-purple-light transition-colors inline-flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2 h-px bg-purple transition-all" />
                      contact@trve.io
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-purple-light transition-colors inline-flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2 h-px bg-purple transition-all" />
                      {t('footer.contactForm')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border dark:border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <p>{t('footer.copyright')}</p>
                <span className="hidden md:block w-px h-4 bg-border bg-purple/30" />
                <Link to="/privacy" className="hover:text-orange transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-orange transition-colors">Terms</Link>
              </div>

              {/* Scroll to top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange transition-colors"
              >
                <span>{t('footer.backToTop')}</span>
                <div className="w-8 h-8 border border-border border-orange/30 group-hover:border-foreground group-hover:border-orange flex items-center justify-center transition-all group-hover:shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                  <svg className="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform group-hover:text-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default LandingPage;
