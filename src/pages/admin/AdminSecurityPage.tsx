import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import type { LockedUser, AdminUser, PagedResponse } from '../../types/admin';
import { useLanguage } from '../../context/LanguageContext';

export function AdminSecurityPage() {
  const { t } = useLanguage();
  const [lockedUsers, setLockedUsers] = useState<LockedUser[]>([]);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [locked, usersResponse] = await Promise.all([
        adminService.getLockedUsers(),
        adminService.getUsers({ pageSize: 100 }),
      ]);
      setLockedUsers(locked);
      setAllUsers(usersResponse.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnlock = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminService.unlockUser(userId);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetFailedCount = async (userId: string) => {
    setActionLoading(`reset-${userId}`);
    try {
      await adminService.resetAccessFailedCount(userId);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmEmail = async (userId: string) => {
    setActionLoading(`email-${userId}`);
    try {
      await adminService.confirmUserEmail(userId);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  // Users with failed login attempts (but not necessarily locked)
  const usersWithFailedAttempts = allUsers.filter(u => (u as any).accessFailedCount > 0);

  // Users without confirmed email
  const usersWithoutEmailConfirmation = allUsers.filter(u => !u.emailConfirmed);

  if (error && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-500">{error}</p>
          <Button onClick={() => { setError(''); fetchData(); }} className="mt-4" variant="secondary">
            {t('admin.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light mb-1">{t('admin.security.title')}</h1>
        <p className="text-muted-foreground">{t('admin.security.subtitle')}</p>
      </div>

      {error && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">
            {t('admin.dismiss')}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.security.lockedUsers')}</p>
          <p className="text-4xl font-light text-red-500">{lockedUsers.length}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.security.failedAttempts')}</p>
          <p className="text-4xl font-light text-amber-500">{usersWithFailedAttempts.length}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.security.unconfirmedEmails')}</p>
          <p className="text-4xl font-light text-muted-foreground">{usersWithoutEmailConfirmation.length}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.security.totalUsers')}</p>
          <p className="text-4xl font-light">{allUsers.length}</p>
        </div>
      </div>

      {/* Locked Users */}
      <div className="border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-red-500/5">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h2 className="font-medium">{t('admin.security.lockedUsersTitle')}</h2>
          </div>
          <Badge variant="destructive">{lockedUsers.length}</Badge>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('admin.loading')}
            </div>
          </div>
        ) : lockedUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{t('admin.security.noLockedUsers')}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-foreground/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('admin.user')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('admin.security.failedCount')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('admin.security.lockoutEnd')}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lockedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-foreground/[0.02]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-red-500 flex items-center justify-center bg-red-500/10 text-red-500 text-sm font-medium">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="destructive">{user.accessFailedCount} {t('admin.security.attempts')}</Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {user.lockoutEnd ? new Date(user.lockoutEnd).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => handleUnlock(user.id)}
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? t('admin.unlocking') : t('admin.security.unlock')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Users without email confirmation */}
      <div className="border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <h2 className="font-medium">{t('admin.security.unconfirmedEmailsTitle')}</h2>
          </div>
          <Badge variant="warning">{usersWithoutEmailConfirmation.length}</Badge>
        </div>

        {usersWithoutEmailConfirmation.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{t('admin.security.allEmailsConfirmed')}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-foreground/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('admin.user')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('admin.createdAt')}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usersWithoutEmailConfirmation.slice(0, 10).map((user) => (
                <tr key={user.id} className="hover:bg-foreground/[0.02]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-border flex items-center justify-center bg-foreground/5 text-sm font-medium">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleConfirmEmail(user.id)}
                      disabled={actionLoading === `email-${user.id}`}
                    >
                      {actionLoading === `email-${user.id}` ? t('admin.confirming') : t('admin.security.confirmEmail')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {usersWithoutEmailConfirmation.length > 10 && (
          <div className="px-6 py-3 border-t border-border text-sm text-muted-foreground">
            {t('admin.security.andMore').replace('{count}', String(usersWithoutEmailConfirmation.length - 10))}
          </div>
        )}
      </div>
    </div>
  );
}
