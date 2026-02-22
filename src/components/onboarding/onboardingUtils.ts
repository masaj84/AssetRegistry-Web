const ONBOARDING_KEY = 'trve_onboarding_complete';

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function markOnboardingComplete(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function resetOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY);
}
