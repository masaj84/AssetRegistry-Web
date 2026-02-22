import { useState, useEffect, useCallback } from 'react';
import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useLanguage } from '../../context/LanguageContext';
import { hasConsent } from '../legal/cookieUtils';
import { hasSeenOnboarding, markOnboardingComplete } from './onboardingUtils';

export function OnboardingTour() {
  const { t } = useLanguage();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Check if should start onboarding
  useEffect(() => {
    const checkAndStart = () => {
      // Only start if:
      // 1. Cookie consent has been given
      // 2. User hasn't seen onboarding
      // 3. Small delay to let page render
      if (hasConsent() && !hasSeenOnboarding()) {
        setTimeout(() => {
          setRun(true);
        }, 1000);
      }
    };

    checkAndStart();

    // Listen for cookie consent changes
    const handleConsentChange = () => {
      if (!hasSeenOnboarding()) {
        setTimeout(() => {
          setRun(true);
        }, 500);
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-[#00d4aa]">
            {t('onboarding.welcome')}
          </h3>
          <p className="text-gray-300">{t('onboarding.welcomeDesc')}</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.add-asset-btn',
      content: t('onboarding.addAsset'),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.assets-list',
      content: t('onboarding.assetsList'),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '.nav-blockchain',
      content: t('onboarding.blockchainMonitor'),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '.nav-profile',
      content: t('onboarding.profile'),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-[#00d4aa]">
            {t('onboarding.doneTitle')}
          </h3>
          <p className="text-gray-300">{t('onboarding.done')}</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, action, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      markOnboardingComplete();
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Update step index
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }
  }, []);

  // Don't render if not running
  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      spotlightClicks
      callback={handleJoyrideCallback}
      locale={{
        back: t('onboarding.back'),
        close: t('onboarding.finish'),
        last: t('onboarding.finish'),
        next: t('onboarding.next'),
        skip: t('onboarding.skip'),
      }}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#00d4aa',
          backgroundColor: '#1a1a2e',
          textColor: '#e0e0e0',
          arrowColor: '#1a1a2e',
        },
        tooltip: {
          backgroundColor: '#1a1a2e',
          borderRadius: 8,
          border: '1px solid #00d4aa',
          color: '#e0e0e0',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipTitle: {
          color: '#00d4aa',
        },
        tooltipContent: {
          padding: '12px 0',
        },
        buttonNext: {
          backgroundColor: '#00d4aa',
          color: '#1a1a2e',
          fontWeight: 600,
          borderRadius: 4,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#00d4aa',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#888',
        },
        spotlight: {
          backgroundColor: 'rgba(0, 212, 170, 0.15)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
    />
  );
}

export default OnboardingTour;
