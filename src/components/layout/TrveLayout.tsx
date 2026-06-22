import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { TRVE_THEMES, useTrveTheme } from '../../lib/trveTheme';

const TEASER_MODE = import.meta.env.VITE_TEASER_MODE === 'true';

const styles = `
  .trve-root{
    --bg:#FFFFFF;
    --bg-2:#FAFAF8;
    --bg-3:#F0EEE8;
    --line:rgba(22,22,22,0.16);
    --line-soft:rgba(22,22,22,0.08);
    --fg:#161616;
    --mute:#5A574F;
    --mute-2:#9C998F;
    --accent:#161616;
    --display:"Archivo",system-ui,sans-serif;
    --body:"Archivo",system-ui,sans-serif;
    --mono:"IBM Plex Mono",ui-monospace,monospace;
  }
  .trve-root.theme-light{
    --bg:#FFFFFF;
    --bg-2:#FAFAF8;
    --bg-3:#F0EEE8;
    --line:rgba(22,22,22,0.16);
    --line-soft:rgba(22,22,22,0.08);
    --fg:#161616;
    --mute:#5A574F;
    --mute-2:#9C998F;
    --accent:#161616;
  }
  .trve-root.theme-wild{
    --bg:#0B0420;
    --bg-2:#15083A;
    --bg-3:#1E0B52;
    --line:rgba(255,77,210,0.32);
    --line-soft:rgba(255,77,210,0.16);
    --fg:#F8FAFF;
    --mute:#C9B6FF;
    --mute-2:#7D6BBF;
    --accent:#FF4DD2;
    background:
      radial-gradient(900px 600px at 12% 8%, rgba(255,77,210,.25), transparent 60%),
      radial-gradient(900px 600px at 92% 18%, rgba(78,255,235,.22), transparent 60%),
      radial-gradient(1200px 700px at 50% 110%, rgba(255,214,77,.18), transparent 60%),
      #0B0420;
  }
  .trve-root.theme-wild::before{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      linear-gradient(90deg, rgba(255,77,210,.04) 1px, transparent 1px) 0 0 / 48px 48px,
      linear-gradient(rgba(78,255,235,.04) 1px, transparent 1px) 0 0 / 48px 48px;
    mix-blend-mode:screen;
  }
  .trve-root.theme-wild h1,
  .trve-root.theme-wild h2,
  .trve-root.theme-wild .trve-mark{
    text-shadow:0 0 18px rgba(255,77,210,.45), 0 0 36px rgba(78,255,235,.22);
  }
  .trve-root.theme-wild .trve-btn-primary{background:var(--accent);border-color:var(--accent);color:#0B0420}
  .trve-root.theme-wild .trve-btn-primary:hover{background:transparent;color:var(--fg)}
  .trve-root.theme-wild .trve-mark .chev,
  .trve-root.theme-wild .trve-eyebrow::before,
  .trve-root.theme-wild .trve-card-num::before{
    background:linear-gradient(135deg,#FF4DD2,#4EFFEB);
  }

  .trve-root,.trve-root *{box-sizing:border-box}
  .trve-root,[class^="trve-"],[class*=" trve-"]{margin:0;padding:0}
  .trve-root .trve-card p,.trve-root .trve-cta-banner p,.trve-root .trve-sub-head p{margin:0}
  .trve-root{background:var(--bg);color:var(--fg);font-family:var(--body);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh;position:relative}
  .trve-root::selection{background:var(--fg);color:var(--bg)}
  .trve-root a{color:inherit;text-decoration:none}
  .trve-wrap{max-width:1240px;margin:0 auto;padding:0 32px;position:relative;z-index:1}

  .trve-eyebrow{font-family:var(--mono);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mute);display:inline-flex;align-items:center;gap:10px}
  .trve-eyebrow::before{content:"";width:7px;height:7px;background:var(--fg);clip-path:polygon(0 0,100% 50%,0 100%);flex:none}

  .trve-header{position:fixed;left:0;right:0;z-index:50;background:rgba(255,255,255,0);border-bottom:1px solid transparent;transition:background .35s,border-color .35s}
  .trve-root.theme-wild .trve-header.scrolled{background:rgba(11,4,32,.82)}
  .trve-header.scrolled{background:rgba(255,255,255,.88);border-bottom:1px solid var(--line-soft);backdrop-filter:blur(8px)}
  .trve-bar{display:flex;align-items:center;justify-content:space-between;height:64px}
  .trve-mark{font-family:var(--mono);font-size:.9rem;letter-spacing:.18em;font-weight:500;display:inline-flex;align-items:center;gap:10px;color:var(--fg)}
  .trve-mark .badge{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid var(--accent);background:transparent;font-size:.62rem;font-weight:600;color:var(--accent);letter-spacing:-.02em;flex:none}
  .trve-mark .wm-accent{color:var(--accent)}
  .trve-nav{display:flex;align-items:center;gap:18px;font-family:var(--mono);font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
  .trve-nav a,.trve-nav button{color:var(--mute);background:transparent;border:none;cursor:pointer;font:inherit;letter-spacing:inherit;text-transform:inherit}
  .trve-nav a:hover,.trve-nav button:hover{color:var(--fg)}
  .trve-nav .cta{border:1px solid var(--line);padding:9px 16px;color:var(--fg)}
  .trve-nav .cta:hover{background:var(--fg);color:var(--bg)}
  .trve-lang{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:2px;gap:0}
  .trve-lang button{padding:5px 10px;border-radius:999px;font-family:var(--mono);font-size:.66rem;letter-spacing:.08em;color:var(--mute)}
  .trve-lang button.on{background:var(--fg);color:var(--bg)}
  @media(max-width:880px){.trve-nav .hide-sm{display:none}}

  .trve-root .trve-btn{font-family:var(--mono);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;padding:15px 26px;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--fg);transition:.2s;display:inline-block;text-align:center}
  .trve-root .trve-btn-primary{background:var(--fg);color:var(--bg);border-color:var(--fg);font-weight:500}
  .trve-root .trve-btn-primary:hover{background:transparent;color:var(--fg)}
  .trve-root .trve-btn-ghost:hover{border-color:var(--fg)}
  .trve-cta-row{display:flex;gap:12px;flex-wrap:wrap}

  /* Sub-page layout */
  .trve-sub{padding:140px 0 80px}
  .trve-sub-head{max-width:760px;margin:0 auto;text-align:center;padding-bottom:48px}
  .trve-sub-head h1{font-family:var(--display);font-weight:600;font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.02;letter-spacing:-.02em;margin:18px 0 22px}
  .trve-sub-head p{color:var(--mute);font-size:1.1rem;line-height:1.6;max-width:60ch;margin:0 auto}
  .trve-sub-grid{max-width:840px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
  .trve-card{position:relative;background:var(--bg-2);border:1px solid var(--line-soft);padding:30px 32px}
  .trve-card::before{content:"";position:absolute;top:0;left:24px;width:38px;height:2px;background:var(--accent);opacity:.8}
  .trve-card-head{display:flex;align-items:baseline;gap:14px;margin-bottom:12px}
  .trve-card-num{font-family:var(--mono);font-size:.74rem;letter-spacing:.16em;color:var(--mute-2)}
  .trve-card h2{font-family:var(--display);font-weight:600;font-size:1.4rem;letter-spacing:-.01em;line-height:1.2}
  .trve-card p{color:var(--mute);font-size:1.02rem;line-height:1.65}
  .trve-card p b,.trve-card p strong{color:var(--fg);font-weight:500}
  .trve-card-list{margin-top:10px;padding-left:18px;color:var(--mute);font-size:1.02rem;line-height:1.7}
  .trve-card-list li{padding:2px 0}

  .trve-cta-banner{max-width:840px;margin:60px auto 0;border-top:1px solid var(--line);padding-top:40px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:18px}
  .trve-cta-banner p{color:var(--mute);font-size:1rem;max-width:46ch}

  .trve-root .trve-prose{max-width:760px;margin:0 auto;font-family:var(--body);font-size:1rem;line-height:1.7}
  .trve-root .trve-prose,
  .trve-root .trve-prose p,
  .trve-root .trve-prose li,
  .trve-root .trve-prose span,
  .trve-root .trve-prose div{color:var(--mute)}
  .trve-root .trve-prose h1,
  .trve-root .trve-prose h2,
  .trve-root .trve-prose h3,
  .trve-root .trve-prose strong,
  .trve-root .trve-prose b{color:var(--fg)}
  .trve-root .trve-prose h1{font-family:var(--display);font-weight:600;font-size:clamp(2rem,4vw,3rem);letter-spacing:-.02em;line-height:1.05;margin:0 0 24px}
  .trve-root .trve-prose h2{font-family:var(--display);font-weight:600;font-size:1.5rem;letter-spacing:-.01em;margin:40px 0 14px}
  .trve-root .trve-prose h3{font-family:var(--display);font-weight:500;font-size:1.15rem;margin:28px 0 10px}
  .trve-root .trve-prose p{margin:0 0 14px}
  .trve-root .trve-prose ul,.trve-root .trve-prose ol{margin:0 0 18px;padding-left:22px}
  .trve-root .trve-prose li{margin:4px 0}
  .trve-root .trve-prose a{color:var(--fg);border-bottom:1px solid var(--line)}
  .trve-root .trve-prose strong,.trve-root .trve-prose b{font-weight:600}
  .trve-root .trve-prose section{margin-bottom:32px}
  .trve-root .trve-prose hr{border:none;border-top:1px solid var(--line-soft);margin:32px 0}

  .trve-footer{border-top:1px solid var(--line-soft);padding:40px 0 50px;position:relative;z-index:1}
  .trve-foot{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;font-family:var(--mono);font-size:.72rem;letter-spacing:.1em;color:var(--mute-2);text-transform:uppercase}
  .trve-foot .fcol{display:flex;flex-direction:column;gap:8px}
  .trve-foot a:hover{color:var(--fg)}

  .trve-root :focus-visible{outline:2px solid var(--fg);outline-offset:2px}
`;

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';

function injectFonts() {
  if (document.querySelector('link[data-trve-fonts]')) return;
  const pre1 = document.createElement('link');
  pre1.rel = 'preconnect';
  pre1.href = 'https://fonts.googleapis.com';
  pre1.setAttribute('data-trve-fonts', '1');
  const pre2 = document.createElement('link');
  pre2.rel = 'preconnect';
  pre2.href = 'https://fonts.gstatic.com';
  pre2.crossOrigin = 'anonymous';
  pre2.setAttribute('data-trve-fonts', '1');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONTS_HREF;
  link.setAttribute('data-trve-fonts', '1');
  document.head.append(pre1, pre2, link);
}

export interface TrveLayoutProps {
  children: ReactNode;
}

export function TrveLayout({ children }: TrveLayoutProps) {
  const { t, language, setLanguage } = useLanguage();
  const [theme, setTheme] = useTrveTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    injectFonts();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`trve-root theme-${theme}`}>
      <style>{styles}</style>

      <header className={`trve-header${scrolled ? ' scrolled' : ''}`} style={{ top: TEASER_MODE ? '2.5rem' : 0 }}>
        <div className="trve-wrap trve-bar">
          <Link to="/" className="trve-mark" aria-label="TRVE_">
            <span className="badge">T_</span>
            <span>TRVE<span className="wm-accent">_</span></span>
          </Link>
          <nav className="trve-nav">
            <Link to="/#story" className="hide-sm">{t('dealer.nav.howItWorks')}</Link>
            <Link to="/#value" className="hide-sm">{t('dealer.nav.forDealer')}</Link>
            <div className="trve-lang hide-sm" role="group" aria-label="Theme">
              {TRVE_THEMES.map((th) => (
                <button
                  key={th}
                  type="button"
                  className={theme === th ? 'on' : ''}
                  aria-pressed={theme === th}
                  aria-label={`Theme ${th}`}
                  title={th}
                  onClick={() => setTheme(th)}
                >
                  {th === 'light' ? '\u25CB' : '\u272A'}
                </button>
              ))}
            </div>
            <div className="trve-lang hide-sm" role="group" aria-label="Language">
              {(['pl', 'en'] as const).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  className={language === lng ? 'on' : ''}
                  aria-pressed={language === lng}
                  onClick={() => setLanguage(lng)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
            {!TEASER_MODE && (
              <Link to="/login" className="hide-sm">{t('dealer.nav.login')}</Link>
            )}
            <Link to="/#demo" className="cta">{t('dealer.nav.bookDemo')}</Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="trve-footer">
        <div className="trve-wrap trve-foot">
          <div className="fcol">
            <Link to="/" className="trve-mark" aria-label="TRVE_">
              <span className="badge">T_</span>
              <span>TRVE<span className="wm-accent">_</span></span>
            </Link>
          </div>
          <div className="fcol">
            <span>{t('dealer.footer.slogan')}</span>
            <span>{t('dealer.footer.copyright')}</span>
          </div>
          <div className="fcol">
            <Link to="/#story">{t('dealer.footer.howItWorks')}</Link>
            <Link to="/#demo">{t('dealer.footer.contact')}</Link>
            <a href="mailto:hello@trve.io">hello@trve.io</a>
            <a href="https://x.com/trveio" target="_blank" rel="noopener noreferrer" aria-label="TRVE_ on X" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2H21l-6.52 7.45L22 22h-6.91l-4.94-6.45L4.56 22H2l7.06-8.06L2 2h6.91l4.47 5.93L18.244 2zm-1.21 18h1.83L7.05 4h-1.9l11.884 16z"/>
              </svg>
              @trveio
            </a>
          </div>
          <div className="fcol">
            <span>{t('nav.otherIndustries')}</span>
            <Link to="/komis">{t('komis.label')}</Link>
            <Link to="/zegarmistrzostwo">{t('nav.industry.watches')}</Link>
            <Link to="/galerie-sztuki">{t('nav.industry.art')}</Link>
            <Link to="/instrumenty">{t('nav.industry.instruments')}</Link>
            <Link to="/inne">{t('nav.industry.other')}</Link>
          </div>
          <div className="fcol">
            <Link to="/jak-dziala">{t('footer.link.howItWorksTech')}</Link>
            <Link to="/roadmap">{t('footer.link.roadmap')}</Link>
            <Link to="/whitepaper">{t('footer.link.whitepaper')}</Link>
            <Link to="/privacy">{t('footer.link.privacy')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
