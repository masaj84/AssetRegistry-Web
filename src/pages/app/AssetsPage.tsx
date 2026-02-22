import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { assetsService } from '../../services/assetsService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { Asset, AssetStatus } from '../../types';

const statusLabelKeys: Record<AssetStatus, string> = {
  DRAFT: 'status.draft',
  VERIFIED: 'status.verified',
  MINTED: 'status.minted',
};

const statusVariants: Record<AssetStatus, 'success' | 'warning' | 'default'> = {
  DRAFT: 'default',
  VERIFIED: 'warning',
  MINTED: 'success',
};

// Asset type icons - matching AssetFormPage.tsx typeOptions
const typeIcons: Record<string, string> = {
  vehicle: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  watch: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  electronics: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
  art: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  instrument: 'm9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
  other: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
};

// Helper function to get icon for asset type
const getTypeIcon = (type: string): string => {
  const normalizedType = type.toLowerCase();
  return typeIcons[normalizedType] || typeIcons.other;
};

export function AssetsPage() {
  const { t } = useLanguage();
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
    if (!confirm(t('common.confirmDelete'))) return;
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
          {t('common.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light mb-1">{t('assets.title')}</h1>
          <p className="text-muted-foreground">{t('assets.subtitle')}</p>
        </div>
        <Link to="/app/assets/new">
          <Button className="add-asset-btn h-11 bg-emerald-600 hover:bg-emerald-700 text-white">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            {t('assets.addAsset')}
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
              placeholder={t('assets.searchPlaceholder')}
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
              <option value="all">{t('assets.allTypes')}</option>
              {types.map((type) => (
                <option key={type} value={type} className="capitalize">{t(`assetType.${type}`) || type}</option>
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
              <option value="all">{t('assets.allStatus')}</option>
              <option value="DRAFT">{t('status.draft')}</option>
              <option value="VERIFIED">{t('status.verified')}</option>
              <option value="MINTED">{t('status.minted')}</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="assets-list border border-border dark:border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-border/50 bg-foreground/[0.02] dark:bg-purple/5">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">{t('assets.tableProduct')}</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">{t('assets.tableType')}</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">{t('assets.tableStatus')}</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">{t('assets.tableSerial')}</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">{t('assets.tableActions')}</th>
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
                      {assets.length === 0 ? t('assets.noAssetsYet') : t('assets.noAssetsMatch')}
                    </p>
                    {assets.length === 0 && (
                      <Link to="/app/assets/new" className="text-sm text-foreground hover:underline">
                        {t('assets.addFirstAsset')}
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
                            <path d={getTypeIcon(asset.type)} />
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
                      <span className="text-sm">{t(`assetType.${asset.type}`) || asset.type}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariants[asset.status]}>
                        {t(statusLabelKeys[asset.status])}
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
                            {t('common.edit')}
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="h-8 px-3 border border-border dark:border-border/50 hover:border-red-500 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          {t('common.delete')}
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
        <span>{t('assets.showing')} {filteredAssets.length} {t('assets.of')} {assets.length} {t('assets.assets')}</span>
        {filteredAssets.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
              <span>{t('status.draft')}: {assets.filter(a => a.status === 'DRAFT').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span>{t('status.verified')}: {assets.filter(a => a.status === 'VERIFIED').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>{t('status.minted')}: {assets.filter(a => a.status === 'MINTED').length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AssetsPage;
