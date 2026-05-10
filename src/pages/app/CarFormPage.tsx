import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { carAssetsService } from '../../services/carAssetsService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { CreateCarAssetRequest } from '../../types/carAsset';

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/i;
const currentYear = new Date().getFullYear();

interface FormState {
  vin: string;
  make: string;
  model: string;
  year: string;
  color: string;
  mileage: string;
  location: string;
  bookValue: string;
}

const emptyForm: FormState = {
  vin: '',
  make: '',
  model: '',
  year: String(currentYear),
  color: '',
  mileage: '',
  location: '',
  bookValue: '',
};

export default function CarFormPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [vinError, setVinError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      loadCar(id);
    }
  }, [id, isEdit]);

  const loadCar = async (carId: string) => {
    try {
      setIsLoading(true);
      const car = await carAssetsService.getById(carId);
      setForm({
        vin: car.vin,
        make: car.make,
        model: car.model,
        year: String(car.year),
        color: car.color ?? '',
        mileage: car.mileage != null ? String(car.mileage) : '',
        location: car.location ?? '',
        bookValue: car.bookValue != null ? String(car.bookValue) : '',
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (field === 'vin') setVinError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVinError('');

    if (!isEdit && !VIN_RE.test(form.vin)) {
      setVinError(t('app.cars.help.vin'));
      return;
    }

    const yearInt = parseInt(form.year, 10);
    const mileageInt = form.mileage ? parseInt(form.mileage, 10) : null;
    const bookValueNum = form.bookValue ? parseFloat(form.bookValue) : null;

    try {
      setIsSubmitting(true);
      if (isEdit && id) {
        await carAssetsService.update(id, {
          color: form.color || null,
          mileage: mileageInt,
          location: form.location || null,
          bookValue: bookValueNum,
        });
      } else {
        const payload: CreateCarAssetRequest = {
          vin: form.vin.toUpperCase(),
          make: form.make.trim(),
          model: form.model.trim(),
          year: yearInt,
          color: form.color || null,
          mileage: mileageInt,
          location: form.location || null,
          bookValue: bookValueNum,
        };
        await carAssetsService.create(payload);
      }
      navigate('/app/cars');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link to="/app/cars" className="text-sm text-muted-foreground hover:text-foreground">
          ← {t('app.cars')}
        </Link>
        <h1 className="text-2xl font-light mt-2">{isEdit ? t('app.cars.edit') : t('app.cars.new')}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info card */}
        <div className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t('app.cars.section.basic')}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.vin')}</label>
              <input
                type="text"
                value={form.vin}
                onChange={handleChange('vin')}
                disabled={isEdit}
                maxLength={17}
                placeholder="WBA3A5C50DF123456"
                required
                className="w-full h-10 px-3 border border-border bg-background text-sm font-mono uppercase focus:border-foreground outline-none disabled:opacity-60"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('app.cars.help.vin')}</p>
              {vinError && <p className="text-xs text-destructive mt-1">{vinError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.make')}</label>
                <input
                  type="text"
                  value={form.make}
                  onChange={handleChange('make')}
                  disabled={isEdit}
                  placeholder="BMW"
                  required
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.model')}</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={handleChange('model')}
                  disabled={isEdit}
                  placeholder="320i F30"
                  required
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.year')}</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={handleChange('year')}
                  disabled={isEdit}
                  min={1900}
                  max={currentYear + 1}
                  required
                  className="w-full h-10 px-3 border border-border bg-background text-sm font-mono focus:border-foreground outline-none disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.mileage')}</label>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={handleChange('mileage')}
                  min={0}
                  placeholder="87432"
                  className="w-full h-10 px-3 border border-border bg-background text-sm font-mono focus:border-foreground outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.color')}</label>
                <input
                  type="text"
                  value={form.color}
                  onChange={handleChange('color')}
                  placeholder="Mineral Grey"
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Purchase / dealership info */}
        <div className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t('app.cars.section.purchase')}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.location')}</label>
              <input
                type="text"
                value={form.location}
                onChange={handleChange('location')}
                placeholder="Wrocław"
                className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('app.cars.field.bookValue')}</label>
              <input
                type="number"
                value={form.bookValue}
                onChange={handleChange('bookValue')}
                min={0}
                step="0.01"
                placeholder="85000"
                className="w-full h-10 px-3 border border-border bg-background text-sm font-mono focus:border-foreground outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link to="/app/cars">
            <Button type="button" variant="ghost">
              {t('app.cars.cancel')}
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '...' : t('app.cars.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
