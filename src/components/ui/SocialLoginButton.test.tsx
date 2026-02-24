import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SocialLoginButton } from './SocialLoginButton';

describe('SocialLoginButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Google Provider', () => {
    it('renders Google login button correctly', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Continue with Google');
      expect(button).toHaveTextContent('Continue with Google');
      expect(button).not.toBeDisabled();
    });

    it('shows loading state for Google', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Signing in with Google...');
      expect(button).toBeDisabled();
      expect(screen.getByText('Signing in with Google...')).toBeInTheDocument();
    });

    it('calls onClick when Google button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation for Google button', async () => {
      const user = userEvent.setup();
      
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      mockOnClick.mockClear();

      await user.keyboard(' ');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Facebook Provider', () => {
    it('renders Facebook login button correctly', () => {
      render(
        <SocialLoginButton
          provider="facebook"
          isLoading={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Continue with Facebook');
      expect(button).toHaveTextContent('Continue with Facebook');
      expect(button).not.toBeDisabled();
    });

    it('shows loading state for Facebook', () => {
      render(
        <SocialLoginButton
          provider="facebook"
          isLoading={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Signing in with Facebook...');
      expect(button).toBeDisabled();
    });

    it('applies Facebook-specific styling', () => {
      render(
        <SocialLoginButton
          provider="facebook"
          isLoading={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-[#1877f2]', 'text-white');
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup();
      
      render(
        <SocialLoginButton
          provider="google"
          isLoading={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Content', () => {
    it('renders custom children when provided', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
        >
          Custom Google Login
        </SocialLoginButton>
      );

      expect(screen.getByText('Custom Google Login')).toBeInTheDocument();
    });

    it('renders custom loading content when loading', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={true}
          onClick={mockOnClick}
        >
          Custom loading...
        </SocialLoginButton>
      );

      expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Continue with Google');
      expect(button).toHaveAttribute('aria-disabled', 'false');
    });

    it('has proper focus styles', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
    });

    it('announces loading state to screen readers', () => {
      render(
        <SocialLoginButton
          provider="google"
          isLoading={true}
          onClick={mockOnClick}
        />
      );

      const liveRegion = screen.getByText('Signing in with Google...');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });
});