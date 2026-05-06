import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { carTimelineService } from '../../services/carTimelineService';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import {
  CAR_TIMELINE_EVENT_TYPES,
  type CarTimelineEntry,
  type CarTimelineEventType,
} from '../../types/timeline';

interface CarTimelineProps {
  carId: string;
  currentMileage?: number | null;
  onMileageBumped?: (newMileage: number) => void;
}

interface FormState {
  type: CarTimelineEventType;
  description: string;
  mileage: string;
  workshop: string;
  occurredAt: string; // YYYY-MM-DD
}

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const emptyForm = (): FormState => ({
  type: 'SERVICE',
  description: '',
  mileage: '',
  workshop: '',
  occurredAt: todayIso(),
});

export function CarTimeline({ carId, currentMileage, onMileageBumped }: CarTimelineProps) {
  const { t, language } = useLanguage();
  const [entries, setEntries] = useState<CarTimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const data = await carTimelineService.list(carId);
        if (!cancelled) setEntries(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [carId]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.description.trim()) {
      setError(t('app.cars.timeline.error.description'));
      return;
    }

    const mileageInt = form.mileage ? parseInt(form.mileage, 10) : null;
    const occurredAtIso = form.occurredAt
      ? new Date(`${form.occurredAt}T12:00:00Z`).toISOString()
      : null;

    try {
      setIsSubmitting(true);
      const created = await carTimelineService.add(carId, {
        type: form.type,
        description: form.description.trim(),
        mileage: mileageInt,
        workshop: form.workshop.trim() || null,
        occurredAt: occurredAtIso,
      });
      setEntries((prev) => [created, ...prev]);
      if (
        mileageInt != null &&
        (currentMileage == null || mileageInt > currentMileage) &&
        onMileageBumped
      ) {
        onMileageBumped(mileageInt);
      }
      setForm(emptyForm());
      setShowForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t('app.cars.timeline.title')}
        </h2>
        <Button
          type="button"
          size="sm"
          variant={showForm ? 'ghost' : 'primary'}
          onClick={() => {
            setShowForm((prev) => !prev);
            setError('');
          }}
        >
          {showForm ? t('app.cars.timeline.cancel') : t('app.cars.timeline.add')}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 mb-5 pb-5 border-b border-border">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                {t('app.cars.timeline.field.type')}
              </label>
              <select
                value={form.type}
                onChange={handleChange('type')}
                className="w-full h-9 px-2 border border-border bg-background text-sm focus:border-foreground outline-none"
              >
                {CAR_TIMELINE_EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`app.cars.timeline.type.${type}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                {t('app.cars.timeline.field.occurredAt')}
              </label>
              <input
                type="date"
                value={form.occurredAt}
                onChange={handleChange('occurredAt')}
                max={todayIso()}
                className="w-full h-9 px-2 border border-border bg-background text-sm font-mono focus:border-foreground outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              {t('app.cars.timeline.field.description')} *
            </label>
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              rows={2}
              maxLength={2000}
              required
              placeholder={t('app.cars.timeline.field.description.placeholder')}
              className="w-full px-2 py-2 border border-border bg-background text-sm focus:border-foreground outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                {t('app.cars.timeline.field.mileage')}
              </label>
              <input
                type="number"
                value={form.mileage}
                onChange={handleChange('mileage')}
                min={0}
                placeholder="km"
                className="w-full h-9 px-2 border border-border bg-background text-sm font-mono focus:border-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                {t('app.cars.timeline.field.workshop')}
              </label>
              <input
                type="text"
                value={form.workshop}
                onChange={handleChange('workshop')}
                maxLength={200}
                placeholder={t('app.cars.timeline.field.workshop.placeholder')}
                className="w-full h-9 px-2 border border-border bg-background text-sm focus:border-foreground outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? '...' : t('app.cars.timeline.save')}
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground italic">{t('common.loading')}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          {t('app.cars.timeline.empty')}
        </p>
      ) : (
        <ol className="space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex gap-3 py-2 border-l-2 border-foreground/30 pl-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                    {t(`app.cars.timeline.type.${entry.type}`)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatDate(entry.occurredAt)}
                  </span>
                  {entry.mileage != null && (
                    <span className="text-xs text-muted-foreground font-mono">
                      · {entry.mileage.toLocaleString('pl-PL')} km
                    </span>
                  )}
                </div>
                <p className="text-sm">{entry.description}</p>
                {entry.workshop && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {entry.workshop}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
