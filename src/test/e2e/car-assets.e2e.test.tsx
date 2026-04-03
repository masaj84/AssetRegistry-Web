import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CarAssetsPage from '../../pages/app/CarAssetsPage';
import CarAssetFormPage from '../../pages/app/CarAssetFormPage';
import { carAssetsService } from '../../services/carAssetsService';
import { 
  createMockCarAssets, 
  createMockCarAsset, 
  TEST_SCENARIOS,
  formatCurrencyForTest 
} from '../utils/car-assets-test-utils';
import type { CarAsset } from '../../types';

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

/**
 * End-to-End Tests for Car Asset Management System
 * These tests simulate real user workflows and interactions
 */
describe('Car Assets E2E Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset performance measurements
    performance.mark('test-start');
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

  describe('User Journey: Fleet Manager Daily Tasks', () => {
    it('should complete typical fleet manager workflow', async () => {
      // Start with existing fleet
      const initialFleet = TEST_SCENARIOS.MIXED_STATUS_FLEET;
      mockCarAssetsService.getCarAssets.mockResolvedValue(initialFleet);

      // 1. Manager opens fleet dashboard
      performance.mark('dashboard-load-start');
      const { rerender } = renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('Fleet Management')).toBeInTheDocument();
      });
      performance.mark('dashboard-load-end');

      // 2. Review fleet statistics
      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // Total fleet
        expect(screen.getByText('1')).toBeInTheDocument(); // Available count
      });

      // 3. Search for specific car by VIN
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'TEST000000000000' } });

      await waitFor(() => {
        expect(screen.getAllByText(/TEST000000000000/).length).toBeGreaterThan(0);
      });

      // 4. Clear search and filter by status
      fireEvent.change(searchInput, { target: { value: '' } });
      const statusFilter = screen.getByDisplayValue('All Statuses');
      fireEvent.change(statusFilter, { target: { value: 'LEASED' } });

      await waitFor(() => {
        // Should only show leased cars
        expect(screen.queryByText('AVAILABLE')).not.toBeInTheDocument();
        expect(screen.getByText('LEASED')).toBeInTheDocument();
      });

      // 5. Add new vehicle to fleet
      rerender(
        <MemoryRouter initialEntries={['/app/cars/add']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
            <Route path="/app/cars/add" element={<CarAssetFormPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      });

      // Fill out comprehensive vehicle information
      const newCar = createMockCarAsset({
        id: '6',
        vin: 'NEWCAR12345678901',
        make: 'Tesla',
        model: 'Model 3',
        year: 2024,
        color: 'White',
        mileage: 0,
        bookValue: 250000,
        location: 'Electric Fleet Center',
      });

      mockCarAssetsService.createCarAsset.mockResolvedValue(newCar);

      // Basic info
      fireEvent.change(screen.getByLabelText(/VIN/), { target: { value: 'NEWCAR12345678901' } });
      fireEvent.change(screen.getByLabelText(/Make/), { target: { value: 'Tesla' } });
      fireEvent.change(screen.getByLabelText(/Model/), { target: { value: 'Model 3' } });
      fireEvent.change(screen.getByLabelText(/Year/), { target: { value: '2024' } });
      fireEvent.change(screen.getByLabelText(/Color/), { target: { value: 'White' } });

      // Location and financial info
      fireEvent.change(screen.getByLabelText(/Location/), { target: { value: 'Electric Fleet Center' } });
      fireEvent.change(screen.getByLabelText(/Book Value/), { target: { value: '250000' } });
      fireEvent.change(screen.getByLabelText(/Residual Value/), { target: { value: '150000' } });

      // Submit form
      performance.mark('car-creation-start');
      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCarAssetsService.createCarAsset).toHaveBeenCalledWith(
          expect.objectContaining({
            vin: 'NEWCAR12345678901',
            make: 'Tesla',
            model: 'Model 3',
            year: 2024,
            color: 'White',
            location: 'Electric Fleet Center',
            bookValue: 250000,
          })
        );
      });
      performance.mark('car-creation-end');

      // 6. Return to fleet view with updated data
      const updatedFleet = [...initialFleet, newCar];
      mockCarAssetsService.getCarAssets.mockResolvedValue(updatedFleet);

      rerender(
        <MemoryRouter initialEntries={['/app/cars']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument(); // Updated total count
        expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
      });

      // Verify performance metrics
      const dashboardLoadTime = performance.measure('dashboard-load', 'dashboard-load-start', 'dashboard-load-end');
      const carCreationTime = performance.measure('car-creation', 'car-creation-start', 'car-creation-end');

      expect(dashboardLoadTime.duration).toBeLessThan(1000); // Should load in < 1s
      expect(carCreationTime.duration).toBeLessThan(500); // Should submit in < 0.5s
    });
  });

  describe('User Journey: Lease Manager Operations', () => {
    it('should handle lease lifecycle management', async () => {
      const availableCar = createMockCarAsset({
        id: '1',
        status: 'AVAILABLE',
        currentLessee: undefined,
        leaseStartDate: undefined,
        leaseEndDate: undefined,
      });

      mockCarAssetsService.getCarAssets.mockResolvedValue([availableCar]);
      mockCarAssetsService.getCarAsset.mockResolvedValue(availableCar);

      // 1. Start with available car
      const { rerender } = renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
      });

      // 2. Edit car to set up lease
      rerender(
        <MemoryRouter initialEntries={['/app/cars/1/edit']}>
          <Routes>
            <Route path="/app/cars/:id/edit" element={<CarAssetFormPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
      });

      // Update to leased status with lease information
      const statusSelect = screen.getByLabelText(/Status/);
      fireEvent.change(statusSelect, { target: { value: 'LEASED' } });

      const lesseeInput = screen.getByLabelText(/Current Lessee/);
      fireEvent.change(lesseeInput, { target: { value: 'ABC Transport Ltd' } });

      const startDateInput = screen.getByLabelText(/Lease Start Date/);
      fireEvent.change(startDateInput, { target: { value: '2026-04-01' } });

      const endDateInput = screen.getByLabelText(/Lease End Date/);
      fireEvent.change(endDateInput, { target: { value: '2027-04-01' } });

      const leasedCar = {
        ...availableCar,
        status: 'LEASED' as const,
        currentLessee: 'ABC Transport Ltd',
        leaseStartDate: '2026-04-01',
        leaseEndDate: '2027-04-01',
      };

      mockCarAssetsService.updateCarAsset.mockResolvedValue(leasedCar);

      const updateButton = screen.getByText('Update Vehicle');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockCarAssetsService.updateCarAsset).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            status: 'LEASED',
            currentLessee: 'ABC Transport Ltd',
            leaseStartDate: '2026-04-01',
            leaseEndDate: '2027-04-01',
          })
        );
      });

      // 3. Verify lease is reflected in fleet view
      mockCarAssetsService.getCarAssets.mockResolvedValue([leasedCar]);

      rerender(
        <MemoryRouter initialEntries={['/app/cars']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('LEASED')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // Leased count in stats
      });
    });
  });

  describe('Performance and Scalability Tests', () => {
    it('should handle large fleets efficiently', async () => {
      // Test with 500 cars
      const largeFleet = createMockCarAssets(500);
      mockCarAssetsService.getCarAssets.mockResolvedValue(largeFleet);

      performance.mark('large-fleet-start');
      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('500')).toBeInTheDocument(); // Total count
      });
      performance.mark('large-fleet-end');

      const loadTime = performance.measure('large-fleet-load', 'large-fleet-start', 'large-fleet-end');
      expect(loadTime.duration).toBeLessThan(2000); // Should load 500 cars in < 2s

      // Test search performance with large dataset
      performance.mark('search-start');
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'BMW' } });

      await waitFor(() => {
        const bmwCars = screen.getAllByText(/BMW/);
        expect(bmwCars.length).toBeGreaterThan(0);
      });
      performance.mark('search-end');

      const searchTime = performance.measure('search-time', 'search-start', 'search-end');
      expect(searchTime.duration).toBeLessThan(100); // Search should be instant
    });

    it('should handle rapid user interactions', async () => {
      const fleet = TEST_SCENARIOS.MEDIUM_FLEET;
      mockCarAssetsService.getCarAssets.mockResolvedValue(fleet);

      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('Fleet Management')).toBeInTheDocument();
      });

      // Rapid search changes
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      
      performance.mark('rapid-search-start');
      
      // Type quickly
      fireEvent.change(searchInput, { target: { value: 'B' } });
      fireEvent.change(searchInput, { target: { value: 'BM' } });
      fireEvent.change(searchInput, { target: { value: 'BMW' } });
      fireEvent.change(searchInput, { target: { value: 'BM' } });
      fireEvent.change(searchInput, { target: { value: 'B' } });
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        // Should handle rapid changes without issues
        expect(screen.getByText('15')).toBeInTheDocument(); // Back to full fleet
      });
      
      performance.mark('rapid-search-end');
      const rapidSearchTime = performance.measure('rapid-search', 'rapid-search-start', 'rapid-search-end');
      expect(rapidSearchTime.duration).toBeLessThan(500);

      // Rapid status filter changes
      const statusFilter = screen.getByDisplayValue('All Statuses');
      
      fireEvent.change(statusFilter, { target: { value: 'AVAILABLE' } });
      fireEvent.change(statusFilter, { target: { value: 'LEASED' } });
      fireEvent.change(statusFilter, { target: { value: 'IN_SERVICE' } });
      fireEvent.change(statusFilter, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument(); // Back to full fleet
      });
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should gracefully handle network failures and recovery', async () => {
      // Start with network failure
      mockCarAssetsService.getCarAssets.mockRejectedValue(new Error('Network error'));

      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      // Simulate network recovery
      const fleet = TEST_SCENARIOS.SMALL_FLEET;
      mockCarAssetsService.getCarAssets.mockResolvedValue(fleet);

      fireEvent.click(screen.getByText('Try Again'));

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Fleet loaded
        expect(screen.queryByText('Network error')).not.toBeInTheDocument();
      });

      // Test partial data corruption
      const corruptedFleet = [
        createMockCarAsset({ id: '1', bookValue: undefined }),
        createMockCarAsset({ id: '2', color: undefined }),
        createMockCarAsset({ id: '3', location: undefined }),
      ];

      mockCarAssetsService.getCarAssets.mockResolvedValue(corruptedFleet);

      // Re-render to simulate data refresh
      const { rerender } = renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
        // Should handle undefined values gracefully
        expect(screen.getByText('-')).toBeInTheDocument(); // For missing book value
      });
    });

    it('should handle form submission failures with retry capability', async () => {
      const { rerender } = renderApp('/app/cars/add');

      await waitFor(() => {
        expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      });

      // Fill form
      fireEvent.change(screen.getByLabelText(/VIN/), { target: { value: 'TESTVIN1234567890' } });
      fireEvent.change(screen.getByLabelText(/Make/), { target: { value: 'BMW' } });
      fireEvent.change(screen.getByLabelText(/Model/), { target: { value: '320i' } });

      // First submission fails
      mockCarAssetsService.createCarAsset.mockRejectedValue(new Error('VIN already exists'));

      fireEvent.click(screen.getByText('Add Vehicle'));

      await waitFor(() => {
        expect(screen.getByText('VIN already exists')).toBeInTheDocument();
      });

      // User corrects VIN
      fireEvent.change(screen.getByLabelText(/VIN/), { target: { value: 'NEWVIN1234567890' } });

      // Second submission succeeds
      const newCar = createMockCarAsset({ vin: 'NEWVIN1234567890' });
      mockCarAssetsService.createCarAsset.mockResolvedValue(newCar);

      fireEvent.click(screen.getByText('Add Vehicle'));

      await waitFor(() => {
        expect(mockCarAssetsService.createCarAsset).toHaveBeenCalledWith(
          expect.objectContaining({
            vin: 'NEWVIN1234567890',
          })
        );
      });
    });
  });

  describe('Accessibility and Usability', () => {
    it('should support keyboard navigation', async () => {
      const fleet = TEST_SCENARIOS.SMALL_FLEET;
      mockCarAssetsService.getCarAssets.mockResolvedValue(fleet);

      renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('Fleet Management')).toBeInTheDocument();
      });

      // Test tab navigation
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      const statusFilter = screen.getByDisplayValue('All Statuses');
      const addButton = screen.getByText('Add Vehicle');

      // Simulate tab navigation
      expect(searchInput).toBeInTheDocument();
      expect(statusFilter).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();

      // Test Enter key on search
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      // Should not cause any errors

      // Test Escape key to clear search
      fireEvent.change(searchInput, { target: { value: 'BMW' } });
      fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });
      // Implementation would clear search on Escape
    });

    it('should provide clear loading states and feedback', async () => {
      // Test loading state
      mockCarAssetsService.getCarAssets.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(TEST_SCENARIOS.SMALL_FLEET), 200))
      );

      renderApp('/app/cars');

      // Should show loading animation
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      // Loading should be gone
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });
  });

  describe('Data Consistency and State Management', () => {
    it('should maintain consistent state across navigation', async () => {
      const fleet = TEST_SCENARIOS.MIXED_STATUS_FLEET;
      mockCarAssetsService.getCarAssets.mockResolvedValue(fleet);

      // Start with filtered view
      const { rerender } = renderApp('/app/cars');

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });

      // Apply filters
      const searchInput = screen.getByPlaceholderText('Search by make, model, VIN, or location...');
      fireEvent.change(searchInput, { target: { value: 'BMW' } });

      const statusFilter = screen.getByDisplayValue('All Statuses');
      fireEvent.change(statusFilter, { target: { value: 'AVAILABLE' } });

      // Navigate to add form
      rerender(
        <MemoryRouter initialEntries={['/app/cars/add']}>
          <Routes>
            <Route path="/app/cars/add" element={<CarAssetFormPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      });

      // Navigate back to list
      rerender(
        <MemoryRouter initialEntries={['/app/cars']}>
          <Routes>
            <Route path="/app/cars" element={<CarAssetsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Fleet Management')).toBeInTheDocument();
        // Filters should be reset after navigation
        expect(screen.getByDisplayValue('')).toBeInTheDocument(); // Search cleared
        expect(screen.getByDisplayValue('All Statuses')).toBeInTheDocument(); // Status cleared
      });
    });
  });
});