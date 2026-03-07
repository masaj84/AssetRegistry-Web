import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

import { ContactSection } from '../components/ContactSection';
import { GenesisProof } from '../components/GenesisProof';

// TEASER MODE - Controlled by VITE_TEASER_MODE env variable
const TEASER_MODE = import.meta.env.VITE_TEASER_MODE === 'true';

// Human-centered design tokens - inspired by real places and cultures
const humanTokens = {
  colors: {
    // Inspired by Japanese ceramics + Brazilian sunset
    warmTerra: '#E67347',    // Warm terracotta 
    richClay: '#B85C38',     // Deep clay
    dustyRose: '#D4A574',    // Dusty rose gold
    inkBlue: '#2B4C5E',      // Ink blue (not perfect blue-600!)
    paperCream: '#FAF7F0',   // Warm paper cream
    charcoal: '#3C3835',     // Warm charcoal (not gray-800)
    sage: '#8B956D',         // Sage green accent
    rust: '#A0522D',         // Rust red accent
  },
  spacing: {
    // Organic spacing - slightly irregular
    xs: '0.375rem',    // 6px
    sm: '0.825rem',    // 13px (not 12px)
    md: '1.75rem',     // 28px (not 24px or 32px)  
    lg: '2.875rem',    // 46px (not 48px)
    xl: '4.125rem',    // 66px (not 64px)
    xxl: '6.25rem',    // 100px (not 96px)
  },
  fonts: {
    // Non-AI font pairing: Editorial + Suisse
    display: '"Editorial New", "Times New Roman", serif',
    body: '"Suisse Int\'l", -apple-system, BlinkMacSystemFont, sans-serif', 
    accent: '"GT Walsheim", "Helvetica Neue", sans-serif'
  }
};

// Organic animation timings
const organicTimings = {
  quick: '180ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  smooth: '320ms cubic-bezier(0.23, 1, 0.32, 1)',
  flowing: '480ms cubic-bezier(0.19, 1, 0.22, 1)',
};

// Human typography component with subtle imperfections
function HumanText({ 
  as: Component = 'p', 
  variant = 'body', 
  children, 
  className = '',
  ...props 
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  variant?: 'display' | 'headline' | 'body' | 'accent' | 'small';
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    display: `font-family: ${humanTokens.fonts.display}; font-size: clamp(2.5rem, 8vw, 6rem); line-height: 0.95; font-weight: 300; letter-spacing: -0.02em;`,
    headline: `font-family: ${humanTokens.fonts.display}; font-size: clamp(1.5rem, 4vw, 2.5rem); line-height: 1.1; font-weight: 400;`,
    body: `font-family: ${humanTokens.fonts.body}; font-size: 1.125rem; line-height: 1.6; font-weight: 400;`,
    accent: `font-family: ${humanTokens.fonts.accent}; font-size: 0.875rem; line-height: 1.4; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;`,
    small: `font-family: ${humanTokens.fonts.body}; font-size: 0.9375rem; line-height: 1.5; font-weight: 400;`,
  };

  return (
    <Component 
      style={{ 
        ...Object.fromEntries(variants[variant].split('; ').map(s => s.split(': '))),
        // Subtle imperfections
        transform: 'translateX(-0.5px) translateY(0.2px)'
      }}
      className={`text-transparent bg-clip-text ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

// Bento-style card with organic imperfections
function BentoCard({ 
  children, 
  className = '',
  size = 'default',
  accent = 'terra'
}: {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'default' | 'large' | 'wide';
  accent?: 'terra' | 'sage' | 'rust' | 'ink';
}) {
  const sizeClasses = {
    small: 'p-6 min-h-[180px]',
    default: 'p-8 min-h-[240px]',  
    large: 'p-10 min-h-[320px]',
    wide: 'p-8 min-h-[200px] col-span-2'
  };
  
  const accentColors = {
    terra: humanTokens.colors.warmTerra,
    sage: humanTokens.colors.sage,
    rust: humanTokens.colors.rust,
    ink: humanTokens.colors.inkBlue,
  };

  return (
    <div 
      className={`group relative overflow-hidden transition-all ${organicTimings.smooth} ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: humanTokens.colors.paperCream,
        border: `1px solid ${accentColors[accent]}20`,
        borderRadius: '12px 8px 14px 10px', // Organic, imperfect corners
        transform: 'translateY(-1px) rotate(0.1deg)', // Subtle tilt
        boxShadow: `
          0 2px 8px rgba(0,0,0,0.04),
          0 1px 3px rgba(0,0,0,0.06),
          inset 0 1px 0 rgba(255,255,255,0.8)
        `,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) rotate(-0.05deg)';
        e.currentTarget.style.boxShadow = `
          0 8px 24px rgba(0,0,0,0.08),
          0 4px 12px rgba(0,0,0,0.08)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px) rotate(0.1deg)';
        e.currentTarget.style.boxShadow = `
          0 2px 8px rgba(0,0,0,0.04),
          0 1px 3px rgba(0,0,0,0.06)
        `;
      }}
    >
      {/* Subtle accent line - imperfect placement */}
      <div 
        className="absolute top-0 left-3 h-0.5 w-8 opacity-60"
        style={{ backgroundColor: accentColors[accent] }}
      />
      
      {children}
    </div>
  );
}

// Coming Soon Toast Component - keep from original
function ComingSoonToast({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div 
        className="px-6 py-4 rounded-lg shadow-lg flex items-center gap-4"
        style={{
          backgroundColor: humanTokens.colors.paperCream,
          border: `1px solid ${humanTokens.colors.warmTerra}50`,
          boxShadow: `0 0 30px ${humanTokens.colors.warmTerra}15`
        }}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${humanTokens.colors.warmTerra}20` }}
        >
          <span className="text-xl">🚀</span>
        </div>
        <div>
          <p className="font-medium" style={{ color: humanTokens.colors.warmTerra }}>Coming Soon!</p>
          <p className="text-sm" style={{ color: humanTokens.colors.charcoal, opacity: 0.7 }}>Sign up for our newsletter to be notified when we launch.</p>
        </div>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function LandingPageHuman() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const { t } = useLanguage();
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  // Custom styles for human design
  const humanStyles = `
    .human-gradient {
      background: linear-gradient(135deg, ${humanTokens.colors.warmTerra}15 0%, ${humanTokens.colors.dustyRose}08 50%, ${humanTokens.colors.sage}12 100%);
    }
    
    .human-text-gradient {
      background: linear-gradient(135deg, ${humanTokens.colors.charcoal} 0%, ${humanTokens.colors.inkBlue} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .human-accent-gradient {
      background: linear-gradient(90deg, ${humanTokens.colors.warmTerra} 0%, ${humanTokens.colors.rust} 100%);
      -webkit-background-clip: text;  
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .organic-shadow {
      box-shadow: 
        2px 8px 24px rgba(75, 85, 99, 0.08),
        -1px 2px 12px rgba(75, 85, 99, 0.04),
        0 0 0 1px rgba(75, 85, 99, 0.05);
    }
    
    @keyframes gentle-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(0.5deg); }
    }
    
    .gentle-float {
      animation: gentle-float 6s ease-in-out infinite;
    }
    
    .gentle-float:nth-child(2) {
      animation-delay: 1s;
    }
    
    .gentle-float:nth-child(3) {
      animation-delay: 2s;  
    }
  `;

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

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: humanTokens.colors.paperCream }}>
      <style dangerouslySetInnerHTML={{ __html: humanStyles }} />
      
      {/* Coming Soon Toast */}
      <ComingSoonToast show={showComingSoon} onClose={() => setShowComingSoon(false)} />
      
      {/* Organic background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-20 -right-32 w-96 h-96 rounded-full gentle-float opacity-30"
          style={{ 
            background: `radial-gradient(circle, ${humanTokens.colors.dustyRose}20 0%, transparent 70%)`,
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-32 -left-24 w-80 h-80 rounded-full gentle-float opacity-25"
          style={{ 
            background: `radial-gradient(circle, ${humanTokens.colors.sage}25 0%, transparent 70%)`,
            filter: 'blur(50px)',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-20"
          style={{ 
            background: `radial-gradient(ellipse, ${humanTokens.colors.warmTerra}15 0%, transparent 60%)`,
            filter: 'blur(60px)',
            transform: 'rotate(15deg)'
          }}
        />
      </div>

      {/* Navigation - organic asymmetry */}
      <nav 
        className="fixed left-0 right-0 z-40 backdrop-blur-lg"
        style={{ 
          backgroundColor: `${humanTokens.colors.paperCream}95`,
          borderBottom: `1px solid ${humanTokens.colors.warmTerra}20`,
          top: TEASER_MODE ? '2.5rem' : '0'
        }}
      >
        <div 
          className="mx-auto px-5 py-4"
          style={{ maxWidth: '1280px', paddingLeft: '1.75rem', paddingRight: '2.1rem' }}
        >
          <div className="flex items-center justify-between">
            {/* Logo with organic imperfection */}
            <Link to="/" className="flex items-center gap-3 group">
              <div 
                className="flex items-center justify-center transition-all"
                style={{ 
                  width: '2.375rem',
                  height: '2.375rem',
                  border: `2px solid ${humanTokens.colors.warmTerra}`,
                  backgroundColor: `${humanTokens.colors.warmTerra}10`,
                  borderRadius: '6px 4px 8px 5px', // Organic corners
                  transition: organicTimings.smooth
                }}
              >
                <span 
                  style={{ 
                    fontFamily: humanTokens.fonts.accent,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: humanTokens.colors.warmTerra,
                    letterSpacing: '-0.02em'
                  }}
                >
                  T_
                </span>
              </div>
              <div style={{ fontFamily: humanTokens.fonts.accent }}>
                <span 
                  className="hidden sm:block human-accent-gradient"
                  style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    letterSpacing: '0.15em'
                  }}
                >
                  TRVE<span style={{ color: humanTokens.colors.warmTerra }}>_</span>
                </span>
              </div>
            </Link>

            {/* Nav links - asymmetric spacing */}
            <div 
              className="hidden lg:flex items-center gap-8"
              style={{ fontFamily: humanTokens.fonts.body }}
            >
              {[
                { href: "#problem", text: t('nav.problem') },
                { href: "#how-it-works", text: t('nav.howItWorks') },  
                { href: "#use-cases", text: t('nav.useCases') },
                { href: "#faq", text: t('nav.faq') },
                { href: "/whitepaper", text: t('nav.whitepaper'), isLink: true },
                { href: "#contact", text: "Contact" }
              ].map((item) => (
                item.isLink ? (
                  <Link 
                    key={item.href}
                    to={item.href}
                    style={{ 
                      color: humanTokens.colors.charcoal,
                      fontSize: '0.9375rem',
                      fontWeight: 400,
                      transition: organicTimings.quick
                    }}
                    className="hover:opacity-70"
                  >
                    {item.text}
                  </Link>
                ) : (
                  <a 
                    key={item.href}
                    href={item.href}
                    style={{ 
                      color: humanTokens.colors.charcoal,
                      fontSize: '0.9375rem',
                      fontWeight: 400,
                      transition: organicTimings.quick
                    }}
                    className="hover:opacity-70"
                  >
                    {item.text}
                  </a>
                )
              ))}
            </div>

            {/* Actions - organic button styling */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleDemo} disabled={isDemoLoading}>
                {isDemoLoading ? '...' : t('nav.demo')}
              </Button>
              {TEASER_MODE ? (
                <Button onClick={handleComingSoon}>
                  {t('nav.getStarted')}
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/register">
                    <Button>{t('nav.getStarted')}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Bento-style asymmetric layout */}
      <section 
        className="relative"
        style={{ 
          paddingTop: TEASER_MODE ? '8rem' : '6.5rem',
          paddingBottom: '5.25rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          {/* Hero content - organic positioning */}
          <div 
            className="text-center mb-16 relative"
            style={{ transform: 'translateX(-2px)' }}
          >
            <div className="mb-6 flex items-center justify-center">
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${humanTokens.colors.sage}15`,
                  border: `1px solid ${humanTokens.colors.sage}30`,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: humanTokens.colors.sage }}
                />
                <HumanText as="span" variant="accent" className="human-accent-gradient">
                  {t('hero.badge')}
                </HumanText>
              </div>
            </div>
            
            <HumanText as="h1" variant="display" className="human-text-gradient mb-8">
              {t('hero.title1')}<br />
              <span className="human-accent-gradient">{t('hero.title2')}</span>
            </HumanText>
            
            <HumanText 
              as="p" 
              variant="body" 
              className="mb-12 max-w-3xl mx-auto"
              style={{ 
                color: humanTokens.colors.charcoal,
                opacity: 0.8,
                transform: 'translateX(1px)'
              }}
            >
              {t('hero.subtitle')}
            </HumanText>

            {/* CTA buttons - organic spacing */}
            <div 
              className="flex items-center justify-center gap-4 flex-wrap"
              style={{ transform: 'translateY(-2px)' }}
            >
              {TEASER_MODE ? (
                <Button 
                  size="lg" 
                  onClick={handleComingSoon}
                  className="organic-shadow"
                >
                  {t('hero.cta')}
                </Button>
              ) : (
                <Link to="/register">
                  <Button size="lg" className="organic-shadow">
                    {t('hero.cta')}
                  </Button>
                </Link>
              )}
              <a href="#how-it-works">
                <Button variant="ghost" size="lg">
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section - Bento-style layout */}
      <section 
        className="relative" 
        id="problem"
        style={{ 
          paddingTop: '5.75rem',
          paddingBottom: '6.125rem', 
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="text-center mb-16">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-6 block">
              {t('problemSolution.title')}
            </HumanText>
          </div>

          {/* Bento grid - asymmetric problem/solution */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Problem Card */}
            <BentoCard size="large" accent="rust" className="md:row-span-1">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <HumanText as="span" variant="accent" style={{ color: humanTokens.colors.rust }}>
                    {t('problem.label')}
                  </HumanText>
                  <HumanText as="h3" variant="headline" className="human-text-gradient mb-4 mt-2">
                    {t('problem.title')}
                  </HumanText>
                  <HumanText as="p" variant="small" style={{ color: humanTokens.colors.charcoal, opacity: 0.7 }}>
                    {t('problem.subtitle')}
                  </HumanText>
                </div>
                
                <div className="space-y-4 mt-8">
                  {[
                    { title: t('problem.item1.title'), desc: t('problem.item1.desc') },
                    { title: t('problem.item2.title'), desc: t('problem.item2.desc') },
                    { title: t('problem.item3.title'), desc: t('problem.item3.desc') }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div 
                        className="w-6 h-6 mt-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${humanTokens.colors.rust}20` }}
                      />
                      <div>
                        <HumanText as="h4" variant="small" style={{ fontWeight: 500 }}>
                          {item.title}
                        </HumanText>
                        <HumanText as="p" variant="small" style={{ opacity: 0.7, fontSize: '0.875rem' }}>
                          {item.desc}
                        </HumanText>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Solution Card */}
            <BentoCard size="large" accent="sage" className="md:row-span-1">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <HumanText as="span" variant="accent" style={{ color: humanTokens.colors.sage }}>
                    {t('solution.label')}
                  </HumanText>
                  <HumanText as="h3" variant="headline" className="human-text-gradient mb-4 mt-2">
                    {t('solution.title')}
                  </HumanText>
                  <HumanText as="p" variant="small" style={{ color: humanTokens.colors.charcoal, opacity: 0.7 }}>
                    {t('solution.subtitle')}
                  </HumanText>
                </div>
                
                <div className="space-y-4 mt-8">
                  {[
                    { title: t('solution.item1.title'), desc: t('solution.item1.desc') },
                    { title: t('solution.item2.title'), desc: t('solution.item2.desc') },
                    { title: t('solution.item3.title'), desc: t('solution.item3.desc') }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div 
                        className="w-6 h-6 mt-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${humanTokens.colors.sage}30` }}
                      />
                      <div>
                        <HumanText as="h4" variant="small" style={{ fontWeight: 500 }}>
                          {item.title}
                        </HumanText>
                        <HumanText as="p" variant="small" style={{ opacity: 0.7, fontSize: '0.875rem' }}>
                          {item.desc}
                        </HumanText>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* How It Works Section - Organic flow */}
      <section 
        className="relative" 
        id="how-it-works"
        style={{ 
          paddingTop: '5.25rem',
          paddingBottom: '6.375rem',
          paddingLeft: '1.75rem', 
          paddingRight: '2.1rem'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="text-center mb-20">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-6 block">
              {t('howItWorks.title')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-3xl mx-auto">
              {t('howItWorks.subtitle')}
            </HumanText>
          </div>

          {/* Organic step flow - not perfect grid */}
          <div className="space-y-12">
            {[
              { num: '01', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc'), accent: 'terra' },
              { num: '02', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc'), accent: 'sage' },
              { num: '03', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc'), accent: 'rust' }
            ].map((step, i) => (
              <div 
                key={step.num} 
                className="flex items-center gap-8"
                style={{
                  flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                  marginLeft: i % 2 === 0 ? '0' : '2rem',
                  marginRight: i % 2 === 0 ? '2rem' : '0'
                }}
              >
                <div className="flex-1">
                  <BentoCard size="default" accent={step.accent as any}>
                    <HumanText as="span" variant="accent" style={{ color: humanTokens.colors[step.accent as keyof typeof humanTokens.colors] }}>
                      Step {step.num}
                    </HumanText>
                    <HumanText as="h3" variant="headline" className="human-text-gradient mb-4 mt-2">
                      {step.title}
                    </HumanText>
                    <HumanText as="p" variant="body" style={{ color: humanTokens.colors.charcoal, opacity: 0.7 }}>
                      {step.desc}
                    </HumanText>
                  </BentoCard>
                </div>
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${humanTokens.colors[step.accent as keyof typeof humanTokens.colors]}15`,
                    border: `2px solid ${humanTokens.colors[step.accent as keyof typeof humanTokens.colors]}30`,
                  }}
                >
                  <HumanText as="span" variant="accent" style={{ 
                    color: humanTokens.colors[step.accent as keyof typeof humanTokens.colors],
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}>
                    {step.num}
                  </HumanText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genesis Proof - keep existing */}
      <GenesisProof />

      {/* Use Cases Section - Organic bento grid */}
      <section 
        className="relative" 
        id="use-cases"
        style={{ 
          paddingTop: '5.5rem',
          paddingBottom: '6rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="text-center mb-16">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-6 block">
              {t('useCases.title')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-3xl mx-auto">
              {t('useCases.subtitle')}
            </HumanText>
          </div>

          {/* Organic bento grid - different sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {[
              { title: t('useCases.vehicles'), desc: t('useCases.vehicles.desc'), accent: 'terra', size: 'default' },
              { title: t('useCases.watches'), desc: t('useCases.watches.desc'), accent: 'sage', size: 'small' },
              { title: t('useCases.art'), desc: t('useCases.art.desc'), accent: 'rust', size: 'large' },
              { title: t('useCases.instruments'), desc: t('useCases.instruments.desc'), accent: 'ink', size: 'default' },
              { title: t('useCases.anything'), desc: t('useCases.anything.desc'), accent: 'terra', size: 'wide' }
            ].map((useCase) => (
              <BentoCard 
                key={useCase.title} 
                size={useCase.size as any}
                accent={useCase.accent as any}
                className={useCase.size === 'wide' ? 'md:col-span-2' : ''}
              >
                <HumanText as="h3" variant="headline" className="human-text-gradient mb-3" style={{ fontSize: '1.25rem' }}>
                  {useCase.title}
                </HumanText>
                <HumanText as="p" variant="small" style={{ color: humanTokens.colors.charcoal, opacity: 0.7 }}>
                  {useCase.desc}
                </HumanText>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Organic accordion */}
      <section 
        className="relative" 
        id="faq"
        style={{ 
          paddingTop: '5rem',
          paddingBottom: '6.25rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="text-center mb-16">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-6 block">
              {t('faq.title')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-3xl mx-auto">
              {t('faq.subtitle')}
            </HumanText>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: t('faq.q1'), a: t('faq.a1') },
              { q: t('faq.q2'), a: t('faq.a2') },
              { q: t('faq.q3'), a: t('faq.a3') },
              { q: t('faq.q4'), a: t('faq.a4') }
            ].map((faq, i) => (
              <div 
                key={i}
                className="group transition-all"
                style={{
                  backgroundColor: humanTokens.colors.paperCream,
                  border: `1px solid ${openFaq === i ? humanTokens.colors.warmTerra : humanTokens.colors.warmTerra}30`,
                  borderRadius: '8px 12px 10px 6px',
                  boxShadow: openFaq === i ? `0 4px 16px ${humanTokens.colors.warmTerra}15` : '0 1px 3px rgba(0,0,0,0.05)',
                  transition: organicTimings.smooth
                }}
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <HumanText as="h3" variant="body" style={{ fontWeight: 500 }}>
                    {faq.q}
                  </HumanText>
                  <div 
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform"
                    style={{
                      backgroundColor: openFaq === i ? `${humanTokens.colors.warmTerra}20` : 'transparent',
                      border: `1px solid ${humanTokens.colors.warmTerra}30`,
                      borderRadius: '4px',
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: organicTimings.smooth
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', color: humanTokens.colors.warmTerra }}>+</span>
                  </div>
                </button>
                <div 
                  className="overflow-hidden transition-all"
                  style={{
                    maxHeight: openFaq === i ? '200px' : '0',
                    transition: organicTimings.flowing
                  }}
                >
                  <div className="px-6 pb-6">
                    <HumanText as="p" variant="small" style={{ color: humanTokens.colors.charcoal, opacity: 0.7 }}>
                      {faq.a}
                    </HumanText>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Organic final push */}
      <section 
        className="relative"
        style={{ 
          paddingTop: '5.75rem',
          paddingBottom: '6rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <BentoCard size="large" accent="terra" className="text-center relative overflow-hidden">
            {/* Organic background pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${humanTokens.colors.warmTerra}20 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${humanTokens.colors.sage}15 0%, transparent 50%)`
              }}
            />
            
            <div className="relative">
              <HumanText as="span" variant="accent" className="human-accent-gradient mb-6 block">
                {t('cta.badge')}
              </HumanText>
              <HumanText as="h2" variant="display" className="human-text-gradient mb-6" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
                {t('cta.title')}
              </HumanText>
              <HumanText as="p" variant="body" className="mb-10 max-w-2xl mx-auto" style={{ color: humanTokens.colors.charcoal, opacity: 0.8 }}>
                {t('cta.subtitle')}
              </HumanText>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {TEASER_MODE ? (
                  <Button size="lg" onClick={handleComingSoon} className="organic-shadow">
                    {t('cta.primary')}
                  </Button>
                ) : (
                  <Link to="/register">
                    <Button size="lg" className="organic-shadow">
                      {t('cta.primary')}
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="lg" onClick={handleDemo} disabled={isDemoLoading}>
                  {isDemoLoading ? '...' : t('cta.secondary')}
                </Button>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>
      
      {/* Contact Section - keep existing */}
      <ContactSection />
    </div>
  );
}

export default LandingPageHuman;