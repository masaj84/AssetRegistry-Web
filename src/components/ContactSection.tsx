import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useLanguage } from '../context/LanguageContext';
import { newsletterService, getErrorMessage } from '../services/newsletterService';

// Minimalist icons (jak w LandingPage)
const Icons = {
  mail: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  newsletter: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
};

export function ContactSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      await newsletterService.subscribe(email);
      alert(t('newsletter.success'));
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert(getErrorMessage(error) || t('newsletter.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 border-t border-border" id="contact">
      <div className="max-w-7xl mx-auto">
        {/* SectionHeader style */}
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              {t('contact.sectionTitle')}
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Lewa strona - email kontaktowy */}
          <div className="border border-border p-8 md:p-12">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6">
              {t('contact.questions')}
            </p>
            <h3 className="text-2xl font-light mb-6">
              {t('contact.writeUs')}
            </h3>
            <div className="flex items-start gap-4">
              <div className="text-muted-foreground flex-shrink-0">{Icons.mail}</div>
              <div>
                <h4 className="font-medium mb-1">{t('contact.email')}</h4>
                <p className="text-muted-foreground text-sm mb-2">{t('contact.response')}</p>
                <a
                  href={`mailto:${t('contact.emailAddress')}`}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {t('contact.emailAddress')}
                </a>
              </div>
            </div>
          </div>

          {/* Prawa strona - newsletter */}
          <div className="border border-border p-8 md:p-12">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6">
              {t('newsletter.title')}
            </p>
            <h3 className="text-2xl font-light mb-6">
              {t('newsletter.stayUpdated')}
            </h3>
            <div className="flex items-start gap-4 mb-8">
              <div className="text-muted-foreground flex-shrink-0">{Icons.newsletter}</div>
              <div>
                <h4 className="font-medium mb-1">{t('newsletter.news')}</h4>
                <p className="text-muted-foreground text-sm">{t('newsletter.newsDesc')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="px-6 whitespace-nowrap"
                >
                  {isSubmitting ? t('newsletter.submitting') : t('newsletter.submit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}