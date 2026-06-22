import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { contactService, getErrorMessage } from '../services/contactService';

const HERO_WHITEPAPER_HASH =
  '0xad88104798a999c3ab26d90d2bc68e83b25d14f512678e18843de0ce9ab03a44';
const HERO_VERIFY_URL = `https://trve.io/verify/${HERO_WHITEPAPER_HASH}`;

const TEASER_MODE = import.meta.env.VITE_TEASER_MODE === 'true';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';

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
    --display:"Archivo",system-ui,sans-serif;
    --body:"Archivo",system-ui,sans-serif;
    --mono:"IBM Plex Mono",ui-monospace,monospace;
  }
  .trve-root.theme-wild{
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
  .trve-root.theme-wild .trve-mark,
  .trve-root.theme-wild h1,
  .trve-root.theme-wild h2,
  .trve-root.theme-wild h3{
    text-shadow:0 0 18px rgba(255,77,210,.45), 0 0 36px rgba(78,255,235,.22);
  }
  .trve-root.theme-wild .trve-btn-primary{background:var(--accent);border-color:var(--accent);color:#0B0420}
  .trve-root.theme-wild .trve-btn-primary:hover{background:transparent;color:var(--fg)}
  .trve-root.theme-wild .trve-pchip.on{background:var(--accent);color:#0B0420}
  .trve-root.theme-wild .trve-mark .chev,
  .trve-root.theme-wild .trve-eyebrow::before,
  .trve-root.theme-wild .trve-step .num .ch{
    background:linear-gradient(135deg,#FF4DD2,#4EFFEB);
  }
  .trve-root,.trve-root *{margin:0;padding:0;box-sizing:border-box}
  .trve-root{background:var(--bg);color:var(--fg);font-family:var(--body);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
  .trve-root::selection{background:var(--fg);color:var(--bg)}
  .trve-root a{color:inherit;text-decoration:none}
  .trve-wrap{max-width:1240px;margin:0 auto;padding:0 32px}

  .trve-eyebrow{font-family:var(--mono);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mute);display:flex;align-items:center;gap:10px}
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

  .trve-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;border-bottom:1px solid var(--line-soft);position:relative;padding:140px 0 0;overflow:hidden}
  .trve-hero-grid{position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.55;background-image:linear-gradient(90deg,var(--line-soft) 1px,transparent 1px);background-size:calc(100% / 6) 100%}
  .trve-hero-inner{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;max-width:920px}
  .trve-hero-deco{position:absolute;z-index:1;right:32px;top:50%;transform:translateY(-44%);width:min(360px,28vw);aspect-ratio:1/1;background:var(--bg-2);border:1px solid var(--line);opacity:0;animation:trve-fade .9s ease .85s forwards}
  .trve-hero-deco::before{content:"";position:absolute;inset:0;background-image:linear-gradient(var(--line-soft) 1px,transparent 1px),linear-gradient(90deg,var(--line-soft) 1px,transparent 1px);background-size:24px 24px;opacity:.55;pointer-events:none}
  .trve-hero-deco .tag{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;font-family:var(--mono);font-size:.7rem;font-weight:500;letter-spacing:.14em;color:var(--fg);text-transform:uppercase;border-bottom:1px solid var(--line);background:var(--bg-2)}
  .trve-hero-deco .tag::before{content:"";width:8px;height:8px;background:var(--accent);clip-path:polygon(0 0,100% 50%,0 100%);flex:none}
  .trve-hero-deco .tag .id{color:var(--mute);font-size:.6rem;letter-spacing:.18em}
  .trve-hero-deco a.qr{position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);display:block;padding:14px;background:#FFFFFF;border:1px solid var(--line);line-height:0;transition:transform .25s ease}
  .trve-hero-deco a.qr:hover{transform:translate(-50%,-50%) scale(1.02)}
  .trve-hero-deco canvas{display:block!important;width:min(220px,18vw)!important;height:auto!important;image-rendering:pixelated}
  .trve-hero-deco .caption{position:absolute;left:0;right:0;bottom:14px;text-align:center;font-family:var(--mono);font-size:.62rem;letter-spacing:.16em;color:var(--mute);text-transform:uppercase}
  .trve-hero-deco .caption b{color:var(--fg);font-weight:500}
  .trve-root.theme-wild .trve-hero-deco{background:rgba(11,4,32,.72)}
  .trve-root.theme-wild .trve-hero-deco .tag{background:rgba(11,4,32,.85)}
  @media(max-width:1080px){.trve-hero-deco{display:none}}
  .trve-hero h1{font-family:var(--display);font-weight:600;font-size:clamp(2.6rem,6.8vw,5.4rem);line-height:1.02;letter-spacing:-.025em;max-width:17ch;margin:36px 0 0}
  .trve-hero h1 .ln{display:block;overflow:hidden}
  .trve-hero h1 .ln span{display:block;transform:translateY(110%);animation:trve-rise .8s cubic-bezier(.16,1,.3,1) forwards}
  .trve-hero h1 .ln:nth-child(2) span{animation-delay:.07s}
  .trve-hero h1 .ln:nth-child(3) span{animation-delay:.14s}
  @keyframes trve-rise{to{transform:translateY(0)}}
  .trve-hero .lead{max-width:56ch;margin:34px 0 0;color:var(--mute);font-size:1.18rem;line-height:1.6;opacity:0;animation:trve-fade .8s ease .5s forwards}
  .trve-hero .lead b{color:var(--fg);font-weight:600}
  @keyframes trve-fade{to{opacity:1}}
  .trve-cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:44px;opacity:0;animation:trve-fade .8s ease .65s forwards}
  .trve-root .trve-btn{font-family:var(--mono);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;padding:15px 26px;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--fg);transition:.2s;display:inline-block;text-align:center}
  .trve-root .trve-btn-primary{background:var(--fg);color:var(--bg);border-color:var(--fg);font-weight:500}
  .trve-root .trve-btn-primary:hover{background:transparent;color:var(--fg)}
  .trve-root .trve-btn-ghost:hover{border-color:var(--fg)}
  .trve-hero-status{position:relative;z-index:2;border-top:1px solid var(--line-soft);font-family:var(--mono);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mute-2);display:flex;flex-wrap:wrap;gap:8px 32px;padding:18px 0;margin-top:60px;opacity:0;animation:trve-fade 1s ease .9s forwards}
  .trve-hero-status b{color:var(--mute);font-weight:400}

  .trve-sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:24px;padding:90px 0 36px;border-bottom:1px solid var(--line-soft);flex-wrap:wrap}
  .trve-sec-head h2{font-family:var(--display);font-weight:600;font-size:clamp(1.8rem,4vw,3rem);letter-spacing:-.015em;line-height:1.04;max-width:20ch}
  .trve-sec-idx{font-family:var(--mono);font-size:.72rem;letter-spacing:.16em;color:var(--mute-2);white-space:nowrap}

  .trve-story-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;padding-top:8px}
  .trve-stage-col{position:sticky;top:88px;height:min(540px,70vh)}
  .trve-stage{position:relative;width:100%;height:100%;background:var(--bg-2);border:1px solid var(--line);overflow:hidden}
  .trve-stage::before{content:"";position:absolute;inset:0;background-image:linear-gradient(var(--line-soft) 1px,transparent 1px),linear-gradient(90deg,var(--line-soft) 1px,transparent 1px);background-size:32px 32px;opacity:.6}
  .trve-stage-tag{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;font-family:var(--mono);font-size:.84rem;font-weight:500;letter-spacing:.14em;color:var(--fg);text-transform:uppercase;border-bottom:1px solid var(--line);background:var(--bg-2)}
  .trve-stage-tag .lhs{display:inline-flex;align-items:center;gap:10px;min-width:0}
  .trve-stage-tag .lhs::before{content:"";width:8px;height:8px;background:var(--accent);clip-path:polygon(0 0,100% 50%,0 100%);flex:none}
  .trve-stage-tag .lhs span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .trve-stage-tag .rhs{font-size:.66rem;color:var(--mute);letter-spacing:.18em;flex:none}
  .trve-root.theme-wild .trve-stage-tag{background:rgba(11,4,32,.75)}
  .trve-stage-progress{position:absolute;bottom:0;left:0;right:0;z-index:5;display:flex;border-top:1px solid var(--line-soft)}
  .trve-pchip{flex:1;height:34px;position:relative;border-right:1px solid var(--line-soft);font-family:var(--mono);font-size:.62rem;color:var(--mute-2);display:flex;align-items:center;justify-content:center;letter-spacing:.1em;background:transparent;border-top:none;border-bottom:none;border-left:none;cursor:pointer;transition:color .2s,background .2s}
  .trve-pchip:last-child{border-right:none}
  .trve-pchip:hover{color:var(--fg)}
  .trve-pchip.on{color:var(--bg);background:var(--fg)}

  .trve-layer{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .5s ease;pointer-events:none}
  .trve-layer.active{opacity:1}
  .trve-beam{position:absolute;top:-16%;left:50%;width:30%;height:118%;z-index:0;pointer-events:none;transform:translateX(-50%) rotate(8deg);transform-origin:top center;background:linear-gradient(180deg,rgba(245,245,244,.15),rgba(245,245,244,.05) 52%,transparent 86%);filter:blur(15px);opacity:0;transition:opacity .9s ease .3s;-webkit-mask-image:linear-gradient(90deg,transparent,#000 35%,#000 65%,transparent);mask-image:linear-gradient(90deg,transparent,#000 35%,#000 65%,transparent)}
  .trve-beam::after{content:"";position:absolute;bottom:4%;left:50%;width:170%;height:26%;transform:translateX(-50%);background:radial-gradient(60% 60% at 50% 50%,rgba(245,245,244,.10),transparent 72%);filter:blur(12px)}
  .trve-layer.active .trve-beam{opacity:1;animation:trve-beam 7s ease-in-out infinite}
  .trve-layer[data-layer="0"] svg{position:relative;z-index:1}
  @keyframes trve-beam{0%,100%{opacity:.72}50%{opacity:1}}
  .trve-layer svg{width:82%;height:auto;max-height:76%}
  .trve-draw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1s ease}
  .trve-layer.active .trve-draw{stroke-dashoffset:0}
  .trve-pop{opacity:0;transition:opacity .45s ease .35s}
  .trve-layer.active .trve-pop{opacity:1}
  .trve-row-r{opacity:0;transform:translateX(-6px);transition:opacity .4s ease,transform .4s ease}
  .trve-layer.active .trve-row-r{opacity:1;transform:none}
  .trve-layer.active .trve-r1{transition-delay:.3s}.trve-layer.active .trve-r2{transition-delay:.45s}
  .trve-layer.active .trve-r3{transition-delay:.6s}.trve-layer.active .trve-r4{transition-delay:.75s}
  .trve-check{opacity:0;transition:opacity .3s ease}
  .trve-layer.active .trve-c1{transition-delay:.5s;opacity:1}.trve-layer.active .trve-c2{transition-delay:.65s;opacity:1}
  .trve-layer.active .trve-c3{transition-delay:.8s;opacity:1}.trve-layer.active .trve-c4{transition-delay:.95s;opacity:1}
  .trve-blk{opacity:0;transition:opacity .4s ease}
  .trve-layer.active .trve-b1{transition-delay:.35s}.trve-layer.active .trve-b2{transition-delay:.5s}.trve-layer.active .trve-b3{transition-delay:.65s}
  .trve-layer.active .trve-blk{opacity:1}

  .trve-steps{display:flex;flex-direction:column}
  .trve-step{min-height:36vh;display:flex;flex-direction:column;justify-content:center;padding:18px 0;border-bottom:1px solid var(--line-soft)}
  .trve-step:last-child{border-bottom:none}
  .trve-step .num{font-family:var(--mono);font-size:.74rem;letter-spacing:.16em;color:var(--mute);display:flex;align-items:center;gap:12px;text-transform:uppercase}
  .trve-step .num b{color:var(--fg);font-weight:500}
  .trve-step .num .ch{width:7px;height:7px;background:var(--fg);clip-path:polygon(0 0,100% 50%,0 100%)}
  .trve-step h3{font-family:var(--display);font-weight:600;font-size:clamp(1.6rem,3.2vw,2.5rem);letter-spacing:-.015em;line-height:1.06;margin:18px 0 14px;max-width:16ch}
  .trve-step p{color:var(--mute);max-width:44ch;font-size:1.05rem}
  .trve-step p b{color:var(--fg);font-weight:500}

  .trve-value{padding-bottom:30px}
  .trve-vrow{display:grid;grid-template-columns:80px 1fr 1.4fr;gap:24px;align-items:baseline;padding:34px 0;border-bottom:1px solid var(--line-soft)}
  .trve-vrow:first-of-type{border-top:1px solid var(--line)}
  .trve-vrow .vi{font-family:var(--mono);font-size:.78rem;color:var(--mute-2);letter-spacing:.1em}
  .trve-vrow h4{font-family:var(--display);font-weight:600;font-size:1.45rem;letter-spacing:-.01em}
  .trve-vrow p{color:var(--mute);font-size:1.04rem;max-width:46ch}
  .trve-vrow:hover h4{color:var(--fg)}
  @media(max-width:720px){.trve-vrow{grid-template-columns:1fr;gap:8px}}

  .trve-closer{padding:120px 0;border-top:1px solid var(--line)}
  .trve-closer h2{font-family:var(--display);font-weight:600;font-size:clamp(2.2rem,5.6vw,4.4rem);letter-spacing:-.025em;line-height:1.0;max-width:16ch}
  .trve-closer p{color:var(--mute);max-width:46ch;margin:24px 0 0;font-size:1.12rem}
  .trve-closer .trve-cta-row{animation:none;opacity:1;margin-top:40px}
  .trve-closer-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;margin-top:56px}
  @media(max-width:880px){.trve-closer-grid{grid-template-columns:1fr;gap:40px}}

  .trve-form{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .trve-form .full{grid-column:1 / -1}
  .trve-field{display:flex;flex-direction:column;gap:6px}
  .trve-field label{font-family:var(--mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
  .trve-field label .req{color:var(--fg);margin-left:6px;font-size:.55rem;opacity:.6}
  .trve-root .trve-input,.trve-root .trve-textarea{
    width:100%;background:var(--bg-2);border:1px solid var(--line);color:var(--fg);
    font-family:var(--body);font-size:.95rem;padding:12px 14px;border-radius:0;outline:none;transition:border-color .2s,background .2s;
  }
  .trve-root .trve-input:focus,.trve-root .trve-textarea:focus{border-color:var(--fg);background:var(--bg-3)}
  .trve-root .trve-input::placeholder,.trve-root .trve-textarea::placeholder{color:var(--mute-2)}
  .trve-root .trve-textarea{min-height:128px;resize:vertical;font-family:var(--body)}
  .trve-form-actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:8px}
  .trve-form-note{color:var(--mute-2);font-family:var(--mono);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;line-height:1.5}
  @media(max-width:560px){.trve-form{grid-template-columns:1fr}}

  .trve-footer{border-top:1px solid var(--line-soft);padding:40px 0 50px}
  .trve-foot{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;font-family:var(--mono);font-size:.72rem;letter-spacing:.1em;color:var(--mute-2);text-transform:uppercase}
  .trve-foot .fcol{display:flex;flex-direction:column;gap:8px}
  .trve-foot a:hover{color:var(--fg)}

  .trve-rv{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s cubic-bezier(.16,1,.3,1)}
  .trve-rv.in{opacity:1;transform:none}

  @media(max-width:880px){
    .trve-story-grid{grid-template-columns:1fr;gap:0}
    .trve-stage-col{position:sticky;top:64px;height:40vh;margin-bottom:8px}
    .trve-step{min-height:auto;padding:48px 0}
    .trve-hero-grid{background-size:calc(100% / 3) 100%}
  }
  @media (prefers-reduced-motion:reduce){
    .trve-root *{animation:none!important;transition:none!important}
    .trve-hero h1 .ln span{transform:none}.trve-hero .lead,.trve-cta-row,.trve-hero-status{opacity:1}
    .trve-layer{opacity:1}.trve-layer:not(.active){display:none}
    .trve-draw{stroke-dashoffset:0}.trve-pop,.trve-row-r,.trve-check{opacity:1;transform:none}.trve-blk{opacity:1}.trve-rv{opacity:1;transform:none}
  }
  .trve-root :focus-visible{outline:2px solid var(--fg);outline-offset:2px}
`;

type Theme = 'light' | 'wild';
const THEME_KEY = 'trve-landing-theme';
const THEMES: Theme[] = ['light', 'wild'];

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    return stored && THEMES.includes(stored) ? stored : 'light';
  });
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rvRefs = useRef<Array<HTMLDivElement | null>>([]);
  const heroQrRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!heroQrRef.current) return;
    QRCode.toCanvas(heroQrRef.current, HERO_VERIFY_URL, {
      width: 440,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#161616', light: '#FFFFFF' },
    }).catch(() => { /* silent */ });
  }, []);

  // Load Google Fonts once
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal-on-scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    rvRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Sticky stage layer driven by visible step — pick the step whose top is nearest the
  // viewport's pinned anchor (just below the sticky stage tag).
  useEffect(() => {
    const pick = () => {
      const anchor = 120; // px from viewport top where we consider a step "active"
      let bestIdx = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        // Active when the step's center is closest to the anchor line
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - anchor - r.height / 2);
        if (r.bottom > 0 && r.top < window.innerHeight && dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setActiveStep(bestIdx);
    };
    pick();
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick);
    return () => {
      window.removeEventListener('scroll', pick);
      window.removeEventListener('resize', pick);
    };
  }, []);

  const tags = [
    t('dealer.story.tag1'),
    t('dealer.story.tag2'),
    t('dealer.story.tag3'),
    t('dealer.story.tag4'),
  ];

  const valueRows: Array<{ idx: string; title: string; body: string }> = [
    { idx: '01', title: t('dealer.value.v1.title'), body: t('dealer.value.v1.body') },
    { idx: '02', title: t('dealer.value.v2.title'), body: t('dealer.value.v2.body') },
    { idx: '03', title: t('dealer.value.v3.title'), body: t('dealer.value.v3.body') },
    { idx: '04', title: t('dealer.value.v4.title'), body: t('dealer.value.v4.body') },
  ];

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState === 'sending') return;
    setFormState('sending');
    setFormError(null);
    try {
      await contactService.sendDemoRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim() || undefined,
      });
      setFormState('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setFormState('error');
      setFormError(getErrorMessage(err) || t('dealer.form.error'));
    }
  };

  // Some i18n values (bodyEnd for steps 2-4) are intentionally empty; t() falls back to the key
  // when the value is falsy, so we strip the fallback.
  const tOpt = (key: string) => {
    const v = t(key);
    return v === key ? '' : v;
  };

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
            <a href="#story" className="hide-sm">{t('dealer.nav.howItWorks')}</a>
            <a href="#value" className="hide-sm">{t('dealer.nav.forDealer')}</a>
            <div className="trve-lang hide-sm" role="group" aria-label="Theme">
              {THEMES.map((th) => (
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
            <a href="#demo" className="cta">{t('dealer.nav.bookDemo')}</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="trve-hero">
        <div className="trve-hero-grid" />
        <div className="trve-hero-deco">
          <div className="tag">
            <span>{t('dealer.hero.eyebrow')}</span>
            <span className="id">TRVE_ ID · WHITEPAPER</span>
          </div>
          <a
            className="qr"
            href={HERO_VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zweryfikuj asset TRVE_"
          >
            <canvas ref={heroQrRef} />
          </a>
          <div className="caption">{t('dealer.hero.qrCaption')}</div>
        </div>
        <div className="trve-wrap trve-hero-inner">
          <span className="trve-eyebrow">{t('dealer.hero.eyebrow')}</span>
          <h1>
            <span className="ln"><span>{t('dealer.hero.title1')}</span></span>
            <span className="ln"><span>{t('dealer.hero.title2')}</span></span>
            <span className="ln"><span>{t('dealer.hero.title3')}</span></span>
          </h1>
          <p className="lead">
            {t('dealer.hero.leadStart')}
            <b>{t('dealer.hero.leadHighlight')}</b>
            {t('dealer.hero.leadEnd')}
          </p>
          <div className="trve-cta-row">
            <a href="#demo" className="trve-btn trve-btn-primary">{t('dealer.hero.ctaPrimary')}</a>
            <a href="#story" className="trve-btn trve-btn-ghost">{t('dealer.hero.ctaSecondary')}</a>
          </div>
        </div>
        <div className="trve-wrap trve-hero-status">
          <span>{t('dealer.hero.status1Label')} <b>{t('dealer.hero.status1Value')}</b></span>
          <span>{t('dealer.hero.status2Label')} <b>{t('dealer.hero.status2Value')}</b></span>
          <span>{t('dealer.hero.status3Label')} <b>{t('dealer.hero.status3Value')}</b></span>
        </div>
      </section>

      {/* STORY */}
      <section id="story">
        <div className="trve-wrap">
          <div className="trve-sec-head trve-rv" ref={(el) => { rvRefs.current[0] = el; }}>
            <h2>{t('dealer.story.headline')}</h2>
            <span className="trve-sec-idx">{t('dealer.story.idx')}</span>
          </div>

          <div className="trve-story-grid">
            <div className="trve-stage-col">
              <div className="trve-stage">
                <div className="trve-stage-tag">
                  <span className="lhs">
                    <span>{String(activeStep + 1).padStart(2, '0')} / {tags[activeStep]}</span>
                  </span>
                  <span className="rhs">{t('dealer.story.stageId')}</span>
                </div>

                {/* LAYER 0 */}
                <div className={`trve-layer${activeStep === 0 ? ' active' : ''}`} data-layer="0">
                  <div className="trve-beam" />
                  <svg viewBox="0 0 420 340" fill="none" stroke="var(--fg)" strokeWidth="1.3">
                    <path className="trve-draw" pathLength="1" d="M40 240 L70 240 C78 240 82 236 88 226 L120 186 C128 176 138 172 152 172 L262 172 C276 172 286 176 296 186 L322 214 L360 222 C372 224 380 232 380 244 L380 240" strokeLinecap="round" />
                    <path className="trve-draw" pathLength="1" d="M40 240 L380 240" stroke="var(--mute)" />
                    <path className="trve-draw" pathLength="1" d="M150 172 L168 200 L300 200 L286 178" stroke="var(--mute)" strokeWidth="1" />
                    <circle className="trve-draw" pathLength="1" cx="128" cy="240" r="23" />
                    <circle cx="128" cy="240" r="8" stroke="var(--mute)" />
                    <circle className="trve-draw" pathLength="1" cx="312" cy="240" r="23" />
                    <circle cx="312" cy="240" r="8" stroke="var(--mute)" />
                    <g className="trve-pop" transform="translate(210 104)">
                      <rect x="-42" y="-42" width="84" height="84" fill="none" stroke="var(--mute-2)" strokeWidth=".8" />
                      <rect x="-22" y="-22" width="44" height="44" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1" />
                      <g fill="var(--fg)">
                        <rect x="-17" y="-17" width="9" height="9" /><rect x="8" y="-17" width="9" height="9" /><rect x="-17" y="8" width="9" height="9" />
                        <rect x="-2" y="-15" width="4" height="4" /><rect x="6" y="-6" width="4" height="4" /><rect x="-13" y="2" width="4" height="4" />
                        <rect x="2" y="2" width="4" height="4" /><rect x="10" y="6" width="4" height="4" /><rect x="-4" y="10" width="4" height="4" /><rect x="6" y="12" width="4" height="4" />
                      </g>
                    </g>
                  </svg>
                </div>

                {/* LAYER 1 */}
                <div className={`trve-layer${activeStep === 1 ? ' active' : ''}`} data-layer="1">
                  <svg viewBox="0 0 420 340" fill="none">
                    <rect className="trve-pop" x="70" y="34" width="280" height="272" fill="none" stroke="var(--line)" />
                    <text className="trve-pop" x="86" y="62" fill="var(--fg)" fontFamily="IBM Plex Mono,monospace" fontSize="11" letterSpacing="1.4">
                      {t('dealer.stage.serviceHistory')}
                    </text>
                    <line className="trve-pop" x1="86" y1="74" x2="334" y2="74" stroke="var(--line-soft)" />
                    <g fontFamily="IBM Plex Mono,monospace" fontSize="9">
                      <g className="trve-blk trve-b1">
                        <text x="86" y="108" fill="var(--mute-2)">{t('dealer.stage.svc1Date')}</text>
                        <text x="86" y="124" fill="var(--fg)" fontSize="11">{t('dealer.stage.svc1Title')}</text>
                        <path className="trve-check trve-c1" d="M312 110 l5 5 l9 -11" stroke="var(--fg)" strokeWidth="1.5" fill="none" />
                        <line x1="86" y1="138" x2="334" y2="138" stroke="var(--line-soft)" />
                      </g>
                      <g className="trve-blk trve-b2">
                        <text x="86" y="166" fill="var(--mute-2)">{t('dealer.stage.svc2Date')}</text>
                        <text x="86" y="182" fill="var(--fg)" fontSize="11">{t('dealer.stage.svc2Title')}</text>
                        <path className="trve-check trve-c2" d="M312 168 l5 5 l9 -11" stroke="var(--fg)" strokeWidth="1.5" fill="none" />
                        <line x1="86" y1="196" x2="334" y2="196" stroke="var(--line-soft)" />
                      </g>
                      <g className="trve-blk trve-b3">
                        <text x="86" y="224" fill="var(--mute-2)">{t('dealer.stage.svc3Date')}</text>
                        <text x="86" y="240" fill="var(--fg)" fontSize="11">{t('dealer.stage.svc3Title')}</text>
                        <path className="trve-check trve-c3" d="M312 226 l5 5 l9 -11" stroke="var(--fg)" strokeWidth="1.5" fill="none" />
                      </g>
                    </g>
                    <text className="trve-blk trve-b3" x="86" y="288" fill="var(--mute)" fontFamily="IBM Plex Mono,monospace" fontSize="8" letterSpacing="1">
                      {t('dealer.stage.entrySigned')}
                    </text>
                  </svg>
                </div>

                {/* LAYER 2 */}
                <div className={`trve-layer${activeStep === 2 ? ' active' : ''}`} data-layer="2">
                  <svg viewBox="0 0 420 340" fill="none">
                    <rect className="trve-pop" x="86" y="34" width="248" height="272" fill="none" stroke="var(--line)" />
                    <g className="trve-pop" transform="translate(106 56)">
                      <rect width="24" height="24" fill="none" stroke="var(--fg)" strokeWidth="1" />
                      <g fill="var(--fg)">
                        <rect x="4" y="4" width="5" height="5" /><rect x="15" y="4" width="5" height="5" />
                        <rect x="4" y="15" width="5" height="5" /><rect x="11" y="11" width="3" height="3" />
                      </g>
                    </g>
                    <text className="trve-pop" x="142" y="68" fill="var(--fg)" fontFamily="IBM Plex Mono,monospace" fontSize="11" letterSpacing="1.4">
                      {t('dealer.stage.verified')}
                    </text>
                    <text className="trve-pop" x="142" y="82" fill="var(--mute)" fontFamily="IBM Plex Mono,monospace" fontSize="8" letterSpacing="1">
                      {t('dealer.story.stageId')}
                    </text>
                    <line className="trve-pop" x1="106" y1="98" x2="314" y2="98" stroke="var(--line-soft)" />
                    <g fontFamily="IBM Plex Mono,monospace" fontSize="9">
                      <g className="trve-row-r trve-r1">
                        <text x="106" y="132" fill="var(--mute-2)">{t('dealer.stage.vinLabel')}</text>
                        <text x="106" y="146" fill="var(--fg)" fontSize="11">{t('dealer.stage.vinValue')}</text>
                        <path className="trve-check trve-c1" d="M298 136 l5 5 l9 -11" stroke="var(--fg)" strokeWidth="1.5" fill="none" />
                      </g>
                      <g className="trve-row-r trve-r2">
                        <text x="106" y="176" fill="var(--mute-2)">{t('dealer.stage.specLabel')}</text>
                        <text x="106" y="190" fill="var(--fg)" fontSize="11">{t('dealer.stage.specValue')}</text>
                        <path className="trve-check trve-c2" d="M298 180 l5 5 l9 -11" stroke="var(--fg)" strokeWidth="1.5" fill="none" />
                      </g>
                      <g className="trve-row-r trve-r3">
                        <text x="106" y="220" fill="var(--mute-2)">{t('dealer.stage.serviceLabel')}</text>
                        <text x="106" y="234" fill="var(--fg)" fontSize="11">{t('dealer.stage.serviceValue')}</text>
                        <path className="trve-check trve-c3" d="M298 224 l5 5 l9 -11" stroke="var(--fg)" strokeWidth="1.5" fill="none" />
                      </g>
                      <g className="trve-row-r trve-r4">
                        <text x="106" y="264" fill="var(--mute-2)">{t('dealer.stage.ownerLabel')}</text>
                        <text x="106" y="278" fill="var(--fg)" fontSize="11">{t('dealer.stage.ownerValue')}</text>
                        <path className="trve-check trve-c4" d="M298 268 l5 5 l9 -11" stroke="var(--fg)" strokeWidth="1.5" fill="none" />
                      </g>
                    </g>
                  </svg>
                </div>

                {/* LAYER 3 */}
                <div className={`trve-layer${activeStep === 3 ? ' active' : ''}`} data-layer="3">
                  <svg viewBox="0 0 420 340" fill="none">
                    <g className="trve-pop" stroke="var(--fg)" strokeWidth="1.3" fill="none" strokeLinecap="round">
                      <circle cx="140" cy="110" r="5" fill="var(--mute-2)" stroke="none" />
                      <circle cx="280" cy="110" r="5" fill="var(--fg)" stroke="none" />
                      <path className="trve-draw" pathLength="1" d="M152 110 L268 110" />
                      <path d="M260 104 l10 6 l-10 6" />
                    </g>
                    <text className="trve-pop" x="118" y="138" fill="var(--mute)" fontFamily="IBM Plex Mono,monospace" fontSize="9">{t('dealer.stage.dealer')}</text>
                    <text className="trve-pop" x="262" y="138" fill="var(--fg)" fontFamily="IBM Plex Mono,monospace" fontSize="9">{t('dealer.stage.buyer')}</text>
                    <g transform="translate(54 184)" fontFamily="IBM Plex Mono,monospace">
                      <g className="trve-blk trve-b1">
                        <rect width="86" height="64" fill="none" stroke="var(--line)" />
                        <text x="12" y="26" fill="var(--mute-2)" fontSize="8">{t('dealer.stage.block')} 01</text>
                        <text x="12" y="44" fill="var(--fg)" fontSize="9">{t('dealer.stage.blockReg')}</text>
                      </g>
                      <line className="trve-blk trve-b2" x1="86" y1="32" x2="128" y2="32" stroke="var(--fg)" strokeWidth="1.2" />
                      <g className="trve-blk trve-b2" transform="translate(128 0)">
                        <rect width="86" height="64" fill="none" stroke="var(--line)" />
                        <text x="12" y="26" fill="var(--mute-2)" fontSize="8">{t('dealer.stage.block')} 02</text>
                        <text x="12" y="44" fill="var(--fg)" fontSize="9">{t('dealer.stage.blockService')}</text>
                      </g>
                      <line className="trve-blk trve-b3" x1="214" y1="32" x2="256" y2="32" stroke="var(--fg)" strokeWidth="1.2" />
                      <g className="trve-blk trve-b3" transform="translate(256 0)">
                        <rect width="86" height="64" fill="none" stroke="var(--fg)" />
                        <text x="12" y="26" fill="var(--fg)" fontSize="8">{t('dealer.stage.block')} 03</text>
                        <text x="12" y="44" fill="var(--fg)" fontSize="9">{t('dealer.stage.blockSale')}</text>
                      </g>
                    </g>
                    <text className="trve-blk trve-b3" x="210" y="300" textAnchor="middle" fill="var(--mute)" fontFamily="IBM Plex Mono,monospace" fontSize="8" letterSpacing="1">
                      {t('dealer.stage.immutable')}
                    </text>
                  </svg>
                </div>

                <div className="trve-stage-progress">
                  {[0, 1, 2, 3].map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`trve-pchip${activeStep === i ? ' on' : ''}`}
                      aria-label={tags[i]}
                      aria-pressed={activeStep === i}
                      onClick={() => {
                        const target = stepRefs.current[i];
                        if (!target) return;
                        const headerOffset = 80;
                        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="trve-steps">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="trve-step"
                  data-step={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                >
                  <div className="num">
                    <span className="ch" />
                    <b>{String(i + 1).padStart(2, '0')}</b> {t(`dealer.step${i + 1}.num`)}
                  </div>
                  <h3>{t(`dealer.step${i + 1}.title`)}</h3>
                  <p>
                    {t(`dealer.step${i + 1}.bodyStart`)}
                    <b>{t(`dealer.step${i + 1}.bodyHighlight`)}</b>
                    {tOpt(`dealer.step${i + 1}.bodyEnd`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section id="value">
        <div className="trve-wrap trve-value">
          <div className="trve-sec-head trve-rv" ref={(el) => { rvRefs.current[1] = el; }}>
            <h2>{t('dealer.value.headline')}</h2>
            <span className="trve-sec-idx">{t('dealer.value.idx')}</span>
          </div>
          <div className="trve-rv" ref={(el) => { rvRefs.current[2] = el; }}>
            {valueRows.map((row) => (
              <div className="trve-vrow" key={row.idx}>
                <div className="vi">{row.idx}</div>
                <h4>{row.title}</h4>
                <p>{row.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSER / DEMO */}
      <section id="demo">
        <div className="trve-wrap trve-closer trve-rv" ref={(el) => { rvRefs.current[3] = el; }}>
          <div className="trve-closer-grid">
            <div>
              <span className="trve-eyebrow">{t('dealer.closer.eyebrow')}</span>
              <h2 style={{ marginTop: 26 }}>{t('dealer.closer.title')}</h2>
              <p>{t('dealer.closer.body')}</p>
              <p style={{ marginTop: 16 }}>
                <a
                  href="mailto:hello@trve.io"
                  style={{ color: 'var(--fg)', borderBottom: '1px solid var(--line)', paddingBottom: 2 }}
                >
                  hello@trve.io
                </a>
              </p>
            </div>
            <form className="trve-form" onSubmit={onSubmitForm} noValidate>
              <div className="trve-field">
                <label htmlFor="trve-f-name">
                  {t('dealer.form.name')}<span className="req">{t('dealer.form.required')}</span>
                </label>
                <input
                  id="trve-f-name"
                  className="trve-input"
                  type="text"
                  required
                  value={form.name}
                  onChange={setField('name')}
                  placeholder={t('dealer.form.namePh')}
                  autoComplete="name"
                />
              </div>
              <div className="trve-field">
                <label htmlFor="trve-f-email">
                  {t('dealer.form.email')}<span className="req">{t('dealer.form.required')}</span>
                </label>
                <input
                  id="trve-f-email"
                  className="trve-input"
                  type="email"
                  required
                  value={form.email}
                  onChange={setField('email')}
                  placeholder={t('dealer.form.emailPh')}
                  autoComplete="email"
                />
              </div>
              <div className="trve-field full">
                <label htmlFor="trve-f-phone">{t('dealer.form.phone')}</label>
                <input
                  id="trve-f-phone"
                  className="trve-input"
                  type="tel"
                  value={form.phone}
                  onChange={setField('phone')}
                  placeholder={t('dealer.form.phonePh')}
                  autoComplete="tel"
                />
              </div>
              <div className="trve-field full">
                <label htmlFor="trve-f-msg">{t('dealer.form.message')}</label>
                <textarea
                  id="trve-f-msg"
                  className="trve-textarea"
                  value={form.message}
                  onChange={setField('message')}
                  placeholder={t('dealer.form.messagePh')}
                />
              </div>
              <div className="trve-form-actions full">
                <button
                  type="submit"
                  className="trve-btn trve-btn-primary"
                  disabled={formState === 'sending'}
                  style={{ opacity: formState === 'sending' ? 0.6 : 1, cursor: formState === 'sending' ? 'wait' : 'pointer' }}
                >
                  {formState === 'sending' ? t('dealer.form.sending') : t('dealer.form.submit')}
                </button>
                <span className="trve-form-note">
                  {formState === 'success'
                    ? t('dealer.form.success')
                    : formState === 'error'
                      ? (formError ?? t('dealer.form.error'))
                      : t('dealer.form.note')}
                </span>
              </div>
            </form>
          </div>
        </div>
      </section>

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
            <a href="#story">{t('dealer.footer.howItWorks')}</a>
            <a href="#demo">{t('dealer.footer.contact')}</a>
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
