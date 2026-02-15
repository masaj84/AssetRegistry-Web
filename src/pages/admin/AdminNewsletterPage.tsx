import { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { NewsletterSubscriber } from '../../types/admin';

export function AdminNewsletterPage() {
  const { t } = useLanguage();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getNewsletterSubscribers();
      setSubscribers(data);
      setFilteredSubscribers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredSubscribers(
        subscribers.filter(s =>
          s.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [search, subscribers]);

  const exportCSV = () => {
    const headers = ['Email', 'Subscribed At', 'Active'];
    const rows = subscribers.map(s => [
      s.email,
      new Date(s.subscribedAt).toISOString(),
      s.isActive ? 'Yes' : 'No'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <Button onClick={() => { setError(''); fetchSubscribers(); }} className="mt-4" variant="secondary">
            {t('admin.retry')}
          </Button>
        </div>
      </div>
    );
  }

  const activeCount = subscribers.filter(s => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light mb-1">{t('admin.newsletter.title')}</h1>
          <p className="text-muted-foreground">{t('admin.newsletter.subtitle')}</p>
        </div>
        <Button
          onClick={exportCSV}
          disabled={subscribers.length === 0}
          className={
            subscribers.length > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : ''
          }
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.newsletter.totalSubscribers')}</p>
          <p className="text-4xl font-light">{subscribers.length}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.users.active')}</p>
          <p className="text-4xl font-light text-emerald-500">{activeCount}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">{t('admin.users.inactive')}</p>
          <p className="text-4xl font-light text-muted-foreground">{subscribers.length - activeCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder={t('admin.newsletter.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        {search && (
          <Button variant="ghost" onClick={() => setSearch('')}>
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-foreground/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.users.email')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.newsletter.subscribedAt')}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('admin.users.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('admin.loading')}
                  </div>
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  {t('admin.newsletter.noSubscribers')}
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-border flex items-center justify-center bg-foreground/5 text-sm font-medium">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(subscriber.subscribedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={subscriber.isActive ? 'success' : 'default'}>
                      {subscriber.isActive ? t('admin.users.active') : t('admin.users.inactive')}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info */}
      {filteredSubscribers.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredSubscribers.length} of {subscribers.length} subscribers
        </p>
      )}
    </div>
  );
}
