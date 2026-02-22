import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { InfoTooltip } from '../../components/ui/Tooltip';
import { OnboardingTour } from '../../components/onboarding/OnboardingTour';
import { assetsService } from '../../services/assetsService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { Asset } from '../../types';

const statusLabelKeys: Record<string, string> = {
  DRAFT: 'status.draft',
  VERIFIED: 'status.verified',
  MINTED: 'status.minted',
};

const statusVariants: Record<string, 'default' | 'success' | 'warning'> = {
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

export function DashboardPage() {
  const { t } = useLanguage();
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
          {t('common.loading')}
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
      {/* Onboarding Tour */}
      <OnboardingTour />
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light mb-1">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="border border-border dark:border-border/50 p-6 relative group hover:border-foreground dark:hover:border-orange/40 transition-all card-hover-glow">
          <div className="absolute top-0 left-0 w-1 h-full bg-foreground dark:bg-gradient-to-b dark:from-orange dark:to-magenta" />
          <p className="text-sm text-muted-foreground mb-1">
            {t('dashboard.totalAssets')}
            <InfoTooltip content={t('tooltip.totalAssets')} />
          </p>
          <p className="text-4xl font-light dark:text-orange">{stats.total}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            {t('dashboard.allRegisteredItems')}
          </div>
        </div>

        {/* Draft */}
        <div className="border border-border dark:border-border/50 p-6 group hover:border-foreground dark:hover:border-purple/40 transition-all card-hover-glow">
          <p className="text-sm text-muted-foreground mb-1">
            {t('dashboard.draft')}
            <InfoTooltip content={t('tooltip.draftCount')} />
          </p>
          <p className="text-4xl font-light text-muted-foreground">{stats.draft}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
            {t('dashboard.awaitingCompletion')}
          </div>
        </div>

        {/* Verified */}
        <div className="border border-border dark:border-border/50 p-6 group hover:border-foreground dark:hover:border-amber-500/40 transition-all card-hover-glow">
          <p className="text-sm text-muted-foreground mb-1">
            {t('dashboard.verified')}
            <InfoTooltip content={t('tooltip.verifiedCount')} />
          </p>
          <p className="text-4xl font-light text-amber-500">{stats.verified}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            {t('dashboard.readyToMint')}
          </div>
        </div>

        {/* Minted */}
        <div className="border border-border dark:border-border/50 p-6 group hover:border-foreground dark:hover:border-emerald-500/40 transition-all card-hover-glow">
          <p className="text-sm text-muted-foreground mb-1">
            {t('dashboard.minted')}
            <InfoTooltip content={t('tooltip.mintedCount')} />
          </p>
          <p className="text-4xl font-light text-emerald-500">{stats.minted}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            {t('dashboard.onBlockchain')}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assets by Type */}
        <div className="border border-border dark:border-border/50 card-hover-glow">
          <div className="px-6 py-4 border-b border-border dark:border-border/50 flex items-center justify-between">
            <h2 className="font-medium">{t('dashboard.assetsByType')}</h2>
            <span className="text-xs text-muted-foreground">{Object.keys(assetsByType).length} {t('dashboard.types')}</span>
          </div>
          <div className="p-6">
            {Object.keys(assetsByType).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">{t('dashboard.noAssetsYet')}</p>
                <Link to="/app/assets/new" className="text-sm text-foreground hover:underline mt-2 inline-block">
                  {t('dashboard.addFirstAsset')}
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
                        <div className="h-1 bg-border dark:bg-border/50 overflow-hidden">
                          <div
                            className="h-full bg-foreground dark:bg-gradient-to-r dark:from-orange dark:to-purple transition-all duration-500"
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
        <div className="assets-list border border-border dark:border-border/50 card-hover-glow">
          <div className="px-6 py-4 border-b border-border dark:border-border/50 flex items-center justify-between">
            <h2 className="font-medium">{t('dashboard.recentAssets')}</h2>
            <Link to="/app/assets" className="text-xs text-muted-foreground hover:text-foreground dark:hover:text-orange transition-colors">
              {t('dashboard.viewAll')}
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
                <p className="text-muted-foreground text-sm">{t('dashboard.noRecentActivity')}</p>
              </div>
            ) : (
              recentAssets.map((asset) => (
                <Link
                  key={asset.id}
                  to={`/app/assets/${asset.id}`}
                  className="flex items-center justify-between p-4 hover:bg-foreground/[0.02] dark:hover:bg-orange/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-border dark:border-border/50 flex items-center justify-center text-muted-foreground group-hover:border-foreground dark:group-hover:border-orange/60 group-hover:text-foreground dark:group-hover:text-orange transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d={getTypeIcon(asset.type)} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{asset.metadata.name || `Asset #${asset.id}`}</p>
                      <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariants[asset.status]}>
                    {t(statusLabelKeys[asset.status])}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="border border-border dark:border-border/50 card-hover-glow">
        <div className="px-6 py-4 border-b border-border dark:border-border/50">
          <h2 className="font-medium">{t('dashboard.assetPipeline')}</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Draft */}
            <div className="flex-1 text-center min-w-0">
              <div className="border border-border dark:border-border/50 p-3 sm:p-6 mb-2 sm:mb-3">
                <p className="text-xl sm:text-3xl font-light text-muted-foreground">{stats.draft}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('dashboard.draft')}</p>
            </div>

            {/* Arrow */}
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground dark:text-orange/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>

            {/* Verified */}
            <div className="flex-1 text-center min-w-0">
              <div className="border border-amber-500/30 bg-amber-500/5 p-3 sm:p-6 mb-2 sm:mb-3">
                <p className="text-xl sm:text-3xl font-light text-amber-500">{stats.verified}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('dashboard.verified')}</p>
            </div>

            {/* Arrow */}
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground dark:text-orange/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>

            {/* Minted */}
            <div className="flex-1 text-center min-w-0">
              <div className="border border-emerald-500/30 bg-emerald-500/5 p-3 sm:p-6 mb-2 sm:mb-3">
                <p className="text-xl sm:text-3xl font-light text-emerald-500">{stats.minted}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('dashboard.minted')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
