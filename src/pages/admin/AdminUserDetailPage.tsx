import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AdminUser, AdminOrganization } from '../../types/admin';

export function AdminUserDetailPage() {
  useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    role: '',
    walletAddress: '',
    organizationId: '',
    organizationRole: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [userData, orgsResponse] = await Promise.all([
          adminService.getUserById(id),
          adminService.getOrganizations({ pageSize: 100 }),
        ]);

        setUser(userData);
        setOrganizations(orgsResponse.items);
        setFormData({
          email: userData.email,
          role: userData.role,
          walletAddress: userData.walletAddress || '',
          organizationId: userData.organizationId?.toString() || '',
          organizationRole: userData.organizationRole || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    try {
      await adminService.updateUser(id, {
        email: formData.email,
        role: formData.role,
        walletAddress: formData.walletAddress || undefined,
        organizationId: formData.organizationId ? parseInt(formData.organizationId) : undefined,
        organizationRole: formData.organizationRole || undefined,
      });
      navigate('/app/admin/users');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!user || !id) return;

    try {
      if (user.isActive) {
        await adminService.deactivateUser(id);
      } else {
        await adminService.activateUser(id);
      }
      setUser({ ...user, isActive: !user.isActive });
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

  if (error && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-500">{error}</p>
          <Link to="/app/admin/users">
            <Button className="mt-4" variant="secondary">Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/app/admin/users" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-light">Edit User</h1>
          </div>
          <p className="text-muted-foreground">{user?.username}</p>
        </div>
        <Badge variant={user?.isActive ? 'success' : 'destructive'}>
          {user?.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {error && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* User Info */}
      <div className="border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 border border-border flex items-center justify-center bg-foreground/5 text-2xl font-light">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-lg">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="USER">User</option>
              <option value="AUTHORITY">Authority</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <Input
            label="Wallet Address"
            value={formData.walletAddress}
            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
            placeholder="0x..."
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Organization</label>
            <select
              value={formData.organizationId}
              onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No Organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          {formData.organizationId && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Organization Role</label>
              <select
                value={formData.organizationRole}
                onChange={(e) => setFormData({ ...formData, organizationRole: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Role</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/app/admin/users')}>
              Cancel
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant={user?.isActive ? 'destructive' : 'secondary'}
              onClick={handleToggleActive}
            >
              {user?.isActive ? 'Deactivate User' : 'Activate User'}
            </Button>
          </div>
        </form>
      </div>

      {/* Additional Info */}
      <div className="border border-border p-6">
        <h3 className="font-medium mb-4">Additional Information</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Email Confirmed</dt>
            <dd className="font-medium">{user?.emailConfirmed ? 'Yes' : 'No'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last Login</dt>
            <dd className="font-medium">
              {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">User ID</dt>
            <dd className="font-mono text-xs">{user?.id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Current Organization</dt>
            <dd className="font-medium">{user?.organizationName || 'None'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
