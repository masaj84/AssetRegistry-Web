import { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AuditLogEntry, PagedResponse } from '../../types/admin';

const actionVariants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'destructive',
  LOGIN: 'default',
  LOGOUT: 'default',
  VERIFY: 'success',
  MINT: 'success',
  ANCHOR: 'success',
};

const entityIcons: Record<string, React.ReactNode> = {
  User: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Asset: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  Organization: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  Batch: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  Auth: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
};

export function AdminAuditLogPage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notImplemented, setNotImplemented] = useState(false);

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response: PagedResponse<AuditLogEntry> = await adminService.getAuditLogs({
        pageNumber,
        pageSize,
        action: actionFilter || undefined,
        entityType: entityFilter || undefined,
        userId: userSearch || undefined,
      });
      setLogs(response.items);
      setTotalCount(response.totalCount);
      setNotImplemented(false);
    } catch (err: unknown) {
      // Check if it's a 404 (not implemented yet)
      const error = err as { response?: { status?: number }; message?: string };
      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        setNotImplemented(true);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, actionFilter, entityFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    fetchLogs();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // If not implemented, show placeholder
  if (notImplemented) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-light mb-1">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>

        <div className="border border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h2 className="text-xl font-medium mb-2">Audit Logs Coming Soon</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The audit log feature requires a backend endpoint to be implemented.
            This page will display all system activities once the API is ready.
          </p>

          <div className="border border-border p-6 max-w-lg mx-auto text-left">
            <h3 className="font-medium mb-3">Planned Features:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                User login/logout tracking
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Asset creation, updates, and deletions
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Blockchain anchoring events
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Organization verifications
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Admin actions tracking
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Backend endpoint required: <code className="bg-foreground/10 px-1 rounded">GET /api/admin/audit-logs</code>
          </p>
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
          <Button onClick={() => { setError(''); fetchLogs(); }} className="mt-4" variant="secondary">
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
          <h1 className="text-3xl font-light mb-1">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalCount} entries
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search by user ID..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPageNumber(1); }}
          className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="VERIFY">Verify</option>
          <option value="MINT">Mint</option>
          <option value="ANCHOR">Anchor</option>
        </select>
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPageNumber(1); }}
          className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Entities</option>
          <option value="User">User</option>
          <option value="Asset">Asset</option>
          <option value="Organization">Organization</option>
          <option value="Batch">Batch</option>
          <option value="Auth">Auth</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-foreground/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('admin.loading')}
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-border flex items-center justify-center bg-foreground/5 text-xs font-medium">
                        {log.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="text-sm">{log.username || 'System'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={actionVariants[log.action] || 'default'}>
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {entityIcons[log.entityType] || entityIcons.Asset}
                      </span>
                      <span>{log.entityType}</span>
                      {log.entityId && (
                        <span className="text-muted-foreground font-mono text-xs">#{log.entityId}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground max-w-[300px] truncate">
                    {log.details || '-'}
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
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {pageNumber} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
              disabled={pageNumber === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
