import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { InfoTooltip } from '../../components/ui/Tooltip';
import { assetsService } from '../../services/assetsService';
import { getErrorMessage } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { AssetDocument } from '../../types';

const typeOptions = [
  { value: 'vehicle', labelKey: 'category.vehicle', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
  { value: 'watch', labelKey: 'category.watch', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'electronics', labelKey: 'category.electronics', icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3' },
  { value: 'art', labelKey: 'category.art', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { value: 'instrument', labelKey: 'category.instrument', icon: 'm9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' },
  { value: 'other', labelKey: 'category.other', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
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
    productionDate: '',
    purchaseDate: '',
    purchasePrice: '',
    purchaseCurrency: 'EUR',
    description: '',
  });
  const [useExactProductionDate, setUseExactProductionDate] = useState(false);

  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState<AssetDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        productionDate: (asset.metadata.productionDate as string) || '',
        purchaseDate: asset.metadata.purchaseDate || '',
        purchasePrice: asset.metadata.purchasePrice?.toString() || '',
        purchaseCurrency: asset.metadata.purchaseCurrency || 'EUR',
        description: asset.metadata.description || '',
      });
      // If productionDate exists, enable exact date mode
      if (asset.metadata.productionDate) {
        setUseExactProductionDate(true);
      }
      // Fetch documents - use embedded documents if available, otherwise fetch separately
      if (asset.documents && asset.documents.length > 0) {
        setDocuments(asset.documents);
      } else {
        // Explicitly fetch documents in case they weren't included in the asset response
        try {
          const docs = await assetsService.getDocuments(assetId);
          setDocuments(docs);
        } catch {
          // Ignore document fetch errors - asset may simply have no documents
          setDocuments([]);
        }
      }
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
        // If exact date mode, use productionDate and extract year from it
        year: useExactProductionDate 
          ? (formData.productionDate ? new Date(formData.productionDate).getFullYear() : undefined)
          : (formData.year ? parseInt(formData.year) : undefined),
        productionDate: useExactProductionDate ? (formData.productionDate || undefined) : undefined,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setIsUploading(true);
    try {
      const doc = await assetsService.uploadDocument(parseInt(id), file);
      setDocuments((prev) => [...prev, doc]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      await assetsService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t('common.loading')}
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
          className="w-10 h-10 border border-border dark:border-border/50 hover:border-foreground dark:hover:border-orange/60 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-orange transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-light">
            {isEditing ? t('asset.edit') : t('asset.new')}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? t('asset.editSubtitle') : t('asset.newSubtitle')}
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
        <div className="border border-border dark:border-border/50 card-hover-glow">
          <div className="px-6 py-4 border-b border-border dark:border-border/50">
            <h2 className="font-medium">{t('asset.type')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('asset.typeSubtitle')}</p>
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
                      ? 'border-foreground dark:border-orange/60 bg-foreground/5 dark:bg-orange/10'
                      : 'border-border dark:border-border/50 hover:border-foreground/50 dark:hover:border-orange/40'
                  }`}
                >
                  <svg className={`w-5 h-5 mb-2 ${formData.type === option.value ? 'text-foreground dark:text-orange' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d={option.icon} />
                  </svg>
                  <p className={`text-sm font-medium ${formData.type === option.value ? 'text-foreground dark:text-orange' : 'text-muted-foreground'}`}>
                    {t(option.labelKey)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="border border-border dark:border-border/50 card-hover-glow">
          <div className="px-6 py-4 border-b border-border dark:border-border/50">
            <h2 className="font-medium">{t('asset.basicInfo')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('asset.basicInfoSubtitle')}</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('asset.name')} <span className="text-red-500">*</span>
                <InfoTooltip content={t('tooltip.assetName')} />
              </label>
              <input
                type="text"
                placeholder={t('asset.namePlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('asset.brand')}
                  <InfoTooltip content={t('tooltip.brand')} />
                </label>
                <input
                  type="text"
                  placeholder={t('asset.brandPlaceholder')}
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('asset.model')}
                  <InfoTooltip content={t('tooltip.model')} />
                </label>
                <input
                  type="text"
                  placeholder={t('asset.modelPlaceholder')}
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('asset.serialNumber')}
                <InfoTooltip content={t('tooltip.serialNumber')} />
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('asset.serialNumberPlaceholder')}
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors font-mono"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {t('asset.uniqueId')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Details */}
        <div className="border border-border dark:border-border/50 card-hover-glow">
          <div className="px-6 py-4 border-b border-border dark:border-border/50">
            <h2 className="font-medium">{t('asset.purchaseDetails')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('asset.purchaseDetailsSubtitle')}</p>
          </div>
          <div className="p-6 space-y-4">
            {/* Production Year/Date */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useExactProductionDate}
                    onChange={(e) => {
                      setUseExactProductionDate(e.target.checked);
                      // Clear the other field when switching
                      if (e.target.checked) {
                        setFormData({ ...formData, year: '' });
                      } else {
                        setFormData({ ...formData, productionDate: '' });
                      }
                    }}
                    className="w-4 h-4 border border-border dark:border-border/50 bg-background accent-orange"
                  />
                  <span className="text-sm text-muted-foreground">{t('asset.exactProductionDate')}</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {useExactProductionDate ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('asset.productionDate')}</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.productionDate ? formData.productionDate.substring(0, 4) : ''}
                        onChange={(e) => {
                          const year = e.target.value;
                          const currentDate = formData.productionDate || `${new Date().getFullYear()}-01-01`;
                          const [, month, day] = currentDate.split('-');
                          setFormData({ ...formData, productionDate: year ? `${year}-${month || '01'}-${day || '01'}` : '' });
                        }}
                        className="flex-1 h-12 px-2 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors text-sm"
                      >
                        <option value="">Rok</option>
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <select
                        value={formData.productionDate ? formData.productionDate.substring(5, 7) : ''}
                        onChange={(e) => {
                          const month = e.target.value;
                          const currentDate = formData.productionDate || `${new Date().getFullYear()}-01-01`;
                          const [year, , day] = currentDate.split('-');
                          setFormData({ ...formData, productionDate: `${year}-${month}-${day || '01'}` });
                        }}
                        className="w-20 h-12 px-2 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors text-sm"
                      >
                        <option value="">Mies.</option>
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      <select
                        value={formData.productionDate ? formData.productionDate.substring(8, 10) : ''}
                        onChange={(e) => {
                          const day = e.target.value;
                          const currentDate = formData.productionDate || `${new Date().getFullYear()}-01-01`;
                          const [year, month] = currentDate.split('-');
                          setFormData({ ...formData, productionDate: `${year}-${month}-${day}` });
                        }}
                        className="w-20 h-12 px-2 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors text-sm"
                      >
                        <option value="">Dzień</option>
                        {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('asset.year')}</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors"
                    >
                      <option value="">{t('asset.yearPlaceholder')}</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">{t('asset.purchaseDate')}</label>
                  <select
                    value={formData.purchaseDate ? formData.purchaseDate.substring(0, 4) : ''}
                    onChange={(e) => {
                      const year = e.target.value;
                      setFormData({ ...formData, purchaseDate: year ? `${year}-01-01` : '' });
                    }}
                    className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors"
                  >
                    <option value="">{t('asset.yearPlaceholder')}</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">{t('asset.purchasePrice')}</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('asset.currency')}</label>
                <select
                  value={formData.purchaseCurrency}
                  onChange={(e) => setFormData({ ...formData, purchaseCurrency: e.target.value })}
                  className="w-full h-12 px-4 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors"
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
              <label className="block text-sm font-medium mb-2">
                {t('asset.description')}
                <InfoTooltip content={t('tooltip.description')} />
              </label>
              <textarea
                rows={4}
                placeholder={t('asset.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-border dark:border-border/50 bg-background focus:border-foreground dark:focus:border-orange/60 focus:outline-none transition-colors resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {t('asset.descriptionHint')}
              </p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="border border-border dark:border-border/50 card-hover-glow">
          <div className="px-6 py-4 border-b border-border dark:border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
              <div>
                <h2 className="font-medium">
                  {t('documents.title')}
                  <InfoTooltip content={t('tooltip.documents')} />
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{t('documents.blockchainNote')}</p>
              </div>
            </div>
            {isEditing && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xls,.xlsx"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="h-9 px-4 text-sm border border-border dark:border-border/50 hover:border-foreground dark:hover:border-orange/40 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('documents.uploading')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      {t('documents.upload')}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="p-6">
            {!isEditing ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('documents.saveFirst')}</p>
            ) : documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('documents.empty')}</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 border border-border dark:border-border/50 hover:border-foreground/20 dark:hover:border-orange/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.originalFileName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatFileSize(doc.fileSize)}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1 truncate" title={doc.fileHash}>
                          {t('documents.hash')}: {doc.fileHash.slice(0, 8)}...{doc.fileHash.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                      {doc.contentType?.startsWith('image/') && (
                        <button
                          type="button"
                          onClick={() => window.open(`${import.meta.env.VITE_API_URL || ''}/api/documents/${doc.id}/download`, '_blank')}
                          className="h-8 px-3 text-xs border border-blue-500/30 hover:border-blue-500 text-blue-500/70 hover:text-blue-500 transition-colors"
                        >
                          {t('documents.view') || 'View'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => assetsService.downloadDocument(doc.id)}
                        className="h-8 px-3 text-xs border border-border dark:border-border/50 hover:border-foreground dark:hover:border-orange/40 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t('documents.download')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="h-8 px-3 text-xs border border-red-500/30 hover:border-red-500 text-red-500/70 hover:text-red-500 transition-colors"
                      >
                        {t('documents.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Blockchain Notice */}
        <div className="border border-border dark:border-purple/30 bg-foreground/[0.02] dark:bg-purple/5 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-border dark:border-purple/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-muted-foreground dark:text-purple-light" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="font-medium dark:text-purple-light">{t('asset.blockchainRecord')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('asset.blockchainRecordDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border/50">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-12 px-6 border border-border dark:border-border/50 hover:border-foreground dark:hover:border-orange/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('common.cancel')}
          </button>
          <Button type="submit" className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('common.saving')}
              </span>
            ) : isEditing ? t('asset.saveChanges') : t('asset.createAsset')}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default AssetFormPage;
