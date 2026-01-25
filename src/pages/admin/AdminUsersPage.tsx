import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AdminUser, PagedResponse } from '../../types/admin';

export function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response: PagedResponse<AdminUser> = await adminService.getUsers({
        pageNumber,
        pageSize,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(response.items);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageNumber, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    fetchUsers();
  };

  const handleToggleActive = async (user: AdminUser) => {
    try {
      if (user.isActive) {
        await adminService.deactivateUser(user.id);
      } else {
        await adminService.activateUser(user.id);
      }
      fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
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
          <Button onClick={() => { setError(''); fetchUsers(); }} className="mt-4" variant="secondary">
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
          <h1 className="text-3xl font-light mb-1">{t('admin.users.title')}</h1>
          <p className="text-muted-foreground">{t('admin.users.subtitle')}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalCount} {t('admin.security.totalUsers').toLowerCase()}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder={t('admin.users.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            {t('admin.users.search').split('...')[0]}
          </Button>
        </form>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPageNumber(1); }}
          className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('admin.users.allRoles')}</option>
          <option value="ADMIN">Admin</option>
          <option value="AUTHORITY">Authority</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-foreground/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.user')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.users.role')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.users.organization')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.users.status')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.createdAt')}</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('admin.loading')}
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {t('admin.users.noUsers')}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-foreground/[0.02] transition-colors">
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
                  <td className="px-4 py-4">
                    <Badge variant={user.role === 'ADMIN' ? 'warning' : user.role === 'AUTHORITY' ? 'success' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {user.organizationName || '-'}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={user.isActive ? 'success' : 'destructive'}>
                      {user.isActive ? t('admin.users.active') : t('admin.users.inactive')}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(user)}
                        className="p-2 hover:bg-foreground/5 rounded transition-colors"
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? (
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <Link
                        to={`/app/admin/users/${user.id}`}
                        className="p-2 hover:bg-foreground/5 rounded transition-colors"
                      >
                        <svg className="w-4 h-4 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </Link>
                    </div>
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
