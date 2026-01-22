import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
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
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your assets</p>
        </div>
        <Link to="/app/assets/new">
          <Button>Add Asset</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-3xl font-bold text-muted-foreground">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-3xl font-bold text-amber-500">{stats.verified}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Minted</p>
                <p className="text-3xl font-bold text-emerald-500">{stats.minted}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assets by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Assets by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(assetsByType).length === 0 ? (
              <p className="text-muted-foreground text-sm">No assets yet</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(assetsByType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => {
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAssets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No assets yet</p>
            ) : (
              <div className="space-y-4">
                {recentAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    to={`/app/assets/${asset.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div>
                      <p className="font-medium">{asset.metadata.name || `Asset #${asset.id}`}</p>
                      <p className="text-sm text-muted-foreground capitalize">{asset.type}</p>
                    </div>
                    <Badge variant={statusVariants[asset.status]}>
                      {statusLabels[asset.status]}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary">
              <Badge className="mb-2">Draft</Badge>
              <p className="text-2xl font-bold">{stats.draft}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary">
              <Badge variant="warning" className="mb-2">Verified</Badge>
              <p className="text-2xl font-bold">{stats.verified}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary">
              <Badge variant="success" className="mb-2">Minted</Badge>
              <p className="text-2xl font-bold">{stats.minted}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
