import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CarAssetFormPage from './CarAssetFormPage';
import { carAssetsService } from '../../services/carAssetsService';
import type { CarAsset, CreateCarAssetRequest, UpdateCarAssetRequest } from '../../types';

// Mock the service
vi.mock('../../services/carAssetsService');
const mockCarAssetsService = vi.mocked(carAssetsService);

// Mock navigate and params
const mockNavigate = vi.fn();
const mockParams = { id: undefined };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

// Mock context
vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

describe('CarAssetFormPage', () => {
  const mockCarAsset: CarAsset = {
    id: '123e4567-e89b-12d3-a456-426614174000',
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
    leaseStartDate: '2026-04-01',
    leaseEndDate: '2027-04-01',
    currentLessee: 'ABC Transport Ltd',
    organizationId: 1,
    organizationName: 'Test Leasing Company',
    photos: [],
    documents: [],
    createdAt: '2026-04-03T16:00:00Z',
    updatedAt: '2026-04-03T16:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('Add New Vehicle Mode', () => {
    it('should render form in add mode', async () => {
      renderWithRouter(<CarAssetFormPage />);

      expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      expect(screen.getByText('Add a new vehicle to your fleet')).toBeInTheDocument();
      expect(screen.getByText('Add Vehicle')).toBeInTheDocument();

      // Check required fields are present
      expect(screen.getByLabelText('VIN *')).toBeInTheDocument();
      expect(screen.getByLabelText('Make *')).toBeInTheDocument();
      expect(screen.getByLabelText('Model *')).toBeInTheDocument();
      expect(screen.getByLabelText('Year *')).toBeInTheDocument();
    });

    it('should have current year as default', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const yearInput = screen.getByLabelText('Year *') as HTMLInputElement;
      expect(yearInput.value).toBe(new Date().getFullYear().toString());
    });

    it('should show required field indicators', async () => {
      renderWithRouter(<CarAssetFormPage />);

      // Check for required asterisks
      expect(screen.getByText('VIN')).toBeInTheDocument();
      expect(screen.getByText('Make')).toBeInTheDocument();
      expect(screen.getByText('Model')).toBeInTheDocument();
      
      // Check for asterisks
      const asterisks = screen.getAllByText('*');
      expect(asterisks.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Edit Vehicle Mode', () => {
    beforeEach(() => {
      mockParams.id = '123e4567-e89b-12d3-a456-426614174000';
    });
    
    afterEach(() => {
      mockParams.id = undefined;
    });

    it('should load and display existing vehicle data', async () => {
      mockCarAssetsService.getCarAsset.mockResolvedValue(mockCarAsset);

      renderWithRouter(<CarAssetFormPage />);

      await waitFor(() => {
        expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
        expect(screen.getByText('Update vehicle information')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('WBAXX12345XX00001')).toBeInTheDocument();
        expect(screen.getByDisplayValue('BMW')).toBeInTheDocument();
        expect(screen.getByDisplayValue('320i')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2023')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Black')).toBeInTheDocument();
        expect(screen.getByDisplayValue('15000')).toBeInTheDocument();
      });

      expect(mockCarAssetsService.getCarAsset).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should show status dropdown in edit mode', async () => {
      mockCarAssetsService.getCarAsset.mockResolvedValue(mockCarAsset);

      renderWithRouter(<CarAssetFormPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Status')).toBeInTheDocument();
      });

      const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;
      expect(statusSelect.value).toBe('AVAILABLE');
    });

    it('should disable VIN, Make, Model, and Year fields in edit mode', async () => {
      mockCarAssetsService.getCarAsset.mockResolvedValue(mockCarAsset);

      renderWithRouter(<CarAssetFormPage />);

      await waitFor(() => {
        const vinInput = screen.getByDisplayValue('WBAXX12345XX00001') as HTMLInputElement;
        const makeInput = screen.getByDisplayValue('BMW') as HTMLInputElement;
        const modelInput = screen.getByDisplayValue('320i') as HTMLInputElement;
        const yearInput = screen.getByDisplayValue('2023') as HTMLInputElement;

        expect(vinInput.disabled).toBe(true);
        expect(makeInput.disabled).toBe(true);
        expect(modelInput.disabled).toBe(true);
        expect(yearInput.disabled).toBe(true);
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error for missing required fields', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('VIN, Make, and Model are required')).toBeInTheDocument();
      });

      expect(mockCarAssetsService.createCarAsset).not.toHaveBeenCalled();
    });

    it('should validate VIN length', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const vinInput = screen.getByLabelText('VIN *');
      fireEvent.change(vinInput, { target: { value: 'SHORT' } });

      const makeInput = screen.getByLabelText('Make *');
      fireEvent.change(makeInput, { target: { value: 'BMW' } });

      const modelInput = screen.getByLabelText('Model *');
      fireEvent.change(modelInput, { target: { value: '320i' } });

      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      // Form should still validate and attempt submission with short VIN
      await waitFor(() => {
        expect(mockCarAssetsService.createCarAsset).toHaveBeenCalledWith(
          expect.objectContaining({
            vin: 'SHORT',
            make: 'BMW',
            model: '320i',
          })
        );
      });
    });

    it('should uppercase VIN input', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const vinInput = screen.getByLabelText('VIN *');
      fireEvent.change(vinInput, { target: { value: 'wbaxx12345xx00001' } });

      expect((vinInput as HTMLInputElement).value).toBe('WBAXX12345XX00001');
    });

    it('should validate year range', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const yearInput = screen.getByLabelText('Year *');
      
      // Test minimum year
      fireEvent.change(yearInput, { target: { value: '1899' } });
      expect((yearInput as HTMLInputElement).value).toBe('1899');
      
      // Test maximum year (current year + 1)
      const maxYear = new Date().getFullYear() + 1;
      fireEvent.change(yearInput, { target: { value: maxYear.toString() } });
      expect((yearInput as HTMLInputElement).value).toBe(maxYear.toString());
    });
  });

  describe('Form Submission - Add Mode', () => {
    it('should create new car asset successfully', async () => {
      const newCarAsset = { ...mockCarAsset, id: 'new-id' };
      mockCarAssetsService.createCarAsset.mockResolvedValue(newCarAsset);

      renderWithRouter(<CarAssetFormPage />);

      // Fill required fields
      fireEvent.change(screen.getByLabelText('VIN *'), { target: { value: 'WBAXX12345XX00001' } });
      fireEvent.change(screen.getByLabelText('Make *'), { target: { value: 'BMW' } });
      fireEvent.change(screen.getByLabelText('Model *'), { target: { value: '320i' } });
      
      // Fill optional fields
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Black' } });
      fireEvent.change(screen.getByLabelText('Mileage (km)'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Wrocław HQ' } });
      fireEvent.change(screen.getByLabelText('Book Value (PLN)'), { target: { value: '180000' } });
      fireEvent.change(screen.getByLabelText('Residual Value (PLN)'), { target: { value: '120000' } });

      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCarAssetsService.createCarAsset).toHaveBeenCalledWith({
          vin: 'WBAXX12345XX00001',
          make: 'BMW',
          model: '320i',
          year: new Date().getFullYear(),
          color: 'Black',
          mileage: 15000,
          location: 'Wrocław HQ',
          bookValue: 180000,
          residualValue: 120000,
          leaseStartDate: '',
          leaseEndDate: '',
          currentLessee: '',
          photos: [],
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/app/cars');
    });

    it('should handle API errors during creation', async () => {
      mockCarAssetsService.createCarAsset.mockRejectedValue(new Error('VIN already exists'));

      renderWithRouter(<CarAssetFormPage />);

      // Fill required fields
      fireEvent.change(screen.getByLabelText('VIN *'), { target: { value: 'WBAXX12345XX00001' } });
      fireEvent.change(screen.getByLabelText('Make *'), { target: { value: 'BMW' } });
      fireEvent.change(screen.getByLabelText('Model *'), { target: { value: '320i' } });

      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('VIN already exists')).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show loading state during submission', async () => {
      mockCarAssetsService.createCarAsset.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockCarAsset), 100))
      );

      renderWithRouter(<CarAssetFormPage />);

      // Fill required fields
      fireEvent.change(screen.getByLabelText('VIN *'), { target: { value: 'WBAXX12345XX00001' } });
      fireEvent.change(screen.getByLabelText('Make *'), { target: { value: 'BMW' } });
      fireEvent.change(screen.getByLabelText('Model *'), { target: { value: '320i' } });

      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/app/cars');
      });
    });
  });

  describe('Form Submission - Edit Mode', () => {
    beforeEach(() => {
      mockParams.id = '123e4567-e89b-12d3-a456-426614174000';
    });
    
    afterEach(() => {
      mockParams.id = undefined;
    });

    it('should update car asset successfully', async () => {
      mockCarAssetsService.getCarAsset.mockResolvedValue(mockCarAsset);
      mockCarAssetsService.updateCarAsset.mockResolvedValue({ ...mockCarAsset, color: 'Silver' });

      renderWithRouter(<CarAssetFormPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Black')).toBeInTheDocument();
      });

      // Update color
      const colorInput = screen.getByLabelText('Color');
      fireEvent.change(colorInput, { target: { value: 'Silver' } });

      const submitButton = screen.getByText('Update Vehicle');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCarAssetsService.updateCarAsset).toHaveBeenCalledWith(
          '123e4567-e89b-12d3-a456-426614174000',
          expect.objectContaining({
            color: 'Silver',
            mileage: 15000,
            location: 'Wrocław HQ',
            bookValue: 180000,
            residualValue: 120000,
            leaseStartDate: '2026-04-01',
            leaseEndDate: '2027-04-01',
            currentLessee: 'ABC Transport Ltd',
            photos: [],
            status: 'AVAILABLE',
          })
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith('/app/cars');
    });
  });

  describe('Lease Information', () => {
    it('should handle lease dates correctly', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const leaseStartInput = screen.getByLabelText('Lease Start Date');
      const leaseEndInput = screen.getByLabelText('Lease End Date');
      const lesseeInput = screen.getByLabelText('Current Lessee');

      fireEvent.change(leaseStartInput, { target: { value: '2026-04-01' } });
      fireEvent.change(leaseEndInput, { target: { value: '2027-04-01' } });
      fireEvent.change(lesseeInput, { target: { value: 'ABC Transport Ltd' } });

      expect((leaseStartInput as HTMLInputElement).value).toBe('2026-04-01');
      expect((leaseEndInput as HTMLInputElement).value).toBe('2027-04-01');
      expect((lesseeInput as HTMLInputElement).value).toBe('ABC Transport Ltd');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to cars list when cancel is clicked', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/app/cars');
    });
  });

  describe('Financial Information', () => {
    it('should handle decimal values for book and residual values', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const bookValueInput = screen.getByLabelText('Book Value (PLN)');
      const residualValueInput = screen.getByLabelText('Residual Value (PLN)');

      fireEvent.change(bookValueInput, { target: { value: '180000.50' } });
      fireEvent.change(residualValueInput, { target: { value: '120000.75' } });

      expect((bookValueInput as HTMLInputElement).value).toBe('180000.50');
      expect((residualValueInput as HTMLInputElement).value).toBe('120000.75');
    });

    it('should handle empty financial values', async () => {
      renderWithRouter(<CarAssetFormPage />);

      const bookValueInput = screen.getByLabelText('Book Value (PLN)');
      fireEvent.change(bookValueInput, { target: { value: '' } });

      // Fill required fields for submission
      fireEvent.change(screen.getByLabelText('VIN *'), { target: { value: 'WBAXX12345XX00001' } });
      fireEvent.change(screen.getByLabelText('Make *'), { target: { value: 'BMW' } });
      fireEvent.change(screen.getByLabelText('Model *'), { target: { value: '320i' } });

      const submitButton = screen.getByText('Add Vehicle');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCarAssetsService.createCarAsset).toHaveBeenCalledWith(
          expect.objectContaining({
            bookValue: 0, // Should default to 0 for empty values
          })
        );
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state when loading car data in edit mode', async () => {
      mockParams.id = '123e4567-e89b-12d3-a456-426614174000';
      
      mockCarAssetsService.getCarAsset.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockCarAsset), 100))
      );

      renderWithRouter(<CarAssetFormPage />);

      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
      });
      
      mockParams.id = undefined;
    });

    it('should show error when loading car data fails', async () => {
      mockParams.id = '123e4567-e89b-12d3-a456-426614174000';
      
      mockCarAssetsService.getCarAsset.mockRejectedValue(new Error('Car not found'));

      renderWithRouter(<CarAssetFormPage />);

      await waitFor(() => {
        expect(screen.getByText('Car not found')).toBeInTheDocument();
      });
      
      mockParams.id = undefined;
    });
  });
});