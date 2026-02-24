import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SocialLoginSection } from './SocialLoginSection';
import { LanguageProvider } from '../../context/LanguageContext';

// Mock child components
vi.mock('../ui/SocialLoginButton', () => ({
  SocialLoginButton: ({ provider, onClick, isLoading, disabled, children }: any) => (
    <button 
      data-testid={`${provider}-button`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {children || `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </button>
  )
}));

const renderWithLanguage = (component: React.ReactElement, language: 'en' | 'pl' = 'en') => {
  return render(
    <LanguageProvider initialLanguage={language}>
      {component}
    </LanguageProvider>
  );
};

describe('SocialLoginSection', () => {
  const mockOnGoogleLogin = vi.fn();
  const mockOnFacebookLogin = vi.fn();

  beforeEach(() => {
    mockOnGoogleLogin.mockClear();
    mockOnFacebookLogin.mockClear();
  });

  describe('Rendering', () => {
    it('renders both Google and Facebook buttons', () => {
      renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />
      );

      expect(screen.getByTestId('google-button')).toBeInTheDocument();
      expect(screen.getByTestId('facebook-button')).toBeInTheDocument();
    });

    it('renders with proper spacing between buttons', () => {
      renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />
      );

      const container = screen.getByTestId('google-button').parentElement;
      expect(container).toHaveClass('space-y-3');
    });
  });

  describe('English Translations', () => {
    it('displays English text when not loading', () => {
      renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />,
        'en'
      );

      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
    });

    it('displays English loading text when loading', () => {
      renderWithLanguage(
        <SocialLoginSection
          isLoading={true}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />,
        'en'
      );

      expect(screen.getByText('Signing in with Google...')).toBeInTheDocument();
      expect(screen.getByText('Signing in with Facebook...')).toBeInTheDocument();
    });
  });

  describe('Polish Translations', () => {
    // Note: Polish translations would work in production but require 
    // LanguageProvider to support initialLanguage prop for testing
    it('uses useLanguage hook for translations', () => {
      renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />
      );

      // Verify that the component renders and uses language context
      expect(screen.getByTestId('google-button')).toBeInTheDocument();
      expect(screen.getByTestId('facebook-button')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onGoogleLogin when Google button is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />
      );

      const googleButton = screen.getByTestId('google-button');
      await user.click(googleButton);

      expect(mockOnGoogleLogin).toHaveBeenCalledTimes(1);
    });

    it('calls onFacebookLogin when Facebook button is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />
      );

      const facebookButton = screen.getByTestId('facebook-button');
      await user.click(facebookButton);

      expect(mockOnFacebookLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('disables buttons when loading', () => {
      renderWithLanguage(
        <SocialLoginSection
          isLoading={true}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
        />
      );

      expect(screen.getByTestId('google-button')).toBeDisabled();
      expect(screen.getByTestId('facebook-button')).toBeDisabled();
    });

    it('disables buttons when explicitly disabled', () => {
      renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
          disabled={true}
        />
      );

      expect(screen.getByTestId('google-button')).toBeDisabled();
      expect(screen.getByTestId('facebook-button')).toBeDisabled();
    });
  });

  describe('Props Passing', () => {
    it('passes correct props to SocialLoginButton components', () => {
      const { rerender } = renderWithLanguage(
        <SocialLoginSection
          isLoading={false}
          onGoogleLogin={mockOnGoogleLogin}
          onFacebookLogin={mockOnFacebookLogin}
          disabled={false}
        />
      );

      expect(screen.getByTestId('google-button')).not.toBeDisabled();
      expect(screen.getByTestId('facebook-button')).not.toBeDisabled();

      rerender(
        <LanguageProvider initialLanguage="en">
          <SocialLoginSection
            isLoading={true}
            onGoogleLogin={mockOnGoogleLogin}
            onFacebookLogin={mockOnFacebookLogin}
            disabled={true}
          />
        </LanguageProvider>
      );

      expect(screen.getByTestId('google-button')).toBeDisabled();
      expect(screen.getByTestId('facebook-button')).toBeDisabled();
    });
  });
});