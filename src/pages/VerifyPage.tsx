import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
}

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
  const { language } = useLanguage();
  const { theme } = useTheme();

  const t = language === 'pl' ? {
    title: 'Weryfikacja On-Chain',
    subtitle: 'Sprawdź czy dokument jest zarejestrowany na blockchainie',
    placeholder: 'Wklej hash rekordu (0x...)',
    verify: 'Weryfikuj',
    verified: 'Zweryfikowany ✓',
    notFound: 'Nie znaleziono',
    recordHash: 'Hash rekordu',
    txHash: 'Transakcja',
    block: 'Blok',
    anchored: 'Zakotwiczony',
    chain: 'Sieć',
    polygon: 'Polygon Mainnet',
    viewExplorer: 'Zobacz na Polygonscan',
    shareLink: 'Kopiuj link weryfikacyjny',
    linkCopied: 'Skopiowano!',
    blockchainProof: 'Dowód blockchain',
    blockchainVerified: 'Potwierdzone on-chain',
    blockchainPending: 'Oczekuje na potwierdzenie',
    poweredBy: 'Powered by',
    searchAnother: 'Sprawdź inny',
    backHome: '← Strona główna',
  } : {
    title: 'On-Chain Verification',
    subtitle: 'Verify that a document is registered on the blockchain',
    placeholder: 'Paste record hash (0x...)',
    verify: 'Verify',
    verified: 'Verified ✓',
    notFound: 'Not Found',
    recordHash: 'Record Hash',
    txHash: 'Transaction',
    block: 'Block',
    anchored: 'Anchored',
    chain: 'Network',
    polygon: 'Polygon Mainnet',
    viewExplorer: 'View on Polygonscan',
    shareLink: 'Copy verification link',
    linkCopied: 'Copied!',
    blockchainProof: 'Blockchain Proof',
    blockchainVerified: 'Verified on-chain',
    blockchainPending: 'Pending confirmation',
    poweredBy: 'Powered by',
    searchAnother: 'Check another',
    backHome: '← Home',
  };

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

    try {
      const res = await axios.get(`${API_BASE_URL}/api/verification/hash/${encodeURIComponent(h)}`);
      setResult(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setResult({ isVerified: false, status: 'Record not found', recordHash: h });
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || 'Invalid hash format');
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
    // Update URL without reload
    window.history.replaceState(null, '', `/verify/${encodeURIComponent(inputHash.trim())}`);
  }

  function copyShareLink() {
    const url = `${window.location.origin}/verify/${result?.recordHash || inputHash}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });
  }

  function truncateHash(h: string, chars = 10) {
    if (!h || h.length <= chars * 2 + 2) return h;
    return `${h.slice(0, chars + 2)}...${h.slice(-chars)}`;
  }

  const explorerUrl = result?.transactionHash
    ? `https://polygonscan.com/tx/${result.transactionHash}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xl font-bold text-foreground">TRVE</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.backHome}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Search Form */}
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

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center mb-8">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-xl border-2 overflow-hidden ${
            result.isVerified
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-red-500/50 bg-red-500/5'
          }`}>
            {/* Status Banner */}
            <div className={`px-6 py-4 flex items-center justify-between ${
              result.isVerified
                ? 'bg-green-500/10'
                : 'bg-red-500/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  result.isVerified ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-2xl">{result.isVerified ? '✅' : '❌'}</span>
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${
                    result.isVerified ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.isVerified ? t.verified : t.notFound}
                  </h2>
                  {result.isVerified && result.blockchainVerified && (
                    <p className="text-sm text-green-400/70">{t.blockchainVerified}</p>
                  )}
                </div>
              </div>

              {result.isVerified && (
                <button
                  onClick={copyShareLink}
                  className="px-4 py-2 text-sm border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors"
                >
                  {copied ? t.linkCopied : t.shareLink}
                </button>
              )}
            </div>

            {/* Details */}
            {result.isVerified && (
              <div className="px-6 py-6 space-y-4">
                {/* Record Hash */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-sm text-muted-foreground min-w-[140px]">{t.recordHash}</span>
                  <code className="text-sm text-foreground font-mono break-all">
                    {result.recordHash}
                  </code>
                </div>

                {/* TX Hash */}
                {result.transactionHash && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-muted-foreground min-w-[140px]">{t.txHash}</span>
                    <code className="text-sm text-foreground font-mono">
                      {explorerUrl ? (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
                          className="text-primary hover:underline">
                          {truncateHash(result.transactionHash, 12)}
                          <span className="ml-1">↗</span>
                        </a>
                      ) : truncateHash(result.transactionHash, 12)}
                    </code>
                  </div>
                )}

                {/* Block */}
                {result.blockNumber && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-muted-foreground min-w-[140px]">{t.block}</span>
                    <span className="text-sm text-foreground font-mono">
                      <a href={`https://polygonscan.com/block/${result.blockNumber}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-primary hover:underline">
                        #{result.blockNumber.toLocaleString()}
                      </a>
                    </span>
                  </div>
                )}

                {/* Network */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-sm text-muted-foreground min-w-[140px]">{t.chain}</span>
                  <span className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {t.polygon} (Chain ID: {result.chainId || 137})
                  </span>
                </div>

                {/* Anchored At */}
                {result.anchoredAt && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-muted-foreground min-w-[140px]">{t.anchored}</span>
                    <span className="text-sm text-foreground">
                      {formatDate(result.anchoredAt)}
                    </span>
                  </div>
                )}

                {/* Explorer Link */}
                {explorerUrl && (
                  <div className="pt-4 border-t border-border/40">
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {t.viewExplorer}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Not found details */}
            {!result.isVerified && (
              <div className="px-6 py-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {language === 'pl'
                    ? 'Ten hash nie został znaleziony w rejestrze TRVE. Sprawdź poprawność hasha i spróbuj ponownie.'
                    : 'This hash was not found in the TRVE registry. Check the hash and try again.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          {t.poweredBy} <Link to="/" className="text-primary hover:underline font-medium">TRVE</Link>
          {' '}— Immutable Asset Registry on Polygon
        </div>
      </main>
    </div>
  );
}
