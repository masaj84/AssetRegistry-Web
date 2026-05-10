import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QrShareCard } from '../../components/QrShareCard';
import { AiSoonCard } from '../../components/AiSoonCard';
import { CarTimeline } from '../../components/app/CarTimeline';
import { carAssetsService } from '../../services/carAssetsService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { CarAsset, CarAssetStatus } from '../../types/carAsset';

const statusVariants: Record<string, 'success' | 'warning' | 'default'> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  IN_SERVICE: 'warning',
  LEASED: 'default',
  SOLD: 'default',
  DAMAGED: 'default',
};

const STATUSES: CarAssetStatus[] = ['AVAILABLE', 'RESERVED', 'IN_SERVICE', 'LEASED', 'SOLD', 'DAMAGED'];

export default function CarDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState<CarAsset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mileageInput, setMileageInput] = useState('');
  const [updatingMileage, setUpdatingMileage] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) loadCar(id);
  }, [id]);

  const loadCar = async (carId: string) => {
    try {
      setIsLoading(true);
      const data = await carAssetsService.getById(carId);
      setCar(data);
      setMileageInput(data.mileage != null ? String(data.mileage) : '');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMileageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    const km = parseInt(mileageInput, 10);
    if (Number.isNaN(km) || km < 0) return;

    try {
      setUpdatingMileage(true);
      const updated = await carAssetsService.update(car.id, { mileage: km });
      setCar(updated);
      setSuccess(t('app.cars.updated'));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingMileage(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!car) return;
    try {
      setUpdatingStatus(true);
      const updated = await carAssetsService.update(car.id, { status });
      setCar(updated);
      setSuccess(t('app.cars.updated'));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!car) return;
    if (!confirm(t('app.cars.deleteConfirm'))) return;
    try {
      await carAssetsService.delete(car.id);
      navigate('/app/cars');
    } catch (err) {
      setError(getErrorMessage(err));
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

  if (!car) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">{error || 'Not found'}</p>
        <Link to="/app/cars">
          <Button variant="ghost">{t('app.cars')}</Button>
        </Link>
      </div>
    );
  }

  const formatMileage = (km?: number | null) => (km != null ? `${km.toLocaleString('pl-PL')} km` : '—');
  const formatDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('pl-PL') : '—');

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link to="/app/cars" className="text-sm text-muted-foreground hover:text-foreground">
          ← {t('app.cars')}
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-3xl font-light mb-1">
            {car.make} {car.model}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-mono">{car.vin}</span>
            <span>·</span>
            <span>{car.year}</span>
            {car.color && (
              <>
                <span>·</span>
                <span>{car.color}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusVariants[car.status] ?? 'default'}>
            {t(`app.cars.status.${car.status}`)}
          </Badge>
          <Link to={`/app/cars/${car.id}/edit`}>
            <Button variant="ghost" size="sm">
              {t('app.cars.edit')}
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 border border-success/40 bg-success/10 text-success text-sm">
          {success}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Mileage update */}
        <div className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t('app.cars.updateMileage')}
          </h2>
          <p className="text-2xl font-mono mb-4">{formatMileage(car.mileage)}</p>
          <form onSubmit={handleMileageUpdate} className="flex gap-2">
            <input
              type="number"
              min={car.mileage ?? 0}
              value={mileageInput}
              onChange={(e) => setMileageInput(e.target.value)}
              placeholder="km"
              className="flex-1 h-10 px-3 border border-border bg-background text-sm font-mono focus:border-foreground outline-none"
            />
            <Button type="submit" disabled={updatingMileage}>
              {updatingMileage ? '...' : t('app.cars.save')}
            </Button>
          </form>
          {car.mileage != null && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              {t('app.cars.help.vin').includes('17') ? '' : ''}
              {/* hint: cannot reduce */}
              ≥ {formatMileage(car.mileage)}
            </p>
          )}
        </div>

        {/* Status changer */}
        <div className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t('app.cars.changeStatus')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                disabled={updatingStatus || status === car.status}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                  status === car.status
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground'
                } disabled:opacity-50`}
              >
                {t(`app.cars.status.${status}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Basic info */}
        <div className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t('app.cars.section.basic')}
          </h2>
          <dl className="space-y-2.5 text-sm">
            <Row label="VIN" value={<span className="font-mono">{car.vin}</span>} />
            <Row label={t('app.cars.field.make')} value={car.make} />
            <Row label={t('app.cars.field.model')} value={car.model} />
            <Row label={t('app.cars.field.year')} value={String(car.year)} />
            {car.color && <Row label={t('app.cars.field.color')} value={car.color} />}
            {car.location && <Row label={t('app.cars.field.location')} value={car.location} />}
            {car.bookValue != null && (
              <Row
                label={t('app.cars.field.bookValue')}
                value={<span className="font-mono">{car.bookValue.toLocaleString('pl-PL')}</span>}
              />
            )}
          </dl>
        </div>

        {/* Blockchain */}
        <div className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t('app.cars.section.blockchain')}
          </h2>
          {car.blockchainAnchoredAt ? (
            <div>
              <Badge variant="success">{t('app.cars.anchored')}</Badge>
              <dl className="mt-3 space-y-2 text-sm">
                <Row
                  label="Anchored at"
                  value={<span className="font-mono text-xs">{formatDate(car.blockchainAnchoredAt)}</span>}
                />
                {car.blockchainHash && (
                  <Row
                    label="Hash"
                    value={
                      <span className="font-mono text-xs break-all">
                        {car.blockchainHash.slice(0, 12)}...{car.blockchainHash.slice(-8)}
                      </span>
                    }
                  />
                )}
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">{t('app.cars.notAnchored')}</p>
          )}
        </div>
      </div>

      {/* AI: Anomaly detector (placeholder) */}
      <div className="mt-5">
        <AiSoonCard
          title={t('app.cars.ai.anomaly.title')}
          description={t('app.cars.ai.anomaly.desc')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
      </div>

      {/* Timeline */}
      <div className="mt-5">
        <CarTimeline
          carId={car.id}
          currentMileage={car.mileage}
          onMileageBumped={(km) => setCar((prev) => (prev ? { ...prev, mileage: km } : prev))}
        />
      </div>

      {/* AI: Sales pitch generator (placeholder) */}
      <div className="mt-5">
        <AiSoonCard
          title={t('app.cars.ai.pitch.title')}
          description={t('app.cars.ai.pitch.desc')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 13.5l-1.875 1.875M6.75 19.5h10.5" />
            </svg>
          }
        />
      </div>

      {/* QR share card */}
      <div className="mt-5">
        <QrShareCard carId={car.id} make={car.make} model={car.model} vin={car.vin} />
      </div>

      {/* Danger zone */}
      <div className="mt-8 pt-6 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive/10"
        >
          {t('app.cars.delete')}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
