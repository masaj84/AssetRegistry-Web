import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AdminDashboardStats } from '../../types/admin';

export function AdminDashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      <div>
        <h1 className="text-3xl font-light mb-1">{t('admin.dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Link to="/app/admin/users" className="border border-border p-6 relative group hover:border-foreground transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <p className="text-sm text-muted-foreground mb-1">{t('admin.dashboard.totalUsers')}</p>
          <p className="text-4xl font-light">{stats?.totalUsers || 0}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            {stats?.activeUsers || 0} {t('admin.dashboard.active')}
          </div>
        </Link>

        {/* Organizations */}
        <Link to="/app/admin/organizations" className="border border-border p-6 group hover:border-foreground transition-colors">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.dashboard.organizations')}</p>
          <p className="text-4xl font-light">{stats?.totalOrganizations || 0}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            {stats?.verifiedOrganizations || 0} {t('admin.dashboard.verified')}
          </div>
        </Link>

        {/* Total Assets */}
        <Link to="/app/admin/assets" className="border border-border p-6 group hover:border-foreground transition-colors">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.dashboard.totalAssets')}</p>
          <p className="text-4xl font-light">{stats?.totalAssets || 0}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            {stats?.mintedAssets || 0} {t('admin.dashboard.minted')}
          </div>
        </Link>

        {/* Newsletter */}
        <Link to="/app/admin/newsletter" className="border border-border p-6 group hover:border-foreground transition-colors">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.dashboard.verifiedAssets')}</p>
          <p className="text-4xl font-light text-amber-500">{stats?.verifiedAssets || 0}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            {t('admin.dashboard.readyForMinting')}
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Stats */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-medium">{t('admin.dashboard.userStats')}</h2>
            <Link to="/app/admin/users" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('admin.dashboard.activeUsers')}</span>
              <span className="font-medium">{stats?.activeUsers || 0}</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${stats?.totalUsers ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('admin.dashboard.inactive')}: {(stats?.totalUsers || 0) - (stats?.activeUsers || 0)}</span>
              <span>{stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% {t('admin.dashboard.activePercent')}</span>
            </div>
          </div>
        </div>

        {/* Asset Pipeline */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-medium">{t('admin.dashboard.assetPipeline')}</h2>
            <Link to="/app/admin/assets" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center">
                <div className="border border-border p-4 mb-2">
                  <p className="text-2xl font-light text-muted-foreground">
                    {(stats?.totalAssets || 0) - (stats?.verifiedAssets || 0) - (stats?.mintedAssets || 0)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{t('admin.dashboard.draft')}</p>
              </div>
              <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <div className="flex-1 text-center">
                <div className="border border-amber-500/30 bg-amber-500/5 p-4 mb-2">
                  <p className="text-2xl font-light text-amber-500">{stats?.verifiedAssets || 0}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t('admin.dashboard.verified')}</p>
              </div>
              <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <div className="flex-1 text-center">
                <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 mb-2">
                  <p className="text-2xl font-light text-emerald-500">{stats?.mintedAssets || 0}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t('admin.dashboard.minted')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/app/admin/users"
          className="border border-border p-4 flex items-center gap-3 hover:border-foreground transition-colors group"
        >
          <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">{t('admin.dashboard.manageUsers')}</p>
            <p className="text-xs text-muted-foreground">{t('admin.dashboard.viewEditUsers')}</p>
          </div>
        </Link>

        <Link
          to="/app/admin/organizations"
          className="border border-border p-4 flex items-center gap-3 hover:border-foreground transition-colors group"
        >
          <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">{t('admin.organizations')}</p>
            <p className="text-xs text-muted-foreground">{t('admin.dashboard.verifyOrganizations')}</p>
          </div>
        </Link>

        <Link
          to="/app/admin/assets"
          className="border border-border p-4 flex items-center gap-3 hover:border-foreground transition-colors group"
        >
          <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">{t('admin.dashboard.allAssets')}</p>
            <p className="text-xs text-muted-foreground">{t('admin.dashboard.browseAssets')}</p>
          </div>
        </Link>

        <Link
          to="/app/admin/newsletter"
          className="border border-border p-4 flex items-center gap-3 hover:border-foreground transition-colors group"
        >
          <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">{t('admin.newsletter')}</p>
            <p className="text-xs text-muted-foreground">{t('admin.dashboard.viewSubscribers')}</p>
          </div>
        </Link>

        <Link
          to="/app/admin/blockchain"
          className="border border-border p-4 flex items-center gap-3 hover:border-foreground transition-colors group"
        >
          <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">Blockchain</p>
            <p className="text-xs text-muted-foreground">Anchoring & verification</p>
          </div>
        </Link>

        <Link
          to="/app/admin/audit"
          className="border border-border p-4 flex items-center gap-3 hover:border-foreground transition-colors group"
        >
          <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">Audit Log</p>
            <p className="text-xs text-muted-foreground">System activity history</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
export default AdminDashboardPage;
