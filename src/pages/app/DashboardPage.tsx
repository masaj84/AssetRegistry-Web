import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { assetsService } from '../../services/assetsService';
import { getErrorMessage } from '../../services/authService';
import type { Asset } from '../../types';

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  VERIFIED: 'Verified',
  MINTED: 'Minted',
};

const statusVariants: Record<string, 'default' | 'success' | 'warning'> = {
  DRAFT: 'default',
  VERIFIED: 'warning',
  MINTED: 'success',
};

export function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await assetsService.getAll();
        setAssets(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const stats = {
    total: assets.length,
    draft: assets.filter((a) => a.status === 'DRAFT').length,
    verified: assets.filter((a) => a.status === 'VERIFIED').length,
    minted: assets.filter((a) => a.status === 'MINTED').length,
  };

  const assetsByType = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentAssets = [...assets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your product registry</p>
        </div>
        <Link to="/app/assets/new">
          <Button className="h-11">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add Asset
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="border border-border p-6 relative group hover:border-foreground transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
          <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
          <p className="text-4xl font-light">{stats.total}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            All registered items
          </div>
        </div>

        {/* Draft */}
        <div className="border border-border p-6 group hover:border-foreground transition-colors">
          <p className="text-sm text-muted-foreground mb-1">Draft</p>
          <p className="text-4xl font-light text-muted-foreground">{stats.draft}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
            Awaiting completion
          </div>
        </div>

        {/* Verified */}
        <div className="border border-border p-6 group hover:border-foreground transition-colors">
          <p className="text-sm text-muted-foreground mb-1">Verified</p>
          <p className="text-4xl font-light text-amber-500">{stats.verified}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            Ready to mint
          </div>
        </div>

        {/* Minted */}
        <div className="border border-border p-6 group hover:border-foreground transition-colors">
          <p className="text-sm text-muted-foreground mb-1">Minted</p>
          <p className="text-4xl font-light text-emerald-500">{stats.minted}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            On blockchain
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assets by Type */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-medium">Assets by Type</h2>
            <span className="text-xs text-muted-foreground">{Object.keys(assetsByType).length} types</span>
          </div>
          <div className="p-6">
            {Object.keys(assetsByType).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">No assets yet</p>
                <Link to="/app/assets/new" className="text-sm text-foreground hover:underline mt-2 inline-block">
                  Add your first asset →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(assetsByType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => {
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={type} className="group">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="capitalize font-medium">{type}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-1 bg-border overflow-hidden">
                          <div
                            className="h-full bg-foreground transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Assets */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-medium">Recent Assets</h2>
            <Link to="/app/assets" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentAssets.length === 0 ? (
              <div className="text-center py-8 px-6">
                <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">No recent activity</p>
              </div>
            ) : (
              recentAssets.map((asset) => (
                <Link
                  key={asset.id}
                  to={`/app/assets/${asset.id}`}
                  className="flex items-center justify-between p-4 hover:bg-foreground/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground group-hover:border-foreground group-hover:text-foreground transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{asset.metadata.name || `Asset #${asset.id}`}</p>
                      <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariants[asset.status]}>
                    {statusLabels[asset.status]}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium">Asset Pipeline</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            {/* Draft */}
            <div className="flex-1 text-center">
              <div className="border border-border p-6 mb-3">
                <p className="text-3xl font-light text-muted-foreground">{stats.draft}</p>
              </div>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>

            {/* Arrow */}
            <svg className="w-6 h-6 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>

            {/* Verified */}
            <div className="flex-1 text-center">
              <div className="border border-amber-500/30 bg-amber-500/5 p-6 mb-3">
                <p className="text-3xl font-light text-amber-500">{stats.verified}</p>
              </div>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>

            {/* Arrow */}
            <svg className="w-6 h-6 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>

            {/* Minted */}
            <div className="flex-1 text-center">
              <div className="border border-emerald-500/30 bg-emerald-500/5 p-6 mb-3">
                <p className="text-3xl font-light text-emerald-500">{stats.minted}</p>
              </div>
              <p className="text-sm text-muted-foreground">Minted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
