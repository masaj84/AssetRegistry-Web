import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AdminAssetDetail, VerificationResponse } from '../../types/admin';

const statusVariants: Record<string, 'default' | 'success' | 'warning'> = {
  DRAFT: 'default',
  VERIFIED: 'warning',
  MINTED: 'success',
};

export function AdminAssetDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<AdminAssetDetail | null>(null);
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;

      try {
        const assetData = await adminService.getAssetById(parseInt(id));
        setAsset(assetData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const handleVerifyOnChain = async () => {
    if (!id) return;
    setIsVerifying(true);
    try {
      const result = await adminService.verifyAsset(parseInt(id));
      setVerification(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t('admin.loading')}
        </div>
      </div>
    );
  }

  if (error && !asset) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-500">{error}</p>
          <Link to="/app/admin/assets">
            <Button className="mt-4" variant="secondary">Back to Assets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/app/admin/assets" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-light">Asset Details</h1>
          </div>
          <p className="text-muted-foreground">{asset?.name || `Asset #${asset?.id}`}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariants[asset?.status || 'DRAFT']}>
            {asset?.status}
          </Badge>
          {asset?.tokenId && (
            <Badge variant="success">Token #{asset.tokenId}</Badge>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Basic Information
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">ID</dt>
              <dd className="font-mono">{asset?.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="capitalize">{asset?.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd>{asset?.status}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Favorite</dt>
              <dd>{asset?.isFavorite ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Created</dt>
              <dd>{asset?.createdAt ? new Date(asset.createdAt).toLocaleString() : '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Updated</dt>
              <dd>{asset?.updatedAt ? new Date(asset.updatedAt).toLocaleString() : '-'}</dd>
            </div>
          </dl>
        </div>

        {/* Owner Info */}
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Owner Information
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Username</dt>
              <dd>
                {asset?.ownerId ? (
                  <Link to={`/app/admin/users/${asset.ownerId}`} className="text-primary hover:underline">
                    {asset.ownerUsername || 'View User'}
                  </Link>
                ) : '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{asset?.ownerEmail || '-'}</dd>
            </div>
            <div className="flex justify-between items-start">
              <dt className="text-muted-foreground">Wallet</dt>
              <dd className="font-mono text-xs break-all max-w-[200px] text-right">{asset?.ownerAddress || '-'}</dd>
            </div>
            {asset?.organizationId && (
              <>
                <div className="border-t border-border pt-3 mt-3" />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Organization</dt>
                  <dd>
                    <Link to={`/app/admin/organizations/${asset.organizationId}`} className="text-primary hover:underline">
                      {asset.organizationName || 'View Org'}
                    </Link>
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Blockchain Info */}
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            Blockchain Data
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Token ID</dt>
              <dd className="font-mono">{asset?.tokenId || 'Not minted'}</dd>
            </div>
            <div className="flex justify-between items-start">
              <dt className="text-muted-foreground">Record Hash</dt>
              <dd className="font-mono text-xs break-all max-w-[200px] text-right">
                {asset?.recordHash || 'Not hashed'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Merkle Batch</dt>
              <dd>
                {asset?.merkleBatchId ? (
                  <Link to={`/app/admin/blockchain?batch=${asset.merkleBatchId}`} className="text-primary hover:underline">
                    Batch #{asset.merkleBatchId}
                  </Link>
                ) : 'Not anchored'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Anchored At</dt>
              <dd>{asset?.anchoredAt ? new Date(asset.anchoredAt).toLocaleString() : '-'}</dd>
            </div>
          </dl>

          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleVerifyOnChain}
              disabled={isVerifying || !asset?.recordHash}
              className="w-full"
            >
              {isVerifying ? 'Verifying...' : 'Verify On-Chain'}
            </Button>
          </div>
        </div>

        {/* Verification Result */}
        {verification && (
          <div className={`border p-6 ${verification.isVerified ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              {verification.isVerified ? (
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Verification Result
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className={verification.isVerified ? 'text-emerald-500' : 'text-red-500'}>
                  {verification.isVerified ? 'Verified' : 'Not Verified'}
                </dd>
              </div>
              {verification.transactionHash && (
                <div className="flex justify-between items-start">
                  <dt className="text-muted-foreground">TX Hash</dt>
                  <dd className="font-mono text-xs break-all max-w-[200px] text-right">
                    <a
                      href={`https://amoy.polygonscan.com/tx/${verification.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {verification.transactionHash.slice(0, 10)}...{verification.transactionHash.slice(-8)}
                    </a>
                  </dd>
                </div>
              )}
              {verification.blockNumber && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Block</dt>
                  <dd className="font-mono">#{verification.blockNumber}</dd>
                </div>
              )}
              {verification.error && (
                <div className="text-red-500 text-xs mt-2">{verification.error}</div>
              )}
            </dl>
          </div>
        )}
      </div>

      {/* Metadata */}
      {asset?.metadata && Object.keys(asset.metadata).length > 0 && (
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            Metadata
          </h3>
          <pre className="bg-foreground/5 p-4 rounded text-xs font-mono overflow-x-auto">
            {JSON.stringify(asset.metadata, null, 2)}
          </pre>
        </div>
      )}

      {/* Merkle Proof */}
      {asset?.merkleProof && (
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Merkle Proof
          </h3>
          <pre className="bg-foreground/5 p-4 rounded text-xs font-mono overflow-x-auto">
            {typeof asset.merkleProof === 'string' ? asset.merkleProof : JSON.stringify(asset.merkleProof, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
