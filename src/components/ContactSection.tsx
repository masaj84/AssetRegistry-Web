import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useLanguage } from '../context/LanguageContext';
import { newsletterService, getErrorMessage } from '../services/newsletterService';

export function ContactSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      await newsletterService.subscribe(email);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert(getErrorMessage(error) || t('newsletter.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 border-t border-border dark:border-border/50 relative overflow-hidden" id="contact">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      {/* Dark mode ambient glows */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple/10 rounded-full blur-[100px] block" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-orange/10 rounded-full blur-[100px] block" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header - centered */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex-1 h-px bg-border bg-gradient-to-r to-orange/30 max-w-24" />
            <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground text-orange/70">
              {t('contact.sectionTitle')}
            </h2>
            <div className="flex-1 h-px bg-border bg-gradient-to-r from-purple/30 max-w-24" />
          </div>
          <p className="text-3xl md:text-4xl font-light max-w-2xl mx-auto">
            {t('contact.headline')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Left - Contact */}
          <div className="border border-border border-purple/30 p-8 md:p-12 relative group hover:border-purple transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 border border-border border-purple/40 flex items-center justify-center text-purple-light">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground text-purple-light/70">
                {t('contact.questions')}
              </p>
            </div>

            <h3 className="text-2xl md:text-3xl font-light mb-4">
              {t('contact.writeUs')}
            </h3>
            <p className="text-muted-foreground mb-8">
              {t('contact.response')}
            </p>

            {/* Email link with modern style */}
            <a
              href={`mailto:${t('contact.emailAddress')}`}
              className="group/link inline-flex items-center gap-3 p-4 border border-border border-purple/30 hover:border-purple hover:bg-foreground/[0.02] hover:bg-purple/10 transition-all"
            >
              <div className="w-8 h-8 border border-foreground/20 border-purple/40 group-hover/link:border-foreground group-hover/link:border-purple flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 group-hover/link:text-purple-light" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <span className="font-medium group-hover/link:text-purple-light">{t('contact.emailAddress')}</span>
            </a>

            {/* Status indicator */}
            <div className="mt-8 pt-6 border-t border-border dark:border-border/50 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 bg-purple rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                {t('contact.status')}
              </span>
            </div>
          </div>

          {/* Right - Newsletter */}
          <div className="border border-orange/40 p-8 md:p-12 relative bg-gradient-to-br from-foreground/[0.02] from-orange/[0.05] to-transparent shadow-[0_0_40px_rgba(251,146,60,0.1)] overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-orange/20" />
            {/* Glow in corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange/20 rounded-full blur-[60px] block" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 border border-orange flex items-center justify-center bg-gradient-to-br from-orange to-orange-dark text-background">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground text-orange/70">
                {t('newsletter.title')}
              </p>
            </div>

            <h3 className="text-2xl md:text-3xl font-light mb-4">
              {t('newsletter.stayUpdated')}
            </h3>
            <p className="text-muted-foreground mb-8">
              {t('newsletter.newsDesc')}
            </p>

            {subscribed ? (
              <div className="p-6 border border-green-500/30 border-orange/40 bg-green-500/[0.05] bg-orange/10">
                <div className="flex items-center gap-3 text-green-600 text-orange">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">{t('newsletter.success')}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder={t('newsletter.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pr-4 border-orange/30 focus:border-orange"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="h-12 px-8 whitespace-nowrap bg-gradient-to-r from-orange to-orange-dark text-white border-0 hover:shadow-[0_0_20px_rgba(251,146,60,0.4)]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('newsletter.submitting')}
                      </span>
                    ) : (
                      t('newsletter.submit')
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  {t('newsletter.privacy')}
                </p>
              </form>
            )}

            {/* Features list */}
            <div className="mt-8 pt-6 border-t border-border border-orange/20 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {t('newsletter.feature1')}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {t('newsletter.feature2')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
