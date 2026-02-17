import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AdminAsset, PagedResponse } from '../../types/admin';

const statusVariants: Record<string, 'default' | 'success' | 'warning'> = {
  DRAFT: 'default',
  VERIFIED: 'warning',
  MINTED: 'success',
};

export function AdminAssetsPage() {
  const { t } = useLanguage();
  const [assets, setAssets] = useState<AdminAsset[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response: PagedResponse<AdminAsset> = await adminService.getAssets({
        pageNumber,
        pageSize,
        search: search || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      });
      setAssets(response.items);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, typeFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    fetchAssets();
  };

  const totalPages = Math.ceil(totalCount / pageSize);


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
          <Button onClick={() => { setError(''); fetchAssets(); }} className="mt-4" variant="secondary">
            {t('admin.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light mb-1">{t('admin.assets.title')}</h1>
          <p className="text-muted-foreground">{t('admin.assets.subtitle')}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalCount} {t('admin.assets.title').toLowerCase()}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder={t('admin.assets.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            {t('admin.users.search').split('...')[0]}
          </Button>
        </form>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPageNumber(1); }}
          className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('admin.assets.allCategories')}</option>
          <option value="watch">Watch</option>
          <option value="jewelry">Jewelry</option>
          <option value="art">Art</option>
          <option value="collectible">Collectible</option>
          <option value="vehicle">Vehicle</option>
          <option value="other">Other</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPageNumber(1); }}
          className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('admin.assets.allStatuses')}</option>
          <option value="DRAFT">{t('admin.dashboard.draft')}</option>
          <option value="VERIFIED">{t('admin.dashboard.verified')}</option>
          <option value="MINTED">{t('admin.assets.minted')}</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-foreground/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Token ID</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('admin.loading')}
                  </div>
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  {t('admin.assets.noAssets')}
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-border flex items-center justify-center bg-foreground/5">
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.name || `Asset #${asset.id}`}</p>
                        {asset.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {asset.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm capitalize">{asset.type}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      {asset.ownerUsername && (
                        <p className="font-medium">{asset.ownerUsername}</p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                        {asset.ownerAddress}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={statusVariants[asset.status] || 'default'}>
                      {asset.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground font-mono">
                    {asset.tokenId || '-'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      to={`/app/admin/assets/${asset.id}`}
                      className="p-2 hover:bg-foreground/5 rounded transition-colors inline-flex"
                    >
                      <svg className="w-4 h-4 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {((pageNumber - 1) * pageSize) + 1} - {Math.min(pageNumber * pageSize, totalCount)} / {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber === 1}
            >
              {t('admin.users.previous')}
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {t('admin.users.page')} {pageNumber} {t('admin.users.of')} {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
              disabled={pageNumber === totalPages}
            >
              {t('admin.users.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminAssetsPage;
