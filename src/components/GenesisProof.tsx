import { useLanguage } from '../context/LanguageContext';
import { blockchainConfig } from '../lib/blockchainConfig';

/**
 * Genesis Proof Component
 * 
 * Displays the first anchored document as proof the system works.
 * 
 * TODO: After first production anchoring, update these values:
 * 1. Deploy contract to Polygon
 * 2. Add first document via admin panel
 * 3. Wait for anchoring
 * 4. Copy txHash, documentHash, date below
 */

// =============================================================================
// HARDCODED VALUES - UPDATE AFTER FIRST PRODUCTION ANCHORING
// =============================================================================
const GENESIS_PROOF = {
  enabled: true,
  documentName: 'TRVE Genesis Document',
  documentHash: '0xad88104798a999c3ab26d90d2bc68e83b25d14f512678e18843de0ce9ab03a44',
  txHash: '0x4a2ce5d98003144a6d6d93662f302a513296889d05af6fcd6366e1817ac9257b',
  anchoredAt: '2026-02-23',
  blockNumber: 83346345,
};
// =============================================================================

export function GenesisProof() {
  const { language } = useLanguage();
  
  // Don't render if not enabled yet
  if (!GENESIS_PROOF.enabled) {
    return null;
  }

  const explorerUrl = `${blockchainConfig.explorerUrl}/tx/${GENESIS_PROOF.txHash}`;

  const t = {
    title: language === 'pl' ? 'Pierwszy Dowód' : 'Genesis Proof',
    subtitle: language === 'pl' 
      ? 'Nasz pierwszy dokument zakotwiczony na blockchainie'
      : 'Our first document anchored on blockchain',
    document: language === 'pl' ? 'Dokument' : 'Document',
    hash: language === 'pl' ? 'Hash dokumentu' : 'Document Hash',
    tx: language === 'pl' ? 'Transakcja' : 'Transaction',
    date: language === 'pl' ? 'Data zakotwiczenia' : 'Anchored On',
    verify: language === 'pl' ? 'Zweryfikuj na Polygonscan' : 'Verify on Polygonscan',
  };

  return (
    <section className="py-24 px-6 border-t border-border relative" id="genesis-proof">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-orange/5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r to-purple/30 max-w-24" />
            <h2 className="text-sm font-medium tracking-widest uppercase text-purple-light/80">
              {t.title}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange/30 max-w-24" />
          </div>
          <p className="text-2xl md:text-3xl font-light text-foreground/90">
            {t.subtitle}
          </p>
        </div>

        {/* Proof Card */}
        <div className="border border-purple/30 bg-background/80 backdrop-blur-sm p-8 md:p-12 relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple/50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange/50" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple/50" />

          {/* Content */}
          <div className="space-y-6">
            {/* Document Name */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.document}</p>
              <p className="text-xl font-medium">{GENESIS_PROOF.documentName}</p>
            </div>

            {/* Document Hash */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.hash}</p>
              <p className="font-mono text-sm break-all text-orange-light">
                {GENESIS_PROOF.documentHash}
              </p>
            </div>

            {/* Transaction */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.tx}</p>
              <p className="font-mono text-sm break-all text-purple-light">
                {GENESIS_PROOF.txHash}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.date}</p>
              <p className="text-lg">{GENESIS_PROOF.anchoredAt}</p>
            </div>

            {/* Verify Button */}
            <div className="pt-4">
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-purple/50 hover:border-purple hover:bg-purple/10 transition-all duration-300 text-purple-light"
              >
                <span>{t.verify}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Blockchain icon watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-5">
            <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v6.86l-7-3.5V8.82zm9 10.36V12.32l7-3.5v6.86l-7 3.5z"/>
            </svg>
          </div>
        </div>

        {/* Network badge */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple/10 border border-purple/30 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-muted-foreground">
              {blockchainConfig.chainName} • Block #{GENESIS_PROOF.blockNumber}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
