import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { assetsService } from '../../services/assetsService';
import { getErrorMessage } from '../../services/authService';
import type { Asset, AssetStatus } from '../../types';

const statusLabels: Record<AssetStatus, string> = {
  DRAFT: 'Draft',
  VERIFIED: 'Verified',
  MINTED: 'Minted',
};

const statusVariants: Record<AssetStatus, 'success' | 'warning' | 'default'> = {
  DRAFT: 'default',
  VERIFIED: 'warning',
  MINTED: 'success',
};

export function AssetsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const data = await assetsService.getAll();
      setAssets(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique types from assets
  const types = useMemo(() => [...new Set(assets.map((a) => a.type))], [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        search === '' ||
        asset.metadata.name?.toLowerCase().includes(search.toLowerCase()) ||
        asset.metadata.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
        asset.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || asset.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, search, typeFilter, statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await assetsService.delete(id);
      setAssets(assets.filter((a) => a.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light">Assets</h1>
          <p className="text-muted-foreground">Manage your registered assets</p>
        </div>
        <Link to="/app/assets/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Asset
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name, serial number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                ...types.map((t) => ({ value: t, label: t })),
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'VERIFIED', label: 'Verified' },
                { value: 'MINTED', label: 'Minted' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Type</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Serial Number</th>
                <th className="text-right text-sm font-medium text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {assets.length === 0 ? 'No assets yet' : 'No assets match your filters'}
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{asset.metadata.name || `Asset #${asset.id}`}</p>
                        {asset.metadata.brand && (
                          <p className="text-xs text-muted-foreground">{asset.metadata.brand} {asset.metadata.model}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm capitalize">{asset.type}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariants[asset.status]}>
                        {statusLabels[asset.status]}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {asset.metadata.serialNumber || '-'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/app/assets/${asset.id}`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(asset.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAssets.length} of {assets.length} assets
      </div>
    </div>
  );
}
