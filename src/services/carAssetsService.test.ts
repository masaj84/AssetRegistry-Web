import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { carAssetsService } from './carAssetsService';
import type { CarAsset, CreateCarAssetRequest, UpdateCarAssetRequest } from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('CarAssetsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-jwt-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
    leaseStartDate: undefined,
    leaseEndDate: undefined,
    currentLessee: undefined,
    organizationId: 1,
    organizationName: 'Test Leasing Company',
    photos: [],
    documents: [],
    blockchainAnchoredAt: undefined,
    blockchainHash: undefined,
    createdAt: '2026-04-03T16:00:00Z',
    updatedAt: '2026-04-03T16:00:00Z',
  };

  describe('getCarAssets', () => {
    it('should fetch all car assets successfully', async () => {
      const mockResponse = [mockCarAsset];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await carAssetsService.getCarAssets();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      await expect(carAssetsService.getCarAssets()).rejects.toThrow(
        'API Error: 401 - Unauthorized'
      );
    });
  });

  describe('getCarAsset', () => {
    it('should fetch a specific car asset by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCarAsset),
      });

      const result = await carAssetsService.getCarAsset('123e4567-e89b-12d3-a456-426614174000');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets/123e4567-e89b-12d3-a456-426614174000',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(mockCarAsset);
    });
  });

  describe('getCarAssetByVin', () => {
    it('should fetch a car asset by VIN', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCarAsset),
      });

      const result = await carAssetsService.getCarAssetByVin('WBAXX12345XX00001');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets/vin/WBAXX12345XX00001',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(mockCarAsset);
    });
  });

  describe('createCarAsset', () => {
    it('should create a new car asset', async () => {
      const createRequest: CreateCarAssetRequest = {
        vin: 'WBAXX12345XX00001',
        make: 'BMW',
        model: '320i',
        year: 2023,
        color: 'Black',
        mileage: 15000,
        location: 'Wrocław HQ',
        bookValue: 180000,
        residualValue: 120000,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCarAsset),
      });

      const result = await carAssetsService.createCarAsset(createRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
          body: JSON.stringify(createRequest),
        }
      );
      expect(result).toEqual(mockCarAsset);
    });
  });

  describe('updateCarAsset', () => {
    it('should update an existing car asset', async () => {
      const updateRequest: UpdateCarAssetRequest = {
        color: 'Silver',
        mileage: 20000,
        status: 'LEASED',
        currentLessee: 'ABC Transport Ltd',
      };

      const updatedCarAsset = { ...mockCarAsset, ...updateRequest };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedCarAsset),
      });

      const result = await carAssetsService.updateCarAsset('123e4567-e89b-12d3-a456-426614174000', updateRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets/123e4567-e89b-12d3-a456-426614174000',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
          body: JSON.stringify(updateRequest),
        }
      );
      expect(result).toEqual(updatedCarAsset);
    });
  });

  describe('deleteCarAsset', () => {
    it('should delete a car asset', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await carAssetsService.deleteCarAsset('123e4567-e89b-12d3-a456-426614174000');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets/123e4567-e89b-12d3-a456-426614174000',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
    });

    it('should handle delete errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not found'),
      });

      await expect(
        carAssetsService.deleteCarAsset('123e4567-e89b-12d3-a456-426614174000')
      ).rejects.toThrow('API Error: 404 - Not found');
    });
  });

  describe('searchCarAssets', () => {
    it('should search car assets with filters', async () => {
      const searchRequest = {
        make: 'BMW',
        status: 'AVAILABLE' as const,
        pageNumber: 1,
        pageSize: 20,
      };

      const searchResponse = {
        assets: [mockCarAsset],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(searchResponse),
      });

      const result = await carAssetsService.searchCarAssets(searchRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
          body: JSON.stringify(searchRequest),
        }
      );
      expect(result).toEqual(searchResponse);
    });
  });

  describe('getFleetStats', () => {
    it('should fetch fleet statistics', async () => {
      const statsResponse = {
        totalCars: 5,
        availableCars: 2,
        leasedCars: 2,
        inServiceCars: 1,
        soldCars: 0,
        topMakes: [
          { make: 'BMW', count: 2 },
          { make: 'Audi', count: 1 },
        ],
        averageYear: 2023,
        blockchainAnchored: 3,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(statsResponse),
      });

      const result = await carAssetsService.getFleetStats();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets/stats',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(statsResponse);
    });
  });

  describe('authentication', () => {
    it('should work without token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await carAssetsService.getCarAssets();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/carassets',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });
});