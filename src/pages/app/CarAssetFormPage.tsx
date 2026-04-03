import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { carAssetsService } from '../../services/carAssetsService';
// import { useLanguage } from '../../context/LanguageContext';
import type { CreateCarAssetRequest, CarAssetStatus } from '../../types';

const CarAssetFormPage = () => {
  // const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCarAssetRequest & { status?: CarAssetStatus }>({
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    mileage: 0,
    location: '',
    bookValue: 0,
    residualValue: 0,
    leaseStartDate: '',
    leaseEndDate: '',
    currentLessee: '',
    photos: [],
  });

  // Load car data if editing
  useEffect(() => {
    if (isEditing && id) {
      loadCarAsset(id);
    }
  }, [id, isEditing]);

  const loadCarAsset = async (carId: string) => {
    try {
      setLoading(true);
      const car = await carAssetsService.getCarAsset(carId);
      setFormData({
        vin: car.vin,
        make: car.make,
        model: car.model,
        year: car.year,
        color: car.color || '',
        mileage: car.mileage || 0,
        location: car.location || '',
        bookValue: car.bookValue || 0,
        residualValue: car.residualValue || 0,
        leaseStartDate: car.leaseStartDate ? car.leaseStartDate.split('T')[0] : '',
        leaseEndDate: car.leaseEndDate ? car.leaseEndDate.split('T')[0] : '',
        currentLessee: car.currentLessee || '',
        photos: car.photos || [],
        status: car.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load car asset');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vin || !formData.make || !formData.model) {
      setError('VIN, Make, and Model are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEditing && id) {
        const { vin, make, model, year, ...updateData } = formData;
        await carAssetsService.updateCarAsset(id, updateData);
      } else {
        const { status, ...createData } = formData;
        await carAssetsService.createCarAsset(createData);
      }

      navigate('/app/cars');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save car asset');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {isEditing ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vin-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    VIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="vin-input"
                    type="text"
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                    disabled={isEditing}
                    maxLength={17}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="17-character VIN"
                  />
                  <p className="mt-1 text-xs text-gray-500">Vehicle Identification Number (17 characters)</p>
                </div>

                <div>
                  <label htmlFor="make-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Make <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="make-input"
                    type="text"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    disabled={isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="e.g., BMW, Audi, Volkswagen"
                  />
                </div>

                <div>
                  <label htmlFor="model-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="model-input"
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    disabled={isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="e.g., 320i, A4, Passat"
                  />
                </div>

                <div>
                  <label htmlFor="year-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="year-input"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    disabled={isEditing}
                    min={1900}
                    max={currentYear + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="color-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    id="color-input"
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Black, Silver, Blue"
                  />
                </div>

                <div>
                  <label htmlFor="mileage-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mileage (km)
                  </label>
                  <input
                    id="mileage-input"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Location & Status */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Location & Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    id="location-input"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Wrocław HQ, Kraków Branch"
                  />
                </div>

                {isEditing && (
                  <div>
                    <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      id="status-select"
                      value={formData.status || 'AVAILABLE'}
                      onChange={(e) => handleInputChange('status', e.target.value as CarAssetStatus)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="LEASED">Leased</option>
                      <option value="IN_SERVICE">In Service</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="DAMAGED">Damaged</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Financial Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="book-value-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Book Value (PLN)
                  </label>
                  <input
                    id="book-value-input"
                    type="number"
                    value={formData.bookValue}
                    onChange={(e) => handleInputChange('bookValue', parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.01}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="150000.00"
                  />
                </div>

                <div>
                  <label htmlFor="residual-value-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Residual Value (PLN)
                  </label>
                  <input
                    id="residual-value-input"
                    type="number"
                    value={formData.residualValue}
                    onChange={(e) => handleInputChange('residualValue', parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.01}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="100000.00"
                  />
                </div>
              </div>
            </div>

            {/* Lease Information */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Lease Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="current-lessee-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Lessee
                  </label>
                  <input
                    id="current-lessee-input"
                    type="text"
                    value={formData.currentLessee}
                    onChange={(e) => handleInputChange('currentLessee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., ABC Transport Ltd"
                  />
                </div>

                <div>
                  <label htmlFor="lease-start-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lease Start Date
                  </label>
                  <input
                    id="lease-start-input"
                    type="date"
                    value={formData.leaseStartDate}
                    onChange={(e) => handleInputChange('leaseStartDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="lease-end-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lease End Date
                  </label>
                  <input
                    id="lease-end-input"
                    type="date"
                    value={formData.leaseEndDate}
                    onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/app/cars')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : (isEditing ? 'Update Vehicle' : 'Add Vehicle')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarAssetFormPage;