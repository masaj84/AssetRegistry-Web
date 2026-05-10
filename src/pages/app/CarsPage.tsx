import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { carAssetsService } from '../../services/carAssetsService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import type { CarAsset } from '../../types/carAsset';

const statusVariants: Record<string, 'success' | 'warning' | 'default'> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  IN_SERVICE: 'warning',
  LEASED: 'default',
  SOLD: 'default',
  DAMAGED: 'default',
};

export default function CarsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cars, setCars] = useState<CarAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const data = await carAssetsService.getAll();
      setCars(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cars.filter((c) => {
      const matchesSearch =
        q === '' ||
        c.vin.toLowerCase().includes(q) ||
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cars, search, statusFilter]);

  const formatMileage = (mileage?: number | null) =>
    mileage != null ? `${mileage.toLocaleString('pl-PL')} km` : '—';

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-light mb-1">{t('app.cars')}</h1>
          <p className="text-sm text-muted-foreground">{t('app.cars.subtitle')}</p>
        </div>
        <Link to="/app/cars/new">
          <Button>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            {t('app.cars.add')}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('app.cars.search')}
          className="flex-1 min-w-[200px] h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none min-w-[180px]"
        >
          <option value="all">{t('app.cars.filterStatus')}</option>
          {(['AVAILABLE', 'RESERVED', 'IN_SERVICE', 'LEASED', 'SOLD', 'DAMAGED'] as const).map((s) => (
            <option key={s} value={s}>
              {t(`app.cars.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t('common.loading')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">{t('app.cars.empty')}</p>
          <Link to="/app/cars/new">
            <Button>{t('app.cars.add')}</Button>
          </Link>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-foreground/[0.02]">
                <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  {t('app.cars.column.car')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  {t('app.cars.column.vin')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  {t('app.cars.column.year')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  {t('app.cars.column.mileage')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  {t('app.cars.column.status')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  {t('app.cars.column.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((car) => (
                <tr
                  key={car.id}
                  className="border-b border-border last:border-0 hover:bg-foreground/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {car.make} {car.model}
                    </div>
                    {car.color && <div className="text-xs text-muted-foreground">{car.color}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{car.vin}</td>
                  <td className="px-4 py-3">{car.year}</td>
                  <td className="px-4 py-3 font-mono text-xs">{formatMileage(car.mileage)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[car.status] ?? 'default'}>
                      {t(`app.cars.status.${car.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/app/cars/${car.id}`}>
                      <Button variant="ghost" size="sm">
                        {t('app.cars.detail')}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          {filtered.length} / {cars.length}
        </p>
      )}
    </div>
  );
}
