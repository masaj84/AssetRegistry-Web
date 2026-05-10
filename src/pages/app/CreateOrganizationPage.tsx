import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { organizationsService } from '../../services/organizationsService';
import { getErrorMessage } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { OrganizationTypeEnum, type OrganizationTypeKey } from '../../types';

const TYPE_OPTIONS: OrganizationTypeKey[] = [
  'DEALERSHIP',
  'LEASING',
  'NOTARY',
  'INSURANCE',
  'AUCTION',
  'GALLERY',
  'REAL_ESTATE',
  'MARINA',
  'OTHER',
];

interface FormState {
  name: string;
  type: OrganizationTypeKey;
  taxId: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

const emptyForm: FormState = {
  name: '',
  type: 'DEALERSHIP',
  taxId: '',
  address: '',
  contactEmail: '',
  contactPhone: '',
};

export default function CreateOrganizationPage() {
  const { t } = useLanguage();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError(t('app.org.create.error.name'));
      return;
    }

    try {
      setIsSubmitting(true);
      await organizationsService.create({
        name: form.name.trim(),
        type: OrganizationTypeEnum[form.type],
        taxId: form.taxId.trim() || null,
        address: form.address.trim() || null,
        contactEmail: form.contactEmail.trim() || null,
        contactPhone: form.contactPhone.trim() || null,
      });
      // Tokens already swapped by service; refresh user so AppLayout picks up org_id
      await refreshUser();
      navigate('/app/cars');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-light">{t('app.org.create.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('app.org.create.subtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t('app.org.create.section.basic')}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t('app.org.create.field.name')} *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder={t('app.org.create.field.name.placeholder')}
                required
                maxLength={200}
                className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t('app.org.create.field.type')} *
              </label>
              <select
                value={form.type}
                onChange={handleChange('type')}
                className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(`app.org.type.${opt}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('app.org.create.field.taxId')}
                </label>
                <input
                  type="text"
                  value={form.taxId}
                  onChange={handleChange('taxId')}
                  placeholder="PL1234567890"
                  maxLength={50}
                  className="w-full h-10 px-3 border border-border bg-background text-sm font-mono focus:border-foreground outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('app.org.create.field.address')}
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={handleChange('address')}
                  placeholder="Wrocław, ul. ..."
                  maxLength={500}
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('app.org.create.field.contactEmail')}
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={handleChange('contactEmail')}
                  placeholder="kontakt@salon.pl"
                  maxLength={256}
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('app.org.create.field.contactPhone')}
                </label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={handleChange('contactPhone')}
                  placeholder="+48 ..."
                  maxLength={50}
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:border-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '...' : t('app.org.create.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
