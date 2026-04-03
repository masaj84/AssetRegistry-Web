import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CarAssetsPage from './CarAssetsPage';
import { carAssetsService } from '../../services/carAssetsService';
import type { CarAsset } from '../../types';

// Mock the service
vi.mock('../../services/carAssetsService');
const mockCarAssetsService = vi.mocked(carAssetsService);

// Mock the context
vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

describe('CarAssetsPage', () => {
  const mockCarAssets: CarAsset[] = [
    {
      id: '1',
      vin: 'WBAXX12345XX00001',
      make: 'BMW',
      model: '320i',
      year: 2023,
      color: 'Black',
      mileage: 15000,
      status: 'AVAILABLE',
      location: 'Wrocław HQ',
      bookValue: 180000,
      residualValue: 120000,
      organizationId: 1,
      organizationName: 'Test Leasing Company',
      createdAt: '2026-04-03T16:00:00Z',
      updatedAt: '2026-04-03T16:00:00Z',
    },
    {
      id: '2',
      vin: 'WAUXX12345XX00002',
      make: 'Audi',
      model: 'A4',
      year: 2022,
      color: 'Silver',
      mileage: 25000,
      status: 'LEASED',
      location: 'Kraków Branch',
      bookValue: 160000,
      residualValue: 95000,
      currentLessee: 'ABC Transport Ltd',
      organizationId: 1,
      organizationName: 'Test Leasing Company',
      createdAt: '2026-04-03T15:00:00Z',
      updatedAt: '2026-04-03T15:00:00Z',
    },
    {
      id: '3',
      vin: 'WMWXX12345XX00004',
      make: 'MINI',
      model: 'Cooper S',
      year: 2023,
      color: 'Red',
      mileage: 12000,
      status: 'IN_SERVICE',
      location: 'Service Center',
      bookValue: 120000,
      residualValue: 85000,
      organizationId: 1,
      organizationName: 'Test Leasing Company',
      createdAt: '2026-04-03T14:00:00Z',
      updatedAt: '2026-04-03T14:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockCarAssetsService.getCarAssets.mockResolvedValue(mockCarAssets);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  describe('Loading and Data Display', () => {
    it('should show loading state initially', async () => {
      // Mock delayed response
      mockCarAssetsService.getCarAssets.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockCarAssets), 100))
      );

      renderWithRouter(<CarAssetsPage />);

      expect(screen.getByText('Fleet Management')).toBeInTheDocument();
      // Check for loading animation
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should display car assets after loading', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
        expect(screen.getByText('Audi A4')).toBeInTheDocument();
        expect(screen.getByText('MINI Cooper S')).toBeInTheDocument();
      });

      expect(mockCarAssetsService.getCarAssets).toHaveBeenCalledTimes(1);
    });

    it('should show error state when API fails', async () => {
      mockCarAssetsService.getCarAssets.mockRejectedValue(new Error('API Error'));

      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('API Error')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('should retry loading when Try Again is clicked', async () => {
      mockCarAssetsService.getCarAssets
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce(mockCarAssets);

      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Try Again'));

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      });

      expect(mockCarAssetsService.getCarAssets).toHaveBeenCalledTimes(2);
    });
  });

  describe('Statistics Display', () => {
    it('should show correct fleet statistics', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Total Fleet
        expect(screen.getByText('1')).toBeInTheDocument(); // Available (BMW)
        expect(screen.getByText('1')).toBeInTheDocument(); // Leased (Audi)
      });

      // Check total value calculation
      const totalValue = 180000 + 160000 + 120000; // 460,000 PLN
      expect(screen.getByText('460 000,00 zł')).toBeInTheDocument();
    });

    it('should show Add Vehicle button', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('Add Vehicle')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Vehicle').closest('a');
      expect(addButton).toHaveAttribute('href', '/app/cars/add');
    });
  });

  describe('Search and Filter', () => {
    it('should filter cars by search term', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
        expect(screen.getByText('Audi A4')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'BMW' } });

      // BMW should be visible, Audi should not
      expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();
    });

    it('should filter by VIN', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'WBAXX12345XX00001' } });

      expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();
    });

    it('should filter by status', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
        expect(screen.getByText('Audi A4')).toBeInTheDocument();
      });

      const statusFilter = screen.getByDisplayValue('All Statuses');
      fireEvent.change(statusFilter, { target: { value: 'LEASED' } });

      expect(screen.queryByText('BMW 320i')).not.toBeInTheDocument();
      expect(screen.getByText('Audi A4')).toBeInTheDocument(); // Only leased car
    });

    it('should show no results message when no cars match filter', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'NonExistentCar' } });

      expect(screen.getByText('No vehicles found')).toBeInTheDocument();
      expect(screen.queryByText('BMW 320i')).not.toBeInTheDocument();
    });
  });

  describe('Car Details Display', () => {
    it('should show car details in table', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        // Check VIN display
        expect(screen.getByText('WBAXX12345XX00001')).toBeInTheDocument();
        expect(screen.getByText('WAUXX12345XX00002')).toBeInTheDocument();

        // Check status badges
        expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
        expect(screen.getByText('LEASED')).toBeInTheDocument();
        expect(screen.getByText('IN SERVICE')).toBeInTheDocument();

        // Check locations
        expect(screen.getByText('Wrocław HQ')).toBeInTheDocument();
        expect(screen.getByText('Kraków Branch')).toBeInTheDocument();

        // Check formatted values
        expect(screen.getByText('180 000,00 zł')).toBeInTheDocument();
        expect(screen.getByText('160 000,00 zł')).toBeInTheDocument();
      });
    });

    it('should show car details with year, color, and mileage', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('2023 • Black • 15,000 km')).toBeInTheDocument();
        expect(screen.getByText('2022 • Silver • 25,000 km')).toBeInTheDocument();
        expect(screen.getByText('2023 • Red • 12,000 km')).toBeInTheDocument();
      });
    });

    it('should show action links for each car', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        const viewLinks = screen.getAllByText('View');
        const editLinks = screen.getAllByText('Edit');

        expect(viewLinks).toHaveLength(3);
        expect(editLinks).toHaveLength(3);

        // Check first car's links
        expect(viewLinks[0].closest('a')).toHaveAttribute('href', '/app/cars/1');
        expect(editLinks[0].closest('a')).toHaveAttribute('href', '/app/cars/1/edit');
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no cars exist', async () => {
      mockCarAssetsService.getCarAssets.mockResolvedValue([]);

      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('No vehicles found')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument(); // Total Fleet should be 0
      });
    });
  });

  describe('Status Color Coding', () => {
    it('should apply correct CSS classes for status badges', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        const availableBadge = screen.getByText('AVAILABLE');
        const leasedBadge = screen.getByText('LEASED');
        const inServiceBadge = screen.getByText('IN SERVICE');

        expect(availableBadge).toHaveClass('bg-green-100', 'text-green-800');
        expect(leasedBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
        expect(inServiceBadge).toHaveClass('bg-blue-100', 'text-blue-800');
      });
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency values correctly', async () => {
      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        // Test Polish currency formatting
        expect(screen.getByText('180 000,00 zł')).toBeInTheDocument();
        expect(screen.getByText('160 000,00 zł')).toBeInTheDocument();
        expect(screen.getByText('120 000,00 zł')).toBeInTheDocument();

        // Test total value calculation
        expect(screen.getByText('460 000,00 zł')).toBeInTheDocument();
      });
    });

    it('should handle undefined values gracefully', async () => {
      const carWithoutValue: CarAsset = {
        ...mockCarAssets[0],
        bookValue: undefined,
      };

      mockCarAssetsService.getCarAssets.mockResolvedValue([carWithoutValue]);

      renderWithRouter(<CarAssetsPage />);

      await waitFor(() => {
        expect(screen.getByText('-')).toBeInTheDocument();
      });
    });
  });
});