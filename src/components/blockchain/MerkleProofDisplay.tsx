import { useState } from 'react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

interface MerkleProofDisplayProps {
  recordHash: string;
  merkleRoot: string;
  merkleProof: string[];
  batchId: number;
  className?: string;
}

const POLYGON_EXPLORER = 'https://amoy.polygonscan.com';

export function MerkleProofDisplay({
  recordHash,
  merkleRoot,
  merkleProof,
  batchId,
  className = '',
}: MerkleProofDisplayProps) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateHash = (hash: string, length = 12) => {
    if (hash.length <= length * 2) return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  };

  const HashDisplay = ({ label, hash, field }: { label: string; hash: string; field: string }) => (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-muted px-2 py-1 rounded text-xs font-mono break-all">
          {hash}
        </code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(hash, field)}
          className="shrink-0"
        >
          {copied === field ? (
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {language === 'pl' ? 'Dowód Merkle' : 'Merkle Proof'}
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded
            ? language === 'pl'
              ? 'Zwiń'
              : 'Collapse'
            : language === 'pl'
            ? 'Rozwiń'
            : 'Expand'}
          <svg
            className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <div className="text-muted-foreground text-xs">
            {language === 'pl' ? 'Hash rekordu' : 'Record Hash'}
          </div>
          <code className="font-mono text-xs">{truncateHash(recordHash)}</code>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {language === 'pl' ? 'Merkle Root' : 'Merkle Root'}
          </div>
          <code className="font-mono text-xs">{truncateHash(merkleRoot)}</code>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Batch ID</div>
          <span className="font-mono">#{batchId}</span>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {language === 'pl' ? 'Głębokość dowodu' : 'Proof Depth'}
          </div>
          <span>{merkleProof.length} {language === 'pl' ? 'poziomów' : 'levels'}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="space-y-4 pt-4 border-t border-border">
          <HashDisplay
            label={language === 'pl' ? 'Pełny hash rekordu' : 'Full Record Hash'}
            hash={recordHash}
            field="recordHash"
          />

          <HashDisplay
            label={language === 'pl' ? 'Pełny Merkle Root' : 'Full Merkle Root'}
            hash={merkleRoot}
            field="merkleRoot"
          />

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {language === 'pl' ? 'Ścieżka dowodu' : 'Proof Path'}
            </div>
            <div className="bg-muted rounded p-2 max-h-48 overflow-y-auto">
              {merkleProof.map((hash, index) => (
                <div key={index} className="flex items-center gap-2 py-1 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground w-8">#{index + 1}</span>
                  <code className="text-xs font-mono break-all">{hash}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Verification explanation */}
          <div className="bg-muted/50 rounded p-3 text-xs text-muted-foreground">
            <div className="font-medium mb-1">
              {language === 'pl' ? 'Jak weryfikować?' : 'How to verify?'}
            </div>
            <p>
              {language === 'pl'
                ? 'Ten dowód pozwala udowodnić, że hash rekordu był częścią batcha zakotwiczonego na blockchain, bez ujawniania innych danych. Możesz zweryfikować hash łącząc go z kolejnymi elementami ścieżki dowodu aż do uzyskania Merkle Root.'
                : 'This proof allows you to verify that the record hash was part of the batch anchored on blockchain, without revealing other data. You can verify by combining the hash with each proof element until you reach the Merkle Root.'}
            </p>
          </div>

          {/* Copy all button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              copyToClipboard(
                JSON.stringify({ recordHash, merkleRoot, merkleProof, batchId }, null, 2),
                'all'
              )
            }
          >
            {copied === 'all'
              ? language === 'pl'
                ? '✓ Skopiowano!'
                : '✓ Copied!'
              : language === 'pl'
              ? 'Kopiuj pełny dowód (JSON)'
              : 'Copy full proof (JSON)'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default MerkleProofDisplay;
