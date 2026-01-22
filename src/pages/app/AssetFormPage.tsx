import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { assetsService } from '../../services/assetsService';
import { getErrorMessage } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const typeOptions = [
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'watch', label: 'Watch' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'art', label: 'Art' },
  { value: 'instrument', label: 'Instrument' },
  { value: 'other', label: 'Other' },
];

export function AssetFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'vehicle',
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    year: '',
    purchaseDate: '',
    purchasePrice: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAsset(parseInt(id));
    }
  }, [id]);

  const fetchAsset = async (assetId: number) => {
    try {
      setIsFetching(true);
      const asset = await assetsService.getById(assetId);
      setFormData({
        type: asset.type,
        name: asset.metadata.name || '',
        brand: asset.metadata.brand || '',
        model: asset.metadata.model || '',
        serialNumber: asset.metadata.serialNumber || '',
        year: asset.metadata.year?.toString() || '',
        purchaseDate: asset.metadata.purchaseDate || '',
        purchasePrice: asset.metadata.purchasePrice?.toString() || '',
        description: asset.metadata.description || '',
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const metadata = {
        name: formData.name || undefined,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        serialNumber: formData.serialNumber || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        description: formData.description || undefined,
      };

      if (isEditing && id) {
        await assetsService.update(parseInt(id), {
          type: formData.type,
          metadata,
        });
      } else {
        await assetsService.create({
          ownerAddress: user?.walletAddress || '0x0000000000000000000000000000000000000000',
          type: formData.type,
          metadata,
        });
      }

      navigate('/app/assets');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-light">
            {isEditing ? 'Edit Asset' : 'New Asset'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update asset information' : 'Register a new asset'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              id="type"
              label="Asset Type *"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={typeOptions}
            />

            <Input
              id="name"
              label="Name *"
              placeholder="e.g. Rolex Submariner"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="brand"
                label="Brand"
                placeholder="e.g. Rolex"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />

              <Input
                id="model"
                label="Model"
                placeholder="e.g. Submariner Date"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>

            <Input
              id="serialNumber"
              label="Serial Number"
              placeholder="e.g. SN-12345678"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="year"
                type="number"
                label="Year"
                placeholder="e.g. 2023"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />

              <Input
                id="purchaseDate"
                type="date"
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            <Input
              id="purchasePrice"
              type="number"
              label="Purchase Price"
              placeholder="0.00"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
            />

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Additional information about the asset..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Asset'}
          </Button>
        </div>
      </form>
    </div>
  );
}
