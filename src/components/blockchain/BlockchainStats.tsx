import { useLanguage } from '../../context/LanguageContext';

interface BlockchainStatsProps {
  totalBatches: number;
  totalRecords: number;
  lastAnchoredAt?: string;
  isConnected: boolean;
  networkName?: string;
  contractAddress?: string;
  className?: string;
}

const POLYGON_EXPLORER = 'https://amoy.polygonscan.com';

export function BlockchainStats({
  totalBatches,
  totalRecords,
  lastAnchoredAt,
  isConnected,
  networkName = 'Polygon Amoy',
  contractAddress,
  className = '',
}: BlockchainStatsProps) {
  const { language } = useLanguage();

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

  const formatNumber = (num: number) => {
    return num.toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header with connection status */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h3 className="font-semibold">
            {language === 'pl' ? 'Status Blockchain' : 'Blockchain Status'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected
              ? language === 'pl'
                ? 'Połączony'
                : 'Connected'
              : language === 'pl'
              ? 'Rozłączony'
              : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{formatNumber(totalBatches)}</div>
          <div className="text-xs text-muted-foreground">
            {language === 'pl' ? 'Batche' : 'Batches'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{formatNumber(totalRecords)}</div>
          <div className="text-xs text-muted-foreground">
            {language === 'pl' ? 'Rekordy' : 'Records'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">{networkName}</div>
          <div className="text-xs text-muted-foreground">
            {language === 'pl' ? 'Sieć' : 'Network'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">
            {lastAnchoredAt ? formatDate(lastAnchoredAt) : '—'}
          </div>
          <div className="text-xs text-muted-foreground">
            {language === 'pl' ? 'Ostatnie zakotwiczenie' : 'Last Anchoring'}
          </div>
        </div>
      </div>

      {/* Contract address */}
      {contractAddress && (
        <div className="px-4 pb-4">
          <div className="bg-muted/50 rounded p-2 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">
                {language === 'pl' ? 'Adres kontraktu' : 'Contract Address'}
              </div>
              <a
                href={`${POLYGON_EXPLORER}/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-primary hover:underline flex items-center gap-1"
              >
                {truncateAddress(contractAddress)}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs text-green-600">
                {language === 'pl' ? 'Zweryfikowany' : 'Verified'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlockchainStats;
