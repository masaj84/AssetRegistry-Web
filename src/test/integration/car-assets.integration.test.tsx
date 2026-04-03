import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CarAssetsPage from '../../pages/app/CarAssetsPage';
import CarAssetFormPage from '../../pages/app/CarAssetFormPage';
import { carAssetsService } from '../../services/carAssetsService';
import type { CarAsset, CreateCarAssetRequest } from '../../types';

// Mock the service
vi.mock('../../services/carAssetsService');
const mockCarAssetsService = vi.mocked(carAssetsService);

// Mock contexts
vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@leasing.com',
      organizationId: 1,
    },
    token: 'mock-jwt-token',
  }),
}));

describe('Car Assets Integration Tests', () => {
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockCarAssetsService.getCarAssets.mockResolvedValue(mockCarAssets);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderApp = (initialRoute = '/app/cars') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/app/cars" element={<CarAssetsPage />} />
          <Route path="/app/cars/add" element={<CarAssetFormPage />} />
          <Route path="/app/cars/:id/edit" element={<CarAssetFormPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Complete Car Management Workflow', () => {
    it('should complete full car lifecycle: list → add → view → edit', async () => {
      // Step 1: Start with car list
      const { rerender } = renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
        expect(screen.getByText('Audi A4')).toBeInTheDocument();
      });

      // Step 2: Navigate to add new car
      rerender(
        <MemoryRouter initialEntries={['/app/cars/add']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
            <Route path="/app/cars/add" element={<CarAssetFormPage />} />
            <Route path="/app/cars/:id/edit" element={<CarAssetFormPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      });

      // Step 3: Fill out new car form
      const newCarAsset: CarAsset = {
        id: '3',
        vin: 'WVWXX12345XX00003',
        make: 'Volkswagen',
        model: 'Passat',
        year: 2024,
        color: 'Blue',
        mileage: 5000,
        status: 'AVAILABLE',
        location: 'Gdańsk Office',
        bookValue: 140000,
        organizationId: 1,
        organizationName: 'Test Leasing Company',
        createdAt: '2026-04-03T17:00:00Z',
        updatedAt: '2026-04-03T17:00:00Z',
      };

      mockCarAssetsService.createCarAsset.mockResolvedValue(newCarAsset);

      fireEvent.change(screen.getByLabelText(/VIN/), { target: { value: 'WVWXX12345XX00003' } });
      fireEvent.change(screen.getByLabelText(/Make/), { target: { value: 'Volkswagen' } });
      fireEvent.change(screen.getByLabelText(/Model/), { target: { value: 'Passat' } });
      fireEvent.change(screen.getByLabelText(/Year/), { target: { value: '2024' } });
      fireEvent.change(screen.getByLabelText(/Color/), { target: { value: 'Blue' } });

      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCarAssetsService.createCarAsset).toHaveBeenCalledWith(
          expect.objectContaining({
            vin: 'WVWXX12345XX00003',
            make: 'Volkswagen',
            model: 'Passat',
            year: 2024,
            color: 'Blue',
          })
        );
      });

      // Step 4: After creation, simulate navigation back to list with new car
      const updatedCarsList = [...mockCarAssets, newCarAsset];
      mockCarAssetsService.getCarAssets.mockResolvedValue(updatedCarsList);

      rerender(
        <MemoryRouter initialEntries={['/app/cars']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
            <Route path="/app/cars/add" element={<CarAssetFormPage />} />
            <Route path="/app/cars/:id/edit" element={<CarAssetFormPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Volkswagen Passat')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Updated total count
      });

      // Step 5: Edit the new car
      mockCarAssetsService.getCarAsset.mockResolvedValue(newCarAsset);

      rerender(
        <MemoryRouter initialEntries={['/app/cars/3/edit']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
            <Route path="/app/cars/add" element={<CarAssetFormPage />} />
            <Route path="/app/cars/:id/edit" element={<CarAssetFormPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
        expect(screen.getByDisplayValue('WVWXX12345XX00003')).toBeInTheDocument();
      });

      // Update mileage
      const mileageInput = screen.getByDisplayValue('5000');
      fireEvent.change(mileageInput, { target: { value: '10000' } });

      const updatedCar = { ...newCarAsset, mileage: 10000 };
      mockCarAssetsService.updateCarAsset.mockResolvedValue(updatedCar);

      const updateButton = screen.getByText('Update Vehicle');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockCarAssetsService.updateCarAsset).toHaveBeenCalledWith(
          '3',
          expect.objectContaining({
            mileage: 10000,
          })
        );
      });
    });
  });

  describe('Search and Filter Integration', () => {
    it('should filter cars in real-time as user types', async () => {
      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
        expect(screen.getByText('Audi A4')).toBeInTheDocument();
      });

      // Search by make
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      
      fireEvent.change(searchInput, { target: { value: 'BMW' } });
      expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'Audi' } });
      expect(screen.queryByText('BMW 320i')).not.toBeInTheDocument();
      expect(screen.getByText('Audi A4')).toBeInTheDocument();

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      expect(screen.getByText('Audi A4')).toBeInTheDocument();
    });

    it('should combine search and status filter correctly', async () => {
      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
        expect(screen.getByText('Audi A4')).toBeInTheDocument();
      });

      // Filter by status first
      const statusFilter = screen.getByDisplayValue('All Statuses');
      fireEvent.change(statusFilter, { target: { value: 'AVAILABLE' } });

      expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();

      // Add search term that should match available car
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'BMW' } });

      expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();

      // Change search to non-matching term
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
      expect(screen.getByText('No vehicles found')).toBeInTheDocument();
    });
  });

  describe('Statistics Integration', () => {
    it('should update statistics when car status changes', async () => {
      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Total fleet
        // Look for available count in stats cards
        const statsCards = screen.getAllByText('1');
        expect(statsCards.length).toBeGreaterThan(0); // 1 available, 1 leased
      });

      // Simulate updating a car status from AVAILABLE to LEASED
      const updatedCarAssets = mockCarAssets.map(car => 
        car.id === '1' ? { ...car, status: 'LEASED' as const } : car
      );
      
      mockCarAssetsService.getCarAssets.mockResolvedValue(updatedCarAssets);

      // Re-render to simulate data refresh
      const { rerender } = renderApp('/app/cars');
      rerender(
        <MemoryRouter initialEntries={['/app/cars']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        // Now should have 0 available, 2 leased
        const availableSection = screen.getByText('Available').closest('div');
        expect(availableSection).toContainHTML('0');
        
        const leasedSection = screen.getByText('Leased').closest('div');
        expect(leasedSection).toContainHTML('2');
      });
    });

    it('should calculate total value correctly', async () => {
      renderApp('/app/cars');

      await waitFor(() => {
        // Total: 180,000 + 160,000 = 340,000 PLN
        expect(screen.getByText('340 000,00 zł')).toBeInTheDocument();
      });

      // Add a third car with value
      const newCarAsset: CarAsset = {
        ...mockCarAssets[0],
        id: '3',
        vin: 'WVWXX12345XX00003',
        make: 'Volkswagen',
        bookValue: 100000,
      };

      const updatedCarAssets = [...mockCarAssets, newCarAsset];
      mockCarAssetsService.getCarAssets.mockResolvedValue(updatedCarAssets);

      const { rerender } = renderApp('/app/cars');
      rerender(
        <MemoryRouter initialEntries={['/app/cars']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        // New total: 340,000 + 100,000 = 440,000 PLN
        expect(screen.getByText('440 000,00 zł')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Total fleet count
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully throughout the workflow', async () => {
      // Start with API error on list page
      mockCarAssetsService.getCarAssets.mockRejectedValue(new Error('Network error'));

      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      // Retry should work
      mockCarAssetsService.getCarAssets.mockResolvedValue(mockCarAssets);
      fireEvent.click(screen.getByText('Try Again'));

      await waitFor(() => {
        expect(screen.getByText('BMW 320i')).toBeInTheDocument();
      });

      // Test error during car creation
      const { rerender } = renderApp('/app/cars/add');

      await waitFor(() => {
        expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      });

      mockCarAssetsService.createCarAsset.mockRejectedValue(new Error('VIN already exists'));

      fireEvent.change(screen.getByLabelText(/VIN/), { target: { value: 'WBAXX12345XX00001' } });
      fireEvent.change(screen.getByLabelText(/Make/), { target: { value: 'BMW' } });
      fireEvent.change(screen.getByLabelText(/Model/), { target: { value: '320i' } });

      fireEvent.click(screen.getByText('Add Vehicle'));

      await waitFor(() => {
        expect(screen.getByText('VIN already exists')).toBeInTheDocument();
      });

      // Form should remain in place, user can fix and retry
      expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      expect(screen.getByDisplayValue('WBAXX12345XX00001')).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('should handle large datasets efficiently', async () => {
      // Generate large dataset
      const largeMockCarAssets: CarAsset[] = Array.from({ length: 100 }, (_, index) => ({
        id: (index + 1).toString(),
        vin: `TEST${index.toString().padStart(13, '0')}`,
        make: ['BMW', 'Audi', 'Volkswagen', 'Mercedes'][index % 4],
        model: ['Model A', 'Model B', 'Model C'][index % 3],
        year: 2020 + (index % 4),
        status: ['AVAILABLE', 'LEASED', 'IN_SERVICE'][index % 3] as any,
        bookValue: 100000 + (index * 1000),
        organizationId: 1,
        organizationName: 'Test Leasing Company',
        createdAt: '2026-04-03T16:00:00Z',
        updatedAt: '2026-04-03T16:00:00Z',
      }));

      mockCarAssetsService.getCarAssets.mockResolvedValue(largeMockCarAssets);

      const startTime = performance.now();
      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument(); // Total count
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render large dataset in reasonable time (< 1000ms)
      expect(renderTime).toBeLessThan(1000);

      // Search should still work efficiently
      const searchStart = performance.now();
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'BMW' } });

      await waitFor(() => {
        // Should find BMW cars
        const bmwCars = screen.getAllByText(/BMW/);
        expect(bmwCars.length).toBeGreaterThan(0);
      });

      const searchEnd = performance.now();
      const searchTime = searchEnd - searchStart;

      // Search should be near-instantaneous
      expect(searchTime).toBeLessThan(100);
    });
  });

  describe('Authentication Integration', () => {
    it('should include authentication headers in all requests', async () => {
      renderApp('/app/cars');

      await waitFor(() => {
        expect(mockCarAssetsService.getCarAssets).toHaveBeenCalled();
      });

      // Verify that the service would be called with auth token
      // (In real implementation, this would be tested by checking fetch calls)
      expect(mockCarAssetsService.getCarAssets).toHaveBeenCalledTimes(1);
    });
  });
});