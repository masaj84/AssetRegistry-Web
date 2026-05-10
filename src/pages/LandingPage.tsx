import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

import { ContactSection } from '../components/ContactSection';

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
    display: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    accent: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
  [key: string]: unknown;
}) {
  const variants: Record<string, React.CSSProperties> = {
    display: {
      fontFamily: humanTokens.fonts.display,
      fontSize: 'clamp(2.5rem, 8vw, 6rem)',
      lineHeight: 0.95,
      fontWeight: 300,
      letterSpacing: '-0.02em',
    },
    headline: {
      fontFamily: humanTokens.fonts.display,
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      lineHeight: 1.1,
      fontWeight: 400,
    },
    body: {
      fontFamily: humanTokens.fonts.body,
      fontSize: '1.125rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    accent: {
      fontFamily: humanTokens.fonts.accent,
      fontSize: '0.875rem',
      lineHeight: 1.4,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    small: {
      fontFamily: humanTokens.fonts.body,
      fontSize: '0.9375rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
  };

  const { style: userStyle, ...rest } = props as { style?: React.CSSProperties };

  return (
    <Component
      style={{
        ...variants[variant],
        transform: 'translateX(-0.5px) translateY(0.2px)',
        ...(userStyle ?? {}),
      }}
      className={`text-transparent bg-clip-text ${className}`}
      {...rest}
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
  const [showComingSoon, setShowComingSoon] = useState(false);

  const { t, language, setLanguage } = useLanguage();

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
      0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
      33%      { transform: translateY(-22px) translateX(8px) rotate(1.5deg); }
      66%      { transform: translateY(-10px) translateX(-12px) rotate(-1deg); }
    }

    @keyframes slow-pulse {
      0%, 100% { opacity: 0.45; transform: scale(1); }
      50%      { opacity: 0.75; transform: scale(1.08); }
    }

    @keyframes drift-x {
      0%, 100% { transform: translateX(0) translateY(0) rotate(15deg) scale(1); }
      50%      { transform: translateX(40px) translateY(-18px) rotate(18deg) scale(1.05); }
    }

    @keyframes slow-rotate {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .blob-float    { animation: gentle-float 9s ease-in-out infinite; }
    .blob-pulse    { animation: slow-pulse  11s ease-in-out infinite; }
    .blob-drift    { animation: drift-x     14s ease-in-out infinite; }
    .blob-rotate   { animation: slow-rotate 60s linear infinite; }
  `;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: humanTokens.colors.paperCream }}>
      <style dangerouslySetInnerHTML={{ __html: humanStyles }} />
      
      {/* Coming Soon Toast */}
      <ComingSoonToast show={showComingSoon} onClose={() => setShowComingSoon(false)} />
      
      {/* Ambient organic blobs - bold visible layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full blob-pulse"
          style={{
            background: `radial-gradient(circle, ${humanTokens.colors.warmTerra}80 0%, ${humanTokens.colors.warmTerra}30 40%, transparent 70%)`,
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute -top-20 -right-32 w-[32rem] h-[32rem] rounded-full blob-float"
          style={{
            background: `radial-gradient(circle, ${humanTokens.colors.dustyRose}90 0%, ${humanTokens.colors.dustyRose}30 50%, transparent 70%)`,
            filter: 'blur(45px)',
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute bottom-10 -left-32 w-[30rem] h-[30rem] rounded-full blob-float"
          style={{
            background: `radial-gradient(circle, ${humanTokens.colors.sage}80 0%, ${humanTokens.colors.sage}25 50%, transparent 70%)`,
            filter: 'blur(50px)',
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute top-[40%] -right-40 w-[28rem] h-[28rem] rounded-full blob-pulse"
          style={{
            background: `radial-gradient(circle, ${humanTokens.colors.inkBlue}55 0%, ${humanTokens.colors.inkBlue}15 50%, transparent 70%)`,
            filter: 'blur(60px)',
            animationDelay: '4s',
          }}
        />
        <div
          className="absolute top-[55%] left-[50%] w-[48rem] h-[32rem]"
          style={{
            background: `radial-gradient(ellipse, ${humanTokens.colors.warmTerra}50 0%, ${humanTokens.colors.rust}20 40%, transparent 70%)`,
            filter: 'blur(70px)',
            marginLeft: '-24rem',
            marginTop: '-16rem',
          }}
        >
          <div className="w-full h-full blob-drift" />
        </div>
        <div
          className="absolute bottom-32 right-10 w-[22rem] h-[22rem] rounded-full blob-pulse"
          style={{
            background: `radial-gradient(circle, ${humanTokens.colors.rust}65 0%, ${humanTokens.colors.rust}20 50%, transparent 70%)`,
            filter: 'blur(40px)',
            animationDelay: '6s',
          }}
        />
        {/* Paper grain */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${humanTokens.colors.charcoal} 0.5px, transparent 0)`,
            backgroundSize: '28px 28px',
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

            {/* Nav links - dealership-focused */}
            <div
              className="hidden lg:flex items-center gap-8"
              style={{ fontFamily: humanTokens.fonts.body }}
            >
              <a
                href="#produkt"
                style={{
                  color: humanTokens.colors.charcoal,
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  transition: organicTimings.quick,
                }}
                className="hover:opacity-70"
              >
                {t('nav.forDealerships')}
              </a>

              {/* Other industries dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="hover:opacity-70 inline-flex items-center gap-1"
                  style={{
                    color: humanTokens.colors.charcoal,
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    fontFamily: humanTokens.fonts.body,
                    transition: organicTimings.quick,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {t('nav.otherIndustries')}
                  <span style={{ fontSize: '0.625rem', opacity: 0.6 }}>▾</span>
                </button>
                <div
                  className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                  style={{ transition: organicTimings.smooth, minWidth: '230px' }}
                >
                  <div
                    style={{
                      backgroundColor: humanTokens.colors.paperCream,
                      border: `1px solid ${humanTokens.colors.warmTerra}30`,
                      borderRadius: '8px 6px 10px 7px',
                      padding: '0.75rem',
                      boxShadow: `0 12px 28px rgba(60,56,53,0.10), 0 4px 12px rgba(60,56,53,0.06)`,
                    }}
                  >
                    {[
                      { to: '/komis', label: t('komis.label') },
                      { to: '/zegarmistrzostwo', label: t('nav.industry.watches') },
                      { to: '/galerie-sztuki', label: t('nav.industry.art') },
                      { to: '/instrumenty', label: t('nav.industry.instruments') },
                      { to: '/inne', label: t('nav.industry.other') },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        style={{
                          display: 'block',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.9375rem',
                          color: humanTokens.colors.charcoal,
                          textDecoration: 'none',
                          borderRadius: '4px',
                          transition: organicTimings.quick,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${humanTokens.colors.warmTerra}12`;
                          e.currentTarget.style.color = humanTokens.colors.warmTerra;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = humanTokens.colors.charcoal;
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href="#how-it-works"
                style={{
                  color: humanTokens.colors.charcoal,
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  transition: organicTimings.quick,
                }}
                className="hover:opacity-70"
              >
                {t('nav.howItWorks')}
              </a>
              <a
                href="#contact"
                style={{
                  color: humanTokens.colors.charcoal,
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  transition: organicTimings.quick,
                }}
                className="hover:opacity-70"
              >
                {t('nav.contact')}
              </a>
            </div>

            {/* Actions - language toggle + login (subtle) + main CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language toggle pill */}
              <div
                className="hidden sm:inline-flex items-center"
                style={{
                  border: `1px solid ${humanTokens.colors.warmTerra}40`,
                  borderRadius: '999px',
                  padding: '2px',
                  backgroundColor: `${humanTokens.colors.warmTerra}08`,
                }}
              >
                {(['pl', 'en'] as const).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => setLanguage(lng)}
                    aria-label={lng === 'pl' ? 'Polski' : 'English'}
                    aria-pressed={language === lng}
                    style={{
                      fontFamily: humanTokens.fonts.accent,
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: organicTimings.smooth,
                      backgroundColor: language === lng ? humanTokens.colors.warmTerra : 'transparent',
                      color: language === lng ? humanTokens.colors.paperCream : humanTokens.colors.charcoal,
                      opacity: language === lng ? 1 : 0.65,
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lng) e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lng) e.currentTarget.style.opacity = '0.65';
                    }}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>

              {!TEASER_MODE && (
                <Link to="/login" className="hidden md:inline-flex">
                  <Button variant="ghost">{t('nav.login')}</Button>
                </Link>
              )}
              <a href="#contact">
                <Button>{t('nav.bookDemo')}</Button>
              </a>
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
              <a href="#contact">
                <Button size="lg" className="organic-shadow">
                  {t('hero.cta')}
                </Button>
              </a>
              <a href="#produkt">
                <Button variant="ghost" size="lg">
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </div>

            <p
              className="mt-8 mx-auto max-w-xl"
              style={{
                fontFamily: humanTokens.fonts.body,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: humanTokens.colors.charcoal,
                opacity: 0.65,
              }}
            >
              {t('hero.tagline')}
            </p>
          </div>
        </div>
      </section>

      {/* Product Section (Sekcja 3) - Car asset card mockup with timeline */}
      <section
        className="relative"
        id="produkt"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.75rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-14">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-6 block">
              {t('product.label')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient mb-6">
              {t('product.title1')}<br />
              <span className="human-accent-gradient">{t('product.title2')}</span>
            </HumanText>
            <HumanText
              as="p"
              variant="body"
              className="max-w-2xl mx-auto"
              style={{ color: humanTokens.colors.charcoal, opacity: 0.78 }}
            >
              {t('product.subtitle')}
            </HumanText>
          </div>

          {/* Car asset card mockup */}
          <div
            className="relative mx-auto"
            style={{
              maxWidth: '720px',
              backgroundColor: humanTokens.colors.paperCream,
              border: `1px solid ${humanTokens.colors.warmTerra}30`,
              borderRadius: '14px 10px 16px 12px',
              boxShadow: `0 12px 32px rgba(60,56,53,0.08), 0 4px 12px rgba(60,56,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)`,
              padding: '2.5rem 2.25rem',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-6 h-0.5 w-12 opacity-60"
              style={{ backgroundColor: humanTokens.colors.warmTerra }}
            />

            {/* Header: status pill + verified mark */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: `${humanTokens.colors.sage}15`,
                  border: `1px solid ${humanTokens.colors.sage}40`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: humanTokens.colors.sage }} />
                <span
                  style={{
                    fontFamily: humanTokens.fonts.accent,
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: humanTokens.colors.sage,
                  }}
                >
                  {t('product.card.statusValue')}
                </span>
              </div>
              <span
                style={{
                  fontFamily: humanTokens.fonts.accent,
                  fontSize: '0.625rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: humanTokens.colors.charcoal,
                  opacity: 0.5,
                }}
              >
                #001 — TRVE
              </span>
            </div>

            {/* Specs grid */}
            <div
              className="grid gap-4 mb-7 pb-6"
              style={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                borderBottom: `1px dashed ${humanTokens.colors.warmTerra}25`,
              }}
            >
              {[
                { label: t('product.card.vinLabel'), value: 'WBA3A5C50DF123456', mono: true },
                { label: t('product.card.makeLabel'), value: 'BMW 320i F30', mono: false },
                { label: t('product.card.yearLabel'), value: '2018', mono: true },
                { label: t('product.card.mileageLabel'), value: '87 432 km', mono: true },
              ].map((row) => (
                <div key={row.label}>
                  <div
                    style={{
                      fontFamily: humanTokens.fonts.accent,
                      fontSize: '0.625rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: humanTokens.colors.charcoal,
                      opacity: 0.55,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontFamily: row.mono
                        ? 'ui-monospace, "SF Mono", "Menlo", "Cascadia Code", monospace'
                        : humanTokens.fonts.body,
                      fontSize: '1rem',
                      color: humanTokens.colors.charcoal,
                      fontWeight: row.mono ? 500 : 500,
                      letterSpacing: row.mono ? '-0.01em' : 'normal',
                    }}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline label */}
            <div
              style={{
                fontFamily: humanTokens.fonts.accent,
                fontSize: '0.6875rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: humanTokens.colors.warmTerra,
                marginBottom: '1.25rem',
              }}
            >
              {t('product.card.timelineLabel')}
            </div>

            {/* Timeline entries */}
            <div className="relative" style={{ paddingLeft: '1.5rem' }}>
              {/* Vertical line */}
              <div
                className="absolute top-1 bottom-1 left-1.5"
                style={{ width: '1px', backgroundColor: `${humanTokens.colors.warmTerra}30` }}
              />
              {[1, 2, 3, 4, 5, 6].map((i, idx, arr) => (
                <div key={i} className="relative" style={{ marginBottom: idx === arr.length - 1 ? 0 : '1.125rem' }}>
                  {/* Dot */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '8px',
                      height: '8px',
                      left: '-1.5rem',
                      top: '0.375rem',
                      backgroundColor:
                        idx === arr.length - 1 ? humanTokens.colors.warmTerra : humanTokens.colors.dustyRose,
                      boxShadow: idx === arr.length - 1 ? `0 0 0 4px ${humanTokens.colors.warmTerra}25` : 'none',
                    }}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span
                      style={{
                        fontFamily: 'ui-monospace, "SF Mono", "Menlo", monospace',
                        fontSize: '0.8125rem',
                        color: humanTokens.colors.charcoal,
                        opacity: 0.6,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {t(`product.card.t${i}.date`)}
                    </span>
                    <span
                      style={{
                        fontFamily: humanTokens.fonts.body,
                        fontSize: '0.9375rem',
                        color: humanTokens.colors.charcoal,
                        fontWeight: 500,
                      }}
                    >
                      {t(`product.card.t${i}.title`)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: humanTokens.fonts.body,
                      fontSize: '0.8125rem',
                      color: humanTokens.colors.charcoal,
                      opacity: 0.6,
                      marginTop: '0.125rem',
                    }}
                  >
                    {t(`product.card.t${i}.where`)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footnote with link to /jak-dziala */}
          <div className="text-center mt-8">
            <p
              style={{
                fontFamily: humanTokens.fonts.body,
                fontSize: '0.875rem',
                color: humanTokens.colors.charcoal,
                opacity: 0.7,
                fontStyle: 'italic',
              }}
            >
              {t('product.footnote')}{' '}
              <Link
                to="/jak-dziala"
                style={{
                  color: humanTokens.colors.warmTerra,
                  fontStyle: 'normal',
                  fontWeight: 500,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${humanTokens.colors.warmTerra}40`,
                }}
              >
                {t('product.footnote.link')}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section (Sekcja 2) - focused, 3 items */}
      <section
        className="relative"
        id="problem"
        style={{
          paddingTop: '5rem',
          paddingBottom: '5.5rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-14">
            <HumanText as="span" variant="accent" style={{ color: humanTokens.colors.rust }} className="mb-5 block">
              {t('problem.label')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-2xl mx-auto">
              {t('problem.title')}
            </HumanText>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: t('problem.item1.title'), desc: t('problem.item1.desc') },
              { title: t('problem.item2.title'), desc: t('problem.item2.desc') },
              { title: t('problem.item3.title'), desc: t('problem.item3.desc') },
            ].map((item, idx) => (
              <BentoCard key={idx} size="default" accent="rust">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${humanTokens.colors.rust}15`,
                    border: `1px solid ${humanTokens.colors.rust}35`,
                    fontFamily: humanTokens.fonts.accent,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: humanTokens.colors.rust,
                  }}
                >
                  0{idx + 1}
                </div>
                <HumanText as="h4" variant="small" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                  {item.title}
                </HumanText>
                <HumanText
                  as="p"
                  variant="small"
                  style={{ color: humanTokens.colors.charcoal, opacity: 0.72, fontSize: '0.9375rem' }}
                >
                  {item.desc}
                </HumanText>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section (Sekcja 4) - 2x2 grid of business benefits */}
      <section
        className="relative"
        id="korzysci"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.5rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-14">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-5 block">
              {t('benefits.label')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-2xl mx-auto">
              {t('benefits.title1')}{' '}
              <span className="human-accent-gradient">{t('benefits.title2')}</span>
            </HumanText>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: t('benefits.card1.title'), desc: t('benefits.card1.desc'), accent: 'terra' as const },
              { title: t('benefits.card2.title'), desc: t('benefits.card2.desc'), accent: 'sage' as const },
              { title: t('benefits.card3.title'), desc: t('benefits.card3.desc'), accent: 'ink' as const },
              { title: t('benefits.card4.title'), desc: t('benefits.card4.desc'), accent: 'rust' as const },
            ].map((card, idx) => (
              <BentoCard key={idx} size="default" accent={card.accent}>
                <HumanText as="h3" variant="headline" className="human-text-gradient mb-3" style={{ fontSize: '1.5rem' }}>
                  {card.title}
                </HumanText>
                <HumanText
                  as="p"
                  variant="body"
                  style={{ color: humanTokens.colors.charcoal, opacity: 0.78, fontSize: '0.9375rem' }}
                >
                  {card.desc}
                </HumanText>
              </BentoCard>
            ))}
          </div>

          <p
            className="text-center mt-8 mx-auto max-w-2xl"
            style={{
              fontFamily: humanTokens.fonts.body,
              fontSize: '0.8125rem',
              fontStyle: 'italic',
              color: humanTokens.colors.charcoal,
              opacity: 0.6,
              lineHeight: 1.6,
            }}
          >
            {t('benefits.disclaimer')}
          </p>
        </div>
      </section>

      {/* How It Works Section (Sekcja 5) - 3 steps for dealership, compact horizontal */}
      <section
        className="relative"
        id="how-it-works"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.75rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="text-center mb-14">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-5 block">
              {t('howItWorks.title')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </HumanText>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { num: '01', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc'), accent: 'terra' as const, color: humanTokens.colors.warmTerra },
              { num: '02', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc'), accent: 'sage' as const, color: humanTokens.colors.sage },
              { num: '03', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc'), accent: 'rust' as const, color: humanTokens.colors.rust },
            ].map((step) => (
              <BentoCard key={step.num} size="default" accent={step.accent}>
                <div
                  style={{
                    fontFamily: humanTokens.fonts.display,
                    fontSize: '3rem',
                    lineHeight: 1,
                    fontWeight: 300,
                    color: step.color,
                    opacity: 0.85,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.num}
                </div>
                <HumanText as="h3" variant="small" style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  {step.title}
                </HumanText>
                <HumanText
                  as="p"
                  variant="small"
                  style={{ color: humanTokens.colors.charcoal, opacity: 0.72, fontSize: '0.9375rem' }}
                >
                  {step.desc}
                </HumanText>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Protection / Anti-fraud (Sekcja 6) */}
      <section
        className="relative"
        id="ochrona"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.75rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-12">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-5 block">
              {t('protection.label')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-2xl mx-auto mb-6">
              {t('protection.title')}
            </HumanText>
            <HumanText
              as="p"
              variant="body"
              className="max-w-2xl mx-auto"
              style={{ color: humanTokens.colors.charcoal, opacity: 0.78 }}
            >
              {t('protection.body')}
            </HumanText>
          </div>

          {/* Mileage chart visualisation */}
          <div
            className="relative mx-auto mb-10"
            style={{
              maxWidth: '720px',
              backgroundColor: humanTokens.colors.paperCream,
              border: `1px solid ${humanTokens.colors.warmTerra}30`,
              borderRadius: '14px 10px 16px 12px',
              padding: '2rem 2.25rem 1.75rem',
              boxShadow: `0 8px 24px rgba(60,56,53,0.06), 0 2px 8px rgba(60,56,53,0.04)`,
            }}
          >
            <div
              className="absolute top-0 left-6 h-0.5 w-12 opacity-60"
              style={{ backgroundColor: humanTokens.colors.warmTerra }}
            />

            <div
              style={{
                fontFamily: humanTokens.fonts.accent,
                fontSize: '0.625rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: humanTokens.colors.warmTerra,
                marginBottom: '0.75rem',
              }}
            >
              {t('protection.chartYAxis')}
            </div>

            <svg viewBox="0 0 600 220" width="100%" height="220" preserveAspectRatio="none" style={{ display: 'block' }}>
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`h${i}`}
                  x1="40"
                  x2="590"
                  y1={20 + i * 40}
                  y2={20 + i * 40}
                  stroke={humanTokens.colors.warmTerra}
                  strokeOpacity="0.1"
                  strokeWidth="1"
                  strokeDasharray={i === 4 ? '0' : '2 4'}
                />
              ))}
              {/* Y-axis labels */}
              {[100, 75, 50, 25, 0].map((v, i) => (
                <text
                  key={`yl${i}`}
                  x="32"
                  y={24 + i * 40}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="ui-monospace, monospace"
                  fill={humanTokens.colors.charcoal}
                  fillOpacity="0.45"
                >
                  {v}k
                </text>
              ))}
              {/* X-axis labels */}
              {['2018', '2020', '2022', '2024', '2025'].map((label, i) => (
                <text
                  key={`xl${i}`}
                  x={50 + i * 135}
                  y="200"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="ui-monospace, monospace"
                  fill={humanTokens.colors.charcoal}
                  fillOpacity="0.45"
                >
                  {label}
                </text>
              ))}
              {/* Ascending mileage line through 6 points */}
              <polyline
                points="50,170 130,150 240,118 360,82 470,58 580,42"
                fill="none"
                stroke={humanTokens.colors.warmTerra}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Subtle area fill under line */}
              <polygon
                points="50,170 130,150 240,118 360,82 470,58 580,42 580,180 50,180"
                fill={humanTokens.colors.warmTerra}
                fillOpacity="0.08"
              />
              {/* Data points */}
              {[
                [50, 170], [130, 150], [240, 118], [360, 82], [470, 58], [580, 42],
              ].map(([cx, cy], i) => (
                <g key={`pt${i}`}>
                  <circle cx={cx} cy={cy} r="6" fill={humanTokens.colors.paperCream} stroke={humanTokens.colors.warmTerra} strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="2.5" fill={humanTokens.colors.warmTerra} />
                </g>
              ))}
            </svg>

            <div
              className="text-center mt-3"
              style={{
                fontFamily: humanTokens.fonts.body,
                fontSize: '0.8125rem',
                fontStyle: 'italic',
                color: humanTokens.colors.charcoal,
                opacity: 0.6,
              }}
            >
              {t('protection.chartCaption')}
            </div>
          </div>

          {/* 3 bullet points under chart */}
          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
            {[t('protection.point1'), t('protection.point2'), t('protection.point3')].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 mt-0.5"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: `${humanTokens.colors.sage}25`,
                    border: `1px solid ${humanTokens.colors.sage}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5L5 9L9.5 3.5" stroke={humanTokens.colors.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: humanTokens.fonts.body,
                    fontSize: '0.9375rem',
                    color: humanTokens.colors.charcoal,
                    opacity: 0.85,
                    lineHeight: 1.5,
                  }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison vs AutoDNA / CARFAX (Sekcja 7) */}
      <section
        className="relative"
        id="porownanie"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.75rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-12">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-5 block">
              {t('compare.label')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-3xl mx-auto">
              {t('compare.title1')}<br />
              <span className="human-accent-gradient">{t('compare.title2')}</span>
            </HumanText>
          </div>

          <div
            className="overflow-x-auto mx-auto"
            style={{
              maxWidth: '1000px',
              backgroundColor: humanTokens.colors.paperCream,
              border: `1px solid ${humanTokens.colors.warmTerra}25`,
              borderRadius: '14px 10px 16px 12px',
              boxShadow: `0 8px 24px rgba(60,56,53,0.05)`,
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: humanTokens.fonts.body,
                fontSize: '0.875rem',
                color: humanTokens.colors.charcoal,
                minWidth: '720px',
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${humanTokens.colors.warmTerra}30` }}>
                  {[
                    { label: t('compare.col.feature'), highlight: false, accent: false },
                    { label: t('compare.col.trve'), highlight: true, accent: true },
                    { label: t('compare.col.autodna'), highlight: false, accent: false },
                    { label: t('compare.col.carfax'), highlight: false, accent: false },
                  ].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '1rem 1.125rem',
                        textAlign: 'left',
                        fontFamily: humanTokens.fonts.accent,
                        fontSize: '0.6875rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        color: h.accent ? humanTokens.colors.warmTerra : humanTokens.colors.charcoal,
                        opacity: h.highlight || h.accent ? 1 : 0.6,
                        backgroundColor: h.highlight ? `${humanTokens.colors.warmTerra}10` : 'transparent',
                      }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <tr
                    key={row}
                    style={{
                      borderBottom: row === 6 ? 'none' : `1px solid ${humanTokens.colors.warmTerra}15`,
                    }}
                  >
                    <td
                      style={{
                        padding: '0.875rem 1.125rem',
                        fontWeight: 500,
                        verticalAlign: 'top',
                      }}
                    >
                      {t(`compare.row${row}.label`)}
                    </td>
                    <td
                      style={{
                        padding: '0.875rem 1.125rem',
                        backgroundColor: `${humanTokens.colors.warmTerra}08`,
                        verticalAlign: 'top',
                        fontWeight: 500,
                      }}
                    >
                      {t(`compare.row${row}.trve`)}
                    </td>
                    <td style={{ padding: '0.875rem 1.125rem', opacity: 0.78, verticalAlign: 'top' }}>
                      {t(`compare.row${row}.autodna`)}
                    </td>
                    <td style={{ padding: '0.875rem 1.125rem', opacity: 0.78, verticalAlign: 'top' }}>
                      {t(`compare.row${row}.carfax`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="text-center mt-8 mx-auto max-w-3xl"
            style={{
              fontFamily: humanTokens.fonts.body,
              fontSize: '0.9375rem',
              color: humanTokens.colors.charcoal,
              opacity: 0.78,
              lineHeight: 1.6,
            }}
          >
            {t('compare.footer')}
          </p>
        </div>
      </section>

      {/* For whom (Sekcja 8) */}
      <section
        className="relative"
        id="dla-kogo"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.75rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '760px' }}>
          <div className="text-center mb-10">
            <HumanText as="span" variant="accent" className="human-accent-gradient mb-5 block">
              {t('forWhom.label')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient">
              {t('forWhom.title')}
            </HumanText>
          </div>

          <ul
            className="space-y-4"
            style={{
              backgroundColor: humanTokens.colors.paperCream,
              border: `1px solid ${humanTokens.colors.warmTerra}25`,
              borderRadius: '14px 10px 16px 12px',
              padding: '2rem 2.25rem',
              boxShadow: `0 8px 24px rgba(60,56,53,0.05)`,
            }}
          >
            {['forWhom.item1', 'forWhom.item2', 'forWhom.item3', 'forWhom.item4', 'forWhom.item5'].map((key) => (
              <li key={key} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 mt-0.5"
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: `${humanTokens.colors.warmTerra}15`,
                    border: `1px solid ${humanTokens.colors.warmTerra}45`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5L5 9L9.5 3.5" stroke={humanTokens.colors.warmTerra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: humanTokens.fonts.body,
                    fontSize: '1rem',
                    color: humanTokens.colors.charcoal,
                    lineHeight: 1.55,
                  }}
                >
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>

          <p
            className="text-center mt-6 mx-auto max-w-2xl"
            style={{
              fontFamily: humanTokens.fonts.body,
              fontSize: '0.9375rem',
              fontStyle: 'italic',
              color: humanTokens.colors.charcoal,
              opacity: 0.7,
              lineHeight: 1.6,
            }}
          >
            {t('forWhom.footnote')}
          </p>
        </div>
      </section>

      {/* Security - Stolen flag (Sekcja 9) */}
      <section
        className="relative"
        id="security"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.75rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-12">
            <HumanText as="span" variant="accent" style={{ color: humanTokens.colors.rust }} className="mb-5 block">
              {t('security.title')}
            </HumanText>
            <HumanText as="h2" variant="headline" className="human-text-gradient max-w-3xl mx-auto">
              {t('security.flag.title')}
            </HumanText>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Card 1 — Description */}
            <BentoCard size="default" accent="terra">
              <div
                className="mb-4"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: `${humanTokens.colors.warmTerra}15`,
                  border: `1px solid ${humanTokens.colors.warmTerra}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4 L4 20 M4 4 L16 4 L14 8 L16 12 L4 12" stroke={humanTokens.colors.warmTerra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <HumanText as="p" variant="small" style={{ color: humanTokens.colors.charcoal, opacity: 0.82, fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {t('security.flag.desc')}
              </HumanText>
            </BentoCard>

            {/* Card 2 — Benefits */}
            <BentoCard size="default" accent="sage">
              <ul className="space-y-3.5">
                {[t('security.benefit1'), t('security.benefit2'), t('security.benefit3')].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: `${humanTokens.colors.sage}25`,
                        border: `1px solid ${humanTokens.colors.sage}50`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.5L5 9L9.5 3.5" stroke={humanTokens.colors.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span style={{ fontFamily: humanTokens.fonts.body, fontSize: '0.9375rem', color: humanTokens.colors.charcoal, lineHeight: 1.5 }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-5 pt-4"
                style={{
                  borderTop: `1px dashed ${humanTokens.colors.sage}40`,
                  fontFamily: humanTokens.fonts.body,
                  fontSize: '0.8125rem',
                  fontStyle: 'italic',
                  color: humanTokens.colors.charcoal,
                  opacity: 0.65,
                }}
              >
                {t('security.note')}
              </p>
            </BentoCard>

            {/* Card 3 — Warning preview */}
            <BentoCard size="default" accent="rust">
              <div
                className="inline-flex items-center gap-2 mb-5 px-3 py-1.5"
                style={{
                  backgroundColor: `${humanTokens.colors.rust}15`,
                  border: `1px solid ${humanTokens.colors.rust}50`,
                  borderRadius: '6px 4px 8px 5px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v2m0 4h.01M5.062 19h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke={humanTokens.colors.rust} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  style={{
                    fontFamily: humanTokens.fonts.accent,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: humanTokens.colors.rust,
                  }}
                >
                  {t('security.warning')}
                </span>
              </div>
              <HumanText as="p" variant="small" style={{ color: humanTokens.colors.charcoal, opacity: 0.82, fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {t('security.warningDesc')}
              </HumanText>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Early Access (Sekcja 10) */}
      <section
        className="relative"
        id="early-access"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '5.75rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          <div
            className="relative"
            style={{
              backgroundColor: humanTokens.colors.paperCream,
              border: `1px solid ${humanTokens.colors.warmTerra}35`,
              borderRadius: '14px 10px 16px 12px',
              padding: '3rem 2.5rem',
              boxShadow: `0 14px 36px rgba(60,56,53,0.08), 0 4px 12px rgba(60,56,53,0.05)`,
              backgroundImage: `radial-gradient(circle at 90% 0%, ${humanTokens.colors.warmTerra}10 0%, transparent 45%)`,
            }}
          >
            <div
              className="absolute top-0 left-6 h-0.5 w-12 opacity-70"
              style={{ backgroundColor: humanTokens.colors.warmTerra }}
            />

            <div className="text-center mb-8">
              <HumanText as="span" variant="accent" className="human-accent-gradient mb-5 block">
                {t('earlyAccess.label')}
              </HumanText>
              <HumanText as="h2" variant="headline" className="human-text-gradient max-w-2xl mx-auto mb-6">
                {t('earlyAccess.title')}
              </HumanText>
              <HumanText
                as="p"
                variant="body"
                className="max-w-xl mx-auto"
                style={{ color: humanTokens.colors.charcoal, opacity: 0.78 }}
              >
                {t('earlyAccess.body')}
              </HumanText>
            </div>

            <ul className="space-y-3.5 max-w-xl mx-auto mb-10">
              {[
                'earlyAccess.benefit1',
                'earlyAccess.benefit2',
                'earlyAccess.benefit3',
                'earlyAccess.benefit4',
              ].map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: `${humanTokens.colors.warmTerra}15`,
                      border: `1px solid ${humanTokens.colors.warmTerra}45`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5L5 9L9.5 3.5" stroke={humanTokens.colors.warmTerra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    style={{
                      fontFamily: humanTokens.fonts.body,
                      fontSize: '1rem',
                      color: humanTokens.colors.charcoal,
                      lineHeight: 1.55,
                    }}
                  >
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <a href="#contact">
                <Button size="lg" className="organic-shadow">
                  {t('earlyAccess.cta')}
                </Button>
              </a>
              <p
                className="mt-5"
                style={{
                  fontFamily: humanTokens.fonts.body,
                  fontSize: '0.875rem',
                  color: humanTokens.colors.charcoal,
                  opacity: 0.7,
                }}
              >
                {t('earlyAccess.altCta')}{' '}
                <a
                  href="mailto:hello@trve.io"
                  style={{
                    color: humanTokens.colors.warmTerra,
                    fontWeight: 500,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${humanTokens.colors.warmTerra}45`,
                  }}
                >
                  {t('earlyAccess.email')}
                </a>
              </p>
            </div>
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
              { q: t('faq.q4'), a: t('faq.a4') },
              { q: t('faq.q5'), a: t('faq.a5') },
              { q: t('faq.q6'), a: t('faq.a6') },
              { q: t('faq.q7'), a: t('faq.a7') },
              { q: t('faq.q8'), a: t('faq.a8') },
              { q: t('faq.q9'), a: t('faq.a9') },
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
                  <h3
                    style={{
                      fontFamily: humanTokens.fonts.body,
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: humanTokens.colors.charcoal,
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {faq.q}
                  </h3>
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
                <a href="#contact">
                  <Button size="lg" className="organic-shadow">
                    {t('cta.primary')}
                  </Button>
                </a>
                <a href="mailto:hello@trve.io">
                  <Button variant="ghost" size="lg">
                    {t('cta.secondary')}
                  </Button>
                </a>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>
      
      {/* Contact Section - keep existing */}
      <ContactSection />

      {/* Footer (Sekcja 13) */}
      <footer
        style={{
          borderTop: `1px solid ${humanTokens.colors.warmTerra}25`,
          backgroundColor: `${humanTokens.colors.paperCream}60`,
          paddingTop: '4rem',
          paddingBottom: '2.5rem',
          paddingLeft: '1.75rem',
          paddingRight: '2.1rem',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6 mb-12">
            {/* Brand + tagline + mini-newsletter (spans 2 cols on lg) */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    border: `2px solid ${humanTokens.colors.warmTerra}`,
                    backgroundColor: `${humanTokens.colors.warmTerra}10`,
                    borderRadius: '6px 4px 8px 5px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: humanTokens.fonts.accent,
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: humanTokens.colors.warmTerra,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    T_
                  </span>
                </div>
                <div style={{ fontFamily: humanTokens.fonts.accent }}>
                  <span
                    className="human-accent-gradient"
                    style={{ fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.15em' }}
                  >
                    TRVE<span style={{ color: humanTokens.colors.warmTerra }}>_</span>
                  </span>
                </div>
              </Link>
              <p
                className="mb-5"
                style={{
                  fontFamily: humanTokens.fonts.body,
                  fontSize: '0.875rem',
                  color: humanTokens.colors.charcoal,
                  opacity: 0.72,
                  lineHeight: 1.6,
                  maxWidth: '320px',
                }}
              >
                {t('footer.tagline')}
              </p>

              {/* Mini newsletter */}
              <div>
                <div
                  style={{
                    fontFamily: humanTokens.fonts.accent,
                    fontSize: '0.625rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: humanTokens.colors.warmTerra,
                    marginBottom: '0.5rem',
                  }}
                >
                  {t('footer.newsletter.title')}
                </div>
                <p
                  style={{
                    fontFamily: humanTokens.fonts.body,
                    fontSize: '0.8125rem',
                    color: humanTokens.colors.charcoal,
                    opacity: 0.65,
                    marginBottom: '0.75rem',
                  }}
                >
                  {t('footer.newsletter.desc')}
                </p>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <input
                    type="email"
                    placeholder={t('footer.newsletter.placeholder')}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '0.5rem 0.75rem',
                      fontFamily: humanTokens.fonts.body,
                      fontSize: '0.875rem',
                      backgroundColor: humanTokens.colors.paperCream,
                      border: `1px solid ${humanTokens.colors.warmTerra}40`,
                      borderRadius: '6px 4px 8px 5px',
                      color: humanTokens.colors.charcoal,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem 0.9rem',
                      fontFamily: humanTokens.fonts.accent,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: humanTokens.colors.paperCream,
                      backgroundColor: humanTokens.colors.warmTerra,
                      border: 'none',
                      borderRadius: '6px 4px 8px 5px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('footer.newsletter.submit')}
                  </button>
                </form>
              </div>
            </div>

            {/* Column: Product */}
            <FooterCol title={t('footer.col.product')}>
              <FooterAnchor href="#how-it-works">{t('footer.link.howItWorks')}</FooterAnchor>
              <FooterAnchor href="#dla-kogo">{t('footer.link.forWhom')}</FooterAnchor>
              <FooterAnchor href="#faq">{t('footer.link.faq')}</FooterAnchor>
              <FooterAnchor href="#faq">{t('footer.link.pricing')}</FooterAnchor>
            </FooterCol>

            {/* Column: Other industries */}
            <FooterCol title={t('footer.col.otherIndustries')}>
              <FooterRouterLink to="/komis">{t('komis.label')}</FooterRouterLink>
              <FooterRouterLink to="/zegarmistrzostwo">{t('nav.industry.watches')}</FooterRouterLink>
              <FooterRouterLink to="/galerie-sztuki">{t('nav.industry.art')}</FooterRouterLink>
              <FooterRouterLink to="/instrumenty">{t('nav.industry.instruments')}</FooterRouterLink>
              <FooterRouterLink to="/inne">{t('nav.industry.other')}</FooterRouterLink>
            </FooterCol>

            {/* Column: Resources */}
            <FooterCol title={t('footer.col.resources')}>
              <FooterRouterLink to="/jak-dziala">{t('footer.link.howItWorksTech')}</FooterRouterLink>
              <FooterRouterLink to="/roadmap">{t('footer.link.roadmap')}</FooterRouterLink>
              <FooterRouterLink to="/whitepaper">{t('footer.link.whitepaper')}</FooterRouterLink>
              <FooterRouterLink to="/privacy">{t('footer.link.privacy')}</FooterRouterLink>
            </FooterCol>

            {/* Column: Contact */}
            <FooterCol title={t('footer.col.contact')}>
              <FooterAnchor href="mailto:hello@trve.io">{t('footer.link.email')}</FooterAnchor>
              <FooterAnchor href="#contact">{t('footer.link.contactForm')}</FooterAnchor>
            </FooterCol>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6"
            style={{ borderTop: `1px dashed ${humanTokens.colors.warmTerra}25` }}
          >
            <span
              style={{
                fontFamily: humanTokens.fonts.body,
                fontSize: '0.8125rem',
                color: humanTokens.colors.charcoal,
                opacity: 0.6,
              }}
            >
              {t('footer.copyright')}
            </span>
            <span
              style={{
                fontFamily: humanTokens.fonts.accent,
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: humanTokens.colors.charcoal,
                opacity: 0.5,
              }}
            >
              {t('footer.slogan')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Footer helpers — keep markup tidy
function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: humanTokens.fonts.accent,
          fontSize: '0.6875rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: humanTokens.colors.warmTerra,
          marginBottom: '1rem',
        }}
      >
        {title}
      </div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        style={{
          fontFamily: humanTokens.fonts.body,
          fontSize: '0.875rem',
          color: humanTokens.colors.charcoal,
          opacity: 0.78,
          textDecoration: 'none',
          transition: organicTimings.quick,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = humanTokens.colors.warmTerra;
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = humanTokens.colors.charcoal;
          e.currentTarget.style.opacity = '0.78';
        }}
      >
        {children}
      </a>
    </li>
  );
}

function FooterRouterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        style={{
          fontFamily: humanTokens.fonts.body,
          fontSize: '0.875rem',
          color: humanTokens.colors.charcoal,
          opacity: 0.78,
          textDecoration: 'none',
          transition: organicTimings.quick,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = humanTokens.colors.warmTerra;
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = humanTokens.colors.charcoal;
          e.currentTarget.style.opacity = '0.78';
        }}
      >
        {children}
      </Link>
    </li>
  );
}

export default LandingPageHuman;