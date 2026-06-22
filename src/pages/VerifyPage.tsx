import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface VerificationField {
  labelKey: string;
  value: string;
}

interface VerificationEvent {
  type: string;
  date: string;
  title: string;
  description?: string | null;
  source?: string | null;
  mileage?: number | null;
  transactionHash?: string | null;
}

interface VerificationPayload {
  assetName?: string | null;
  assetType: string;
  assetKindKey: string;
  organizationName?: string | null;
  documentCount: number;
  isGenesisExample: boolean;
  events: VerificationEvent[];
  publicFields: VerificationField[];
}

interface VerificationResult {
  isVerified: boolean;
  recordHash?: string;
  merkleRoot?: string;
  batchId?: number;
  transactionHash?: string;
  blockNumber?: number;
  chainId?: number;
  anchoredAt?: string;
  blockchainVerified?: boolean;
  status?: string;
  error?: string;
  payload?: VerificationPayload;
}

const COPY = {
  pl: {
    title: 'Weryfikacja On-Chain',
    subtitle: 'Sprawdź co dany asset ma zapisane w blockchainie',
    placeholder: 'Wklej hash rekordu (0x...)',
    verify: 'Weryfikuj',
    verified: 'Zweryfikowany on-chain',
    notFound: 'Nie znaleziono w rejestrze TRVE_',
    notFoundDesc: 'Ten hash nie został znaleziony w rejestrze TRVE_. Sprawdź poprawność hasha i spróbuj ponownie.',
    sectionAnchored: 'Co zostało zapisane',
    sectionTimeline: 'Historia zmian on-chain',
    sectionTech: 'Dowód kryptograficzny',
    techToggleShow: 'Pokaż dane techniczne',
    techToggleHide: 'Ukryj dane techniczne',
    asset: 'Asset',
    organization: 'Salon / Organizacja',
    documents: 'Dokumenty',
    documentsCount: (n: number) => `${n} ${n === 1 ? 'dokument' : n < 5 ? 'dokumenty' : 'dokumentów'} zakotwiczone wraz z assetem`,
    documentsHidden: 'Dla prywatności nie pokazujemy nazw plików — ale ich hashe są częścią dowodu.',
    documentsZero: 'Asset zakotwiczony bez dokumentów towarzyszących.',
    whitepaperNote:
      'To genesis asset systemu — TRVE_ Developer Whitepaper. Każdy realny produkt (samochód, zegarek, dzieło sztuki) dostanie tu indywidualną kartę z własnymi metadanymi, dokumentami i historią zmian zapisaną na blockchainie Polygon.',
    eventGenesisTitle: 'Genesis — pierwszy asset systemu',
    eventGenesisBody: 'Pierwszy dokument zakotwiczony w rejestrze TRVE_. Od tej chwili każdy inny asset dziedziczy ten sam, niepodrabialny mechanizm.',
    eventRegistrationTitle: 'Rejestracja w TRVE_',
    eventRegistrationBody: 'Asset został założony i jego snapshot trafił do blockchaina.',
    recordHash: 'Hash rekordu',
    merkleRoot: 'Merkle root',
    txHash: 'Transakcja',
    block: 'Blok',
    anchored: 'Zakotwiczony',
    chain: 'Sieć',
    polygon: 'Polygon Mainnet',
    viewExplorer: 'Zobacz na Polygonscan',
    shareLink: 'Kopiuj link weryfikacyjny',
    linkCopied: 'Skopiowano!',
    backHome: '← Strona główna',
    poweredBy: 'Powered by',
    eventOn: 'na',
    eventTx: 'Transakcja',
  },
  en: {
    title: 'On-Chain Verification',
    subtitle: 'See what data this asset has anchored on the blockchain',
    placeholder: 'Paste record hash (0x...)',
    verify: 'Verify',
    verified: 'Verified on-chain',
    notFound: 'Not found in the TRVE_ registry',
    notFoundDesc: 'This hash was not found in the TRVE_ registry. Check the hash and try again.',
    sectionAnchored: 'What is anchored',
    sectionTimeline: 'On-chain history',
    sectionTech: 'Cryptographic proof',
    techToggleShow: 'Show technical details',
    techToggleHide: 'Hide technical details',
    asset: 'Asset',
    organization: 'Dealer / Organisation',
    documents: 'Documents',
    documentsCount: (n: number) => `${n} document${n === 1 ? '' : 's'} anchored with this asset`,
    documentsHidden: "We don't reveal file names for privacy — but their hashes are part of the proof.",
    documentsZero: 'Asset anchored without any attached documents.',
    whitepaperNote:
      'This is the genesis asset of the system — the TRVE_ Developer Whitepaper. Every real-world product (car, watch, artwork) will get its own card here with its own metadata, documents and on-chain history on Polygon.',
    eventGenesisTitle: 'Genesis — first asset on the system',
    eventGenesisBody: 'The first document anchored in the TRVE_ registry. From this moment, every other asset inherits the same unforgeable mechanism.',
    eventRegistrationTitle: 'Registration in TRVE_',
    eventRegistrationBody: 'The asset was created and its snapshot was anchored on the blockchain.',
    recordHash: 'Record hash',
    merkleRoot: 'Merkle root',
    txHash: 'Transaction',
    block: 'Block',
    anchored: 'Anchored',
    chain: 'Network',
    polygon: 'Polygon Mainnet',
    viewExplorer: 'View on Polygonscan',
    shareLink: 'Copy verification link',
    linkCopied: 'Copied!',
    backHome: '← Home',
    poweredBy: 'Powered by',
    eventOn: 'on',
    eventTx: 'Transaction',
  },
} as const;

const FIELD_LABELS: Record<string, { pl: string; en: string }> = {
  'verify.field.brand': { pl: 'Marka', en: 'Brand' },
  'verify.field.model': { pl: 'Model', en: 'Model' },
  'verify.field.year': { pl: 'Rocznik', en: 'Year' },
  'verify.field.serial': { pl: 'Numer seryjny', en: 'Serial number' },
  'verify.field.vin': { pl: 'VIN', en: 'VIN' },
};

const KIND_LABELS: Record<string, { pl: string; en: string }> = {
  'asset.kind.whitepaper': { pl: 'Dokument · Whitepaper', en: 'Document · Whitepaper' },
  'asset.kind.document': { pl: 'Dokument', en: 'Document' },
  'asset.kind.vehicle': { pl: 'Pojazd', en: 'Vehicle' },
  'asset.kind.watch': { pl: 'Zegarek', en: 'Watch' },
  'asset.kind.electronics': { pl: 'Elektronika', en: 'Electronics' },
  'asset.kind.art': { pl: 'Dzieło sztuki', en: 'Artwork' },
  'asset.kind.instrument': { pl: 'Instrument', en: 'Instrument' },
};

const EVENT_TITLES: Record<string, keyof (typeof COPY)['pl']> = {
  'verify.event.genesis.title': 'eventGenesisTitle',
  'verify.event.genesis.body': 'eventGenesisBody',
  'verify.event.registration.title': 'eventRegistrationTitle',
  'verify.event.registration.body': 'eventRegistrationBody',
};

export default function VerifyPage() {
  const { hash } = useParams<{ hash: string }>();
  const [searchParams] = useSearchParams();
  const queryHash = searchParams.get('hash');
  const lookupHash = hash || queryHash || '';

  const [inputHash, setInputHash] = useState(lookupHash);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const { language } = useLanguage();
  const t = COPY[language === 'pl' ? 'pl' : 'en'];
  const lang: 'pl' | 'en' = language === 'pl' ? 'pl' : 'en';

  useEffect(() => {
    if (lookupHash) {
      verify(lookupHash);
    }
  }, [lookupHash]);

  async function verify(hashToVerify: string) {
    const h = hashToVerify.trim();
    if (!h) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setTechOpen(false);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/verification/hash/${encodeURIComponent(h)}`);
      setResult(res.data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
      if (axiosErr.response?.status === 404) {
        setResult({ isVerified: false, status: 'Record not found', recordHash: h });
      } else if (axiosErr.response?.status === 400) {
        setError(axiosErr.response?.data?.error || 'Invalid hash format');
      } else {
        setError('Verification service unavailable. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    verify(inputHash);
    window.history.replaceState(null, '', `/verify/${encodeURIComponent(inputHash.trim())}`);
  }

  function copyShareLink() {
    const url = `${window.location.origin}/verify/${result?.recordHash || inputHash}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  }

  function formatDateShort(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function truncateHash(h: string, chars = 10) {
    if (!h || h.length <= chars * 2 + 2) return h;
    return `${h.slice(0, chars + 2)}...${h.slice(-chars)}`;
  }

  function eventTitle(key: string) {
    const mapped = EVENT_TITLES[key];
    return mapped ? t[mapped] : key;
  }

  function fieldLabel(key: string) {
    return FIELD_LABELS[key]?.[lang] ?? key;
  }

  function kindLabel(key: string) {
    return KIND_LABELS[key]?.[lang] ?? key;
  }

  const explorerUrl = result?.transactionHash
    ? `https://polygonscan.com/tx/${result.transactionHash}`
    : null;

  const payload = result?.payload;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xl font-bold text-foreground">TRVE_</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.backHome}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
            />
            <button
              type="submit"
              disabled={loading || !inputHash.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '...' : t.verify}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center mb-8">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Status banner */}
            <div
              className={`rounded-xl border-2 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                result.isVerified ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    result.isVerified ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {result.isVerified ? '✓' : '✕'}
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${result.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {result.isVerified ? t.verified : t.notFound}
                  </h2>
                  {payload?.assetName && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {payload.assetName}
                      {payload.assetKindKey && (
                        <span className="ml-2 text-xs uppercase tracking-wider text-muted-foreground/70">
                          · {kindLabel(payload.assetKindKey)}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              {result.isVerified && (
                <button
                  onClick={copyShareLink}
                  className="px-4 py-2 text-sm border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors whitespace-nowrap"
                >
                  {copied ? t.linkCopied : t.shareLink}
                </button>
              )}
            </div>

            {!result.isVerified && (
              <div className="rounded-xl border border-border bg-card px-6 py-6 text-center text-sm text-muted-foreground">
                {t.notFoundDesc}
              </div>
            )}

            {result.isVerified && payload && (
              <>
                {/* What was anchored */}
                <section className="rounded-xl border border-border bg-card px-6 py-6">
                  <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    {t.sectionAnchored}
                  </h3>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t.asset}</dt>
                      <dd className="text-foreground font-medium">{payload.assetName || '—'}</dd>
                    </div>
                    {payload.organizationName && (
                      <div>
                        <dt className="text-muted-foreground">{t.organization}</dt>
                        <dd className="text-foreground">{payload.organizationName}</dd>
                      </div>
                    )}
                    {payload.publicFields.map((f) => (
                      <div key={f.labelKey}>
                        <dt className="text-muted-foreground">{fieldLabel(f.labelKey)}</dt>
                        <dd className="text-foreground font-mono text-xs">{f.value}</dd>
                      </div>
                    ))}
                    <div>
                      <dt className="text-muted-foreground">{t.documents}</dt>
                      <dd className="text-foreground">
                        {payload.documentCount > 0 ? (
                          <>
                            <span className="font-medium">{payload.documentCount}</span>
                            <span className="block text-xs text-muted-foreground mt-0.5">{t.documentsHidden}</span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">{t.documentsZero}</span>
                        )}
                      </dd>
                    </div>
                  </dl>

                  {payload.isGenesisExample && (
                    <div className="mt-5 p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground/90 leading-relaxed">
                      <span className="block text-xs uppercase tracking-[0.16em] text-primary mb-1.5">
                        {lang === 'pl' ? 'Asset demonstracyjny' : 'Demonstration asset'}
                      </span>
                      {t.whitepaperNote}
                    </div>
                  )}
                </section>

                {/* On-chain history */}
                {payload.events.length > 0 && (
                  <section className="rounded-xl border border-border bg-card px-6 py-6">
                    <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                      {t.sectionTimeline}
                    </h3>
                    <ol className="space-y-5">
                      {payload.events.map((ev, idx) => (
                        <li key={idx} className="relative pl-8">
                          <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-primary border-2 border-card ring-2 ring-primary/30" />
                          {idx < payload.events.length - 1 && (
                            <span className="absolute left-[5px] top-5 bottom-[-20px] w-px bg-border" />
                          )}
                          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            {formatDateShort(ev.date)}
                            {ev.source && <span className="ml-2">· {ev.source}</span>}
                          </div>
                          <div className="text-foreground font-medium mt-0.5">{eventTitle(ev.title)}</div>
                          {ev.description && (
                            <p className="text-sm text-muted-foreground mt-1">{eventTitle(ev.description)}</p>
                          )}
                          {ev.mileage != null && (
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              {ev.mileage.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')} km
                            </p>
                          )}
                          {ev.transactionHash && (
                            <a
                              href={`https://polygonscan.com/tx/${ev.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-1 text-xs text-primary hover:underline font-mono"
                            >
                              {t.eventTx}: {truncateHash(ev.transactionHash, 8)} ↗
                            </a>
                          )}
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* Technical proof — collapsed */}
                <section className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setTechOpen((v) => !v)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-foreground/[0.02] transition-colors"
                  >
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.sectionTech}</h3>
                      <p className="text-xs text-muted-foreground/70 mt-1 font-mono">
                        {result.recordHash && truncateHash(result.recordHash, 10)}
                      </p>
                    </div>
                    <span className="text-sm text-primary">{techOpen ? t.techToggleHide : t.techToggleShow}</span>
                  </button>

                  {techOpen && (
                    <div className="px-6 py-5 border-t border-border space-y-3 text-sm">
                      <Row label={t.recordHash} value={result.recordHash} mono />
                      {result.merkleRoot && result.merkleRoot !== result.recordHash && (
                        <Row label={t.merkleRoot} value={result.merkleRoot} mono />
                      )}
                      {result.transactionHash && (
                        <Row
                          label={t.txHash}
                          value={
                            <a href={explorerUrl!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {truncateHash(result.transactionHash, 12)} ↗
                            </a>
                          }
                          mono
                        />
                      )}
                      {result.blockNumber && (
                        <Row
                          label={t.block}
                          value={
                            <a
                              href={`https://polygonscan.com/block/${result.blockNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              #{result.blockNumber.toLocaleString()}
                            </a>
                          }
                          mono
                        />
                      )}
                      <Row
                        label={t.chain}
                        value={
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            {t.polygon} (Chain ID: {result.chainId || 137})
                          </span>
                        }
                      />
                      {result.anchoredAt && <Row label={t.anchored} value={formatDate(result.anchoredAt)} />}
                      {explorerUrl && (
                        <div className="pt-4 border-t border-border/40">
                          <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {t.viewExplorer}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        )}

        <div className="text-center mt-12 text-sm text-muted-foreground">
          {t.poweredBy}{' '}
          <Link to="/" className="text-primary hover:underline font-medium">
            TRVE_
          </Link>{' '}
          — Immutable Asset Registry on Polygon
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="text-muted-foreground min-w-[140px]">{label}</span>
      <span className={`text-foreground break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
