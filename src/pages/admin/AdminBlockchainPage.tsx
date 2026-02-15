import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AnchoringStats, BlockchainHealth, BatchInfoResponse, VerificationResponse, AnchoringActivity } from '../../types/admin';
import { blockchainConfig } from '../../lib/blockchainConfig';

export function AdminBlockchainPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState<AnchoringStats | null>(null);
  const [health, setHealth] = useState<BlockchainHealth | null>(null);
  const [batchInfo, setBatchInfo] = useState<BatchInfoResponse | null>(null);
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Search states
  const [batchIdInput, setBatchIdInput] = useState(searchParams.get('batch') || '');
  const [hashInput, setHashInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [anchoringResult, setAnchoringResult] = useState<string | null>(null);
  const [activity, setActivity] = useState<AnchoringActivity | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, healthData, activityData] = await Promise.all([
          adminService.getAnchoringStats(),
          adminService.getBlockchainHealth(),
          adminService.getAnchoringActivity(),
        ]);
        setStats(statsData);
        setHealth(healthData);
        setActivity(activityData);

        // If batch param in URL, fetch that batch
        const batchParam = searchParams.get('batch');
        if (batchParam) {
          const batch = await adminService.getBatchInfo(parseInt(batchParam));
          setBatchInfo(batch);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleSearchBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchIdInput) return;

    setIsSearching(true);
    setBatchInfo(null);
    setVerification(null);
    try {
      const batch = await adminService.getBatchInfo(parseInt(batchIdInput));
      setBatchInfo(batch);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerifyHash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashInput) return;

    setIsSearching(true);
    setVerification(null);
    setBatchInfo(null);
    try {
      const result = await adminService.verifyHash(hashInput);
      setVerification(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSearching(false);
    }
  };

  const handleTriggerAnchoring = async () => {
    setIsAnchoring(true);
    setAnchoringResult(null);
    setError('');
    try {
      const result = await adminService.triggerAnchoring();
      if (result.triggered) {
        setAnchoringResult(`Batch #${result.batchId} anchored (${result.recordCount} records). TX: ${result.transactionHash?.slice(0, 18)}...`);
        // Refresh stats + activity
        const [statsData, healthData, activityData] = await Promise.all([
          adminService.getAnchoringStats(),
          adminService.getBlockchainHealth(),
          adminService.getAnchoringActivity(),
        ]);
        setStats(statsData);
        setHealth(healthData);
        setActivity(activityData);
      } else {
        setAnchoringResult(result.message);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsAnchoring(false);
    }
  };

  const handleRetryFailed = async () => {
    setIsAnchoring(true);
    setAnchoringResult(null);
    setError('');
    try {
      const result = await adminService.retryFailedBatches();
      setAnchoringResult(result.message);
      const [statsData, healthData, activityData] = await Promise.all([
        adminService.getAnchoringStats(),
        adminService.getBlockchainHealth(),
        adminService.getAnchoringActivity(),
      ]);
      setStats(statsData);
      setHealth(healthData);
      setActivity(activityData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsAnchoring(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light mb-1">Blockchain Monitor</h1>
          <p className="text-muted-foreground">Anchoring stats, batch verification, and on-chain data</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTriggerAnchoring}
            disabled={isAnchoring || health?.blockchain !== 'connected'}
          >
            {isAnchoring ? 'Anchoring...' : 'Trigger Anchoring'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRetryFailed}
            disabled={isAnchoring || health?.blockchain !== 'connected' || (stats?.failedBatches ?? 0) === 0}
          >
            {isAnchoring ? 'Retrying...' : `Retry Failed (${stats?.failedBatches ?? 0})`}
          </Button>
          <Badge variant={health?.status === 'healthy' ? 'success' : 'destructive'}>
            {health?.status === 'healthy' ? 'System Healthy' : 'System Unhealthy'}
          </Badge>
          <Badge variant={health?.blockchain === 'connected' ? 'success' : 'destructive'}>
            {health?.blockchain === 'connected' ? 'Blockchain Connected' : 'Blockchain Disconnected'}
          </Badge>
        </div>
      </div>

      {anchoringResult && (
        <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-sm">
          {anchoringResult}
          <button onClick={() => setAnchoringResult(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Batches</p>
          <p className="text-4xl font-light">{stats?.totalBatches || 0}</p>
        </div>
        <div className="border border-emerald-500/30 bg-emerald-500/5 p-6">
          <p className="text-sm text-muted-foreground mb-1">Anchored</p>
          <p className="text-4xl font-light text-emerald-500">{stats?.anchoredBatches || 0}</p>
        </div>
        <div className="border border-amber-500/30 bg-amber-500/5 p-6">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-4xl font-light text-amber-500">{stats?.pendingBatches || 0}</p>
        </div>
        <div className="border border-red-500/30 bg-red-500/5 p-6">
          <p className="text-sm text-muted-foreground mb-1">Failed</p>
          <p className="text-4xl font-light text-red-500">{stats?.failedBatches || 0}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">Records Anchored</p>
          <p className="text-4xl font-light">{stats?.totalRecordsAnchored || 0}</p>
        </div>
      </div>

      {/* Network Info */}
      <div className="border border-border p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          Network Information
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Network</p>
            <p className="font-medium">{blockchainConfig.chainName}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Chain ID</p>
            <p className="font-mono">{blockchainConfig.chainId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Explorer</p>
            <a href={blockchainConfig.explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {blockchainConfig.explorerUrl.replace('https://', '')}
            </a>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">On-Chain Records</p>
            <p className="font-medium">{stats?.blockchain?.totalRecords || 0}</p>
          </div>
        </div>
      </div>

      {/* Search Tools */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Search by Batch ID */}
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Search Batch
          </h3>
          <form onSubmit={handleSearchBatch} className="flex gap-2">
            <Input
              placeholder="Batch ID (e.g., 1, 2, 3...)"
              value={batchIdInput}
              onChange={(e) => setBatchIdInput(e.target.value)}
              type="number"
              min="1"
              className="flex-1"
            />
            <Button type="submit" variant="secondary" disabled={isSearching || !batchIdInput}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* Verify by Hash */}
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Verify Record Hash
          </h3>
          <form onSubmit={handleVerifyHash} className="flex gap-2">
            <Input
              placeholder="Record hash (0x...)"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="flex-1 font-mono text-xs"
            />
            <Button type="submit" variant="secondary" disabled={isSearching || !hashInput}>
              {isSearching ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </div>
      </div>

      {/* Batch Info Result */}
      {batchInfo && (
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            Batch #{batchInfo.batchId}
            <Badge
              variant={
                batchInfo.status === 'Anchored' ? 'success' :
                batchInfo.status === 'Pending' ? 'warning' : 'destructive'
              }
              className="ml-2"
            >
              {batchInfo.status}
            </Badge>
          </h3>

          <div className="grid lg:grid-cols-2 gap-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Records</dt>
                <dd className="font-medium">{batchInfo.recordCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date(batchInfo.createdAt).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Anchored</dt>
                <dd>{batchInfo.anchoredAt ? new Date(batchInfo.anchoredAt).toLocaleString() : '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Chain ID</dt>
                <dd className="font-mono">{batchInfo.chainId || '-'}</dd>
              </div>
            </dl>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground mb-1">Merkle Root</dt>
                <dd className="font-mono text-xs break-all bg-foreground/5 p-2 rounded">
                  {batchInfo.merkleRoot}
                </dd>
              </div>
              {batchInfo.transactionHash && (
                <div>
                  <dt className="text-muted-foreground mb-1">Transaction</dt>
                  <dd>
                    <a
                      href={`${blockchainConfig.explorerUrl}/tx/${batchInfo.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-primary hover:underline break-all"
                    >
                      {batchInfo.transactionHash}
                    </a>
                  </dd>
                </div>
              )}
              {batchInfo.blockNumber && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Block Number</dt>
                  <dd>
                    <a
                      href={`${blockchainConfig.explorerUrl}/block/${batchInfo.blockNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-primary hover:underline"
                    >
                      #{batchInfo.blockNumber}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

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
            Hash Verification Result
          </h3>

          <div className="grid lg:grid-cols-2 gap-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className={`font-medium ${verification.isVerified ? 'text-emerald-500' : 'text-red-500'}`}>
                  {verification.isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Batch ID</dt>
                <dd>
                  {verification.batchId ? (
                    <button
                      onClick={() => setBatchIdInput(String(verification.batchId))}
                      className="text-primary hover:underline"
                    >
                      #{verification.batchId}
                    </button>
                  ) : '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Blockchain Verified</dt>
                <dd>{verification.blockchainVerified ? 'Yes' : 'No'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Anchored At</dt>
                <dd>{verification.anchoredAt ? new Date(verification.anchoredAt).toLocaleString() : '-'}</dd>
              </div>
            </dl>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground mb-1">Record Hash</dt>
                <dd className="font-mono text-xs break-all bg-foreground/5 p-2 rounded">
                  {verification.recordHash}
                </dd>
              </div>
              {verification.merkleRoot && (
                <div>
                  <dt className="text-muted-foreground mb-1">Merkle Root</dt>
                  <dd className="font-mono text-xs break-all bg-foreground/5 p-2 rounded">
                    {verification.merkleRoot}
                  </dd>
                </div>
              )}
              {verification.transactionHash && (
                <div>
                  <dt className="text-muted-foreground mb-1">Transaction</dt>
                  <dd>
                    <a
                      href={`${blockchainConfig.explorerUrl}/tx/${verification.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      View on Explorer
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {verification.error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-sm">
              {verification.error}
            </div>
          )}
        </div>
      )}

      {/* Activity Log */}
      {activity && (
        <div className="border border-border p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activity Log
            {activity.unanchoredAssetCount > 0 && (
              <Badge variant="warning">{activity.unanchoredAssetCount} awaiting anchoring</Badge>
            )}
          </h3>

          {/* Batches table */}
          {activity.batches.length > 0 && (
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">Batch</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Records</th>
                    <th className="pb-2 pr-4">Created</th>
                    <th className="pb-2 pr-4">TX Hash</th>
                    <th className="pb-2 pr-4">Retries</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.batches.map(batch => (
                    <tr key={batch.id} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-mono">#{batch.id}</td>
                      <td className="py-2 pr-4">
                        <Badge
                          variant={
                            batch.status === 'Anchored' ? 'success' :
                            batch.status === 'Failed' ? 'destructive' : 'warning'
                          }
                        >
                          {batch.status}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4">{batch.recordCount}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {new Date(batch.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs">
                        {batch.transactionHash ? (
                          <a
                            href={`${blockchainConfig.explorerUrl}/tx/${batch.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {batch.transactionHash.slice(0, 10)}...{batch.transactionHash.slice(-6)}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="py-2 pr-4">{batch.retryCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Errors */}
          {activity.recentErrors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-500 mb-2">Recent Errors</h4>
              <div className="space-y-2">
                {activity.recentErrors.map(err => (
                  <div key={err.id} className="p-3 border border-red-500/20 bg-red-500/5 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        Batch #{err.batchId} &middot; Attempt {err.retryAttempt} &middot; {err.errorType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(err.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-red-500 text-xs break-all">{err.errorMessage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activity.batches.length === 0 && activity.recentErrors.length === 0 && (
            <p className="text-muted-foreground text-sm">No anchoring activity yet.</p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="border border-border p-6">
        <h3 className="font-medium mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={blockchainConfig.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-foreground transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            {blockchainConfig.chainName} Explorer
          </a>
          <Link
            to="/app/admin/assets"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-foreground transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            View All Assets
          </Link>
          <Link
            to="/app/admin/audit"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-foreground transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Audit Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
