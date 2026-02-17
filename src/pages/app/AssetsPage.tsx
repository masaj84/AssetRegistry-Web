import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light mb-1">Assets</h1>
          <p className="text-muted-foreground">Manage your registered products</p>
        </div>
        <Link to="/app/assets/new">
          <Button className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add Asset
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="border border-border dark:border-border/50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, serial number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors text-sm"
            />
          </div>

          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-10 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              {types.map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="VERIFIED">Verified</option>
              <option value="MINTED">Minted</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="border border-border dark:border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-border/50 bg-foreground/[0.02] dark:bg-purple/5">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Product</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Type</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Serial</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {assets.length === 0 ? 'No assets registered yet' : 'No assets match your filters'}
                    </p>
                    {assets.length === 0 && (
                      <Link to="/app/assets/new" className="text-sm text-foreground hover:underline">
                        Add your first asset →
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="group hover:bg-foreground/[0.02] dark:hover:bg-orange/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-border dark:border-border/50 flex items-center justify-center text-muted-foreground group-hover:border-foreground dark:group-hover:border-orange/60 group-hover:text-foreground dark:group-hover:text-orange transition-colors flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">{asset.metadata.name || `Asset #${asset.id}`}</p>
                          {asset.metadata.brand && (
                            <p className="text-xs text-muted-foreground">{asset.metadata.brand} {asset.metadata.model}</p>
                          )}
                        </div>
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
                      <span className="text-sm text-muted-foreground font-mono">
                        {asset.metadata.serialNumber || '—'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/app/assets/${asset.id}`}>
                          <button className="h-8 px-3 border border-border dark:border-border/50 hover:border-foreground dark:hover:border-orange/60 text-sm text-muted-foreground hover:text-foreground dark:hover:text-orange transition-colors">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="h-8 px-3 border border-border dark:border-border/50 hover:border-red-500 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredAssets.length} of {assets.length} assets</span>
        {filteredAssets.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
              <span>Draft: {assets.filter(a => a.status === 'DRAFT').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span>Verified: {assets.filter(a => a.status === 'VERIFIED').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>Minted: {assets.filter(a => a.status === 'MINTED').length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AssetsPage;
