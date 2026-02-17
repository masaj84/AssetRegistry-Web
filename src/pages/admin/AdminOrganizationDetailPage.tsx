import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { AdminOrganization } from '../../types/admin';

export function AdminOrganizationDetailPage() {
  useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<AdminOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    taxId: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!id) return;

      try {
        const orgData = await adminService.getOrganizationById(parseInt(id));
        setOrganization(orgData);
        setFormData({
          name: orgData.name,
          type: orgData.type,
          taxId: orgData.taxId || '',
          address: orgData.address || '',
          contactEmail: orgData.contactEmail || '',
          contactPhone: orgData.contactPhone || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    try {
      await adminService.updateOrganization(parseInt(id), {
        name: formData.name,
        type: formData.type,
        taxId: formData.taxId || undefined,
        address: formData.address || undefined,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
      });
      navigate('/app/admin/organizations');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVerified = async () => {
    if (!organization || !id) return;

    try {
      if (organization.isVerified) {
        await adminService.unverifyOrganization(parseInt(id));
      } else {
        await adminService.verifyOrganization(parseInt(id));
      }
      setOrganization({ ...organization, isVerified: !organization.isVerified });
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

  if (error && !organization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-500">{error}</p>
          <Link to="/app/admin/organizations">
            <Button className="mt-4" variant="secondary">Back to Organizations</Button>
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
            <Link to="/app/admin/organizations" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-light">Edit Organization</h1>
          </div>
          <p className="text-muted-foreground">{organization?.name}</p>
        </div>
        <Badge variant={organization?.isVerified ? 'success' : 'default'}>
          {organization?.isVerified ? 'Verified' : 'Unverified'}
        </Badge>
      </div>

      {error && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Organization Info */}
      <div className="border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 border border-border flex items-center justify-center bg-foreground/5 text-2xl font-light">
            {organization?.name?.charAt(0).toUpperCase() || 'O'}
          </div>
          <div>
            <p className="font-medium text-lg">{organization?.name}</p>
            <p className="text-sm text-muted-foreground">{organization?.type}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {organization?.userCount} user{organization?.userCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Organization Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="BUSINESS">Business</option>
              <option value="GOVERNMENT">Government</option>
              <option value="NGO">NGO</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <Input
            label="Tax ID"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <Input
            label="Contact Email"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          />

          <Input
            label="Contact Phone"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          />

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/app/admin/organizations')}>
              Cancel
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant={organization?.isVerified ? 'destructive' : 'primary'}
              onClick={handleToggleVerified}
              className={!organization?.isVerified ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              {organization?.isVerified ? 'Unverify' : 'Verify Organization'}
            </Button>
          </div>
        </form>
      </div>

      {/* Additional Info */}
      <div className="border border-border p-6">
        <h3 className="font-medium mb-4">Additional Information</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Organization ID</dt>
            <dd className="font-mono text-xs">{organization?.id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="font-medium">
              {organization?.createdAt ? new Date(organization.createdAt).toLocaleDateString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Total Users</dt>
            <dd className="font-medium">{organization?.userCount || 0}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Verification Status</dt>
            <dd className="font-medium">{organization?.isVerified ? 'Verified' : 'Not Verified'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
export default AdminOrganizationDetailPage;
