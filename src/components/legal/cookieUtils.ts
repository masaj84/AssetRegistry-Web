const COOKIE_CONSENT_KEY = 'trve_cookie_consent';

export type ConsentLevel = 'all' | 'essential' | null;

export function hasConsent(): boolean {
  return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
}

export function getConsentLevel(): ConsentLevel {
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === 'all' || value === 'essential') return value;
  return null;
}

export function setConsent(level: 'all' | 'essential'): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, level);
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: level }));
}
