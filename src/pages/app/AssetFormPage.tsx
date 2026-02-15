import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { assetsService } from '../../services/assetsService';
import { getErrorMessage } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const typeOptions = [
  { value: 'vehicle', label: 'Vehicle', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
  { value: 'watch', label: 'Watch', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'electronics', label: 'Electronics', icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3' },
  { value: 'art', label: 'Art', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { value: 'instrument', label: 'Instrument', icon: 'm9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' },
  { value: 'other', label: 'Other', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
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
    purchaseCurrency: 'EUR',
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
        purchaseCurrency: asset.metadata.purchaseCurrency || 'EUR',
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
        purchaseCurrency: formData.purchaseCurrency || undefined,
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 border border-border hover:border-foreground flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-light">
            {isEditing ? 'Edit Asset' : 'New Asset'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update asset information' : 'Register a new product in the registry'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Asset Type */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium">Asset Type</h2>
            <p className="text-sm text-muted-foreground mt-1">Select the category of your product</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: option.value })}
                  className={`p-4 border transition-all text-left ${
                    formData.type === option.value
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border hover:border-foreground/50'
                  }`}
                >
                  <svg className={`w-5 h-5 mb-2 ${formData.type === option.value ? 'text-foreground' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d={option.icon} />
                  </svg>
                  <p className={`text-sm font-medium ${formData.type === option.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {option.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium">Basic Information</h2>
            <p className="text-sm text-muted-foreground mt-1">Primary details about the product</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rolex Submariner"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Rolex"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <input
                  type="text"
                  placeholder="e.g. Submariner Date"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Serial Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. SN-12345678"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors font-mono"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  Unique ID
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Details */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium">Purchase Details</h2>
            <p className="text-sm text-muted-foreground mt-1">Origin and acquisition information</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2023"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Purchase Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={formData.purchaseCurrency}
                  onChange={(e) => setFormData({ ...formData, purchaseCurrency: e.target.value })}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="PLN">PLN</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                rows={4}
                placeholder="Additional information about the product..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-border bg-background focus:border-foreground focus:outline-none transition-colors resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Include condition, provenance, or any relevant details
              </p>
            </div>
          </div>
        </div>

        {/* Blockchain Notice */}
        <div className="border border-border bg-foreground/[0.02] p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Blockchain Record</p>
              <p className="text-sm text-muted-foreground mt-1">
                Once saved, this information will be prepared for blockchain verification.
                The record becomes immutable after minting.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-12 px-6 border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : isEditing ? 'Save Changes' : 'Create Asset'}
          </Button>
        </div>
      </form>
    </div>
  );
}
