import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

interface VerificationBadgeProps {
  status: 'verified' | 'pending' | 'unverified' | 'failed';
  txHash?: string;
  anchoredAt?: string;
  batchId?: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const POLYGON_EXPLORER = 'https://amoy.polygonscan.com';

export function VerificationBadge({
  status,
  txHash,
  anchoredAt,
  batchId,
  showDetails = false,
  size = 'md',
  className = '',
}: VerificationBadgeProps) {
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    verified: {
      variant: 'success' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: language === 'pl' ? 'Zweryfikowany' : 'Verified',
      tooltip: language === 'pl' ? 'Zakotwiczony na blockchain' : 'Anchored on blockchain',
    },
    pending: {
      variant: 'warning' as const,
      icon: (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      label: language === 'pl' ? 'Oczekuje' : 'Pending',
      tooltip: language === 'pl' ? 'Oczekuje na zakotwiczenie' : 'Awaiting anchoring',
    },
    unverified: {
      variant: 'secondary' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: language === 'pl' ? 'Niezweryfikowany' : 'Unverified',
      tooltip: language === 'pl' ? 'Jeszcze nie zakotwiczony' : 'Not yet anchored',
    },
    failed: {
      variant: 'destructive' as const,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      label: language === 'pl' ? 'Błąd' : 'Failed',
      tooltip: language === 'pl' ? 'Zakotwiczenie nie powiodło się' : 'Anchoring failed',
    },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Badge
        variant={config.variant}
        className={`flex items-center gap-1.5 ${sizeClasses[size]} cursor-help`}
      >
        {config.icon}
        <span>{config.label}</span>
      </Badge>

      {/* Tooltip/Details popup */}
      {(isHovered || showDetails) && (
        <div className="absolute z-50 mt-2 p-3 bg-popover border border-border rounded-lg shadow-lg min-w-[250px] text-sm">
          <div className="font-medium mb-2">{config.tooltip}</div>

          {status === 'verified' && (
            <div className="space-y-2 text-muted-foreground">
              {anchoredAt && (
                <div className="flex justify-between">
                  <span>{language === 'pl' ? 'Data:' : 'Date:'}</span>
                  <span className="font-mono text-foreground">{formatDate(anchoredAt)}</span>
                </div>
              )}
              {batchId !== undefined && (
                <div className="flex justify-between">
                  <span>Batch ID:</span>
                  <span className="font-mono text-foreground">#{batchId}</span>
                </div>
              )}
              {txHash && (
                <div className="pt-2 border-t border-border">
                  <div className="text-xs mb-1">{language === 'pl' ? 'Transakcja:' : 'Transaction:'}</div>
                  <a
                    href={`${POLYGON_EXPLORER}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {truncateHash(txHash)}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          )}

          {status === 'pending' && (
            <div className="text-xs text-muted-foreground">
              {language === 'pl'
                ? 'Ten zasób zostanie zakotwiczony w następnym batchu (zwykle w ciągu 24h).'
                : 'This asset will be anchored in the next batch (usually within 24h).'}
            </div>
          )}

          {status === 'failed' && (
            <div className="text-xs text-destructive">
              {language === 'pl'
                ? 'Zakotwiczenie nie powiodło się. Zostanie ponowione automatycznie.'
                : 'Anchoring failed. Will be retried automatically.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VerificationBadge;
