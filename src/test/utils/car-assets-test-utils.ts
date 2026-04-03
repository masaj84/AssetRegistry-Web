import type { CarAsset, CreateCarAssetRequest, UpdateCarAssetRequest } from '../../types';

/**
 * Test utilities for Car Assets
 */

export const createMockCarAsset = (overrides?: Partial<CarAsset>): CarAsset => ({
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
  organizationId: 1,
  organizationName: 'Test Leasing Company',
  photos: [],
  documents: [],
  createdAt: '2026-04-03T16:00:00Z',
  updatedAt: '2026-04-03T16:00:00Z',
  ...overrides,
});

export const createMockCarAssets = (count: number): CarAsset[] => {
  const makes = ['BMW', 'Audi', 'Volkswagen', 'Mercedes', 'Ford'];
  const models = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Wagon'];
  const colors = ['Black', 'Silver', 'Blue', 'Red', 'White'];
  const statuses: CarAsset['status'][] = ['AVAILABLE', 'LEASED', 'IN_SERVICE', 'SOLD', 'DAMAGED'];
  const locations = ['Wrocław HQ', 'Kraków Branch', 'Gdańsk Office', 'Warsaw Center', 'Service Center'];

  return Array.from({ length: count }, (_, index) => ({
    id: (index + 1).toString(),
    vin: `TEST${index.toString().padStart(13, '0')}`,
    make: makes[index % makes.length],
    model: models[index % models.length],
    year: 2020 + (index % 5),
    color: colors[index % colors.length],
    mileage: 10000 + (index * 1000),
    status: statuses[index % statuses.length],
    location: locations[index % locations.length],
    bookValue: 100000 + (index * 5000),
    residualValue: 60000 + (index * 3000),
    organizationId: 1,
    organizationName: 'Test Leasing Company',
    photos: [],
    documents: [],
    createdAt: '2026-04-03T16:00:00Z',
    updatedAt: '2026-04-03T16:00:00Z',
  }));
};

export const createMockCreateRequest = (overrides?: Partial<CreateCarAssetRequest>): CreateCarAssetRequest => ({
  vin: 'WBAXX12345XX00001',
  make: 'BMW',
  model: '320i',
  year: 2023,
  color: 'Black',
  mileage: 15000,
  location: 'Wrocław HQ',
  bookValue: 180000,
  residualValue: 120000,
  photos: [],
  ...overrides,
});

export const createMockUpdateRequest = (overrides?: Partial<UpdateCarAssetRequest>): UpdateCarAssetRequest => ({
  color: 'Silver',
  mileage: 20000,
  location: 'Kraków Branch',
  bookValue: 175000,
  ...overrides,
});

/**
 * Car status helpers
 */
export const getAvailableCars = (cars: CarAsset[]): CarAsset[] => 
  cars.filter(car => car.status === 'AVAILABLE');

export const getLeasedCars = (cars: CarAsset[]): CarAsset[] => 
  cars.filter(car => car.status === 'LEASED');

export const getInServiceCars = (cars: CarAsset[]): CarAsset[] => 
  cars.filter(car => car.status === 'IN_SERVICE');

export const getTotalFleetValue = (cars: CarAsset[]): number => 
  cars.reduce((total, car) => total + (car.bookValue || 0), 0);

/**
 * Search and filter helpers
 */
export const filterCarsByMake = (cars: CarAsset[], make: string): CarAsset[] => 
  cars.filter(car => car.make.toLowerCase().includes(make.toLowerCase()));

export const filterCarsByVin = (cars: CarAsset[], vin: string): CarAsset[] => 
  cars.filter(car => car.vin.toLowerCase().includes(vin.toLowerCase()));

export const filterCarsByStatus = (cars: CarAsset[], status: CarAsset['status']): CarAsset[] => 
  cars.filter(car => car.status === status);

export const filterCarsByLocation = (cars: CarAsset[], location: string): CarAsset[] => 
  cars.filter(car => car.location?.toLowerCase().includes(location.toLowerCase()));

/**
 * VIN validation helpers
 */
export const isValidVin = (vin: string): boolean => {
  return vin.length === 17 && /^[A-Z0-9]+$/.test(vin);
};

export const generateRandomVin = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return vin;
};

/**
 * Date helpers for testing
 */
export const createLeaseStartDate = (daysFromNow = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const createLeaseEndDate = (daysFromNow = 365): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

/**
 * Mock API response helpers
 */
export const createMockApiResponse = <T>(data: T, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(ok ? 'Success' : 'Error'),
});

export const createMockErrorResponse = (status = 500, message = 'Internal Server Error') => ({
  ok: false,
  status,
  json: () => Promise.resolve({ error: message }),
  text: () => Promise.resolve(message),
});

/**
 * Form validation helpers
 */
export const validateCarAssetForm = (data: Partial<CreateCarAssetRequest>): string[] => {
  const errors: string[] = [];

  if (!data.vin) errors.push('VIN is required');
  if (!data.make) errors.push('Make is required');
  if (!data.model) errors.push('Model is required');
  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push('Year must be between 1900 and next year');
  }

  return errors;
};

/**
 * Currency formatting for tests
 */
export const formatCurrencyForTest = (amount?: number): string => {
  if (!amount) return '-';
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
};

/**
 * Mileage formatting for tests
 */
export const formatMileageForTest = (mileage?: number): string => {
  if (!mileage) return '0';
  return mileage.toLocaleString();
};

/**
 * Car age calculation
 */
export const calculateCarAge = (year: number): number => {
  return new Date().getFullYear() - year;
};

/**
 * Test data sets for different scenarios
 */
export const TEST_SCENARIOS = {
  // Empty fleet
  EMPTY_FLEET: [],

  // Small fleet (2-3 cars)
  SMALL_FLEET: createMockCarAssets(3),

  // Medium fleet (10-20 cars)
  MEDIUM_FLEET: createMockCarAssets(15),

  // Large fleet (100+ cars)
  LARGE_FLEET: createMockCarAssets(100),

  // Fleet with all available cars
  ALL_AVAILABLE_FLEET: createMockCarAssets(5).map(car => ({ ...car, status: 'AVAILABLE' as const })),

  // Fleet with all leased cars
  ALL_LEASED_FLEET: createMockCarAssets(5).map(car => ({ ...car, status: 'LEASED' as const })),

  // Mixed status fleet
  MIXED_STATUS_FLEET: [
    createMockCarAsset({ id: '1', status: 'AVAILABLE' }),
    createMockCarAsset({ id: '2', status: 'LEASED' }),
    createMockCarAsset({ id: '3', status: 'IN_SERVICE' }),
    createMockCarAsset({ id: '4', status: 'SOLD' }),
    createMockCarAsset({ id: '5', status: 'DAMAGED' }),
  ],

  // Fleet with high-value cars
  LUXURY_FLEET: createMockCarAssets(3).map((car, index) => ({
    ...car,
    make: ['BMW', 'Mercedes', 'Audi'][index],
    model: ['X7', 'S-Class', 'A8'][index],
    bookValue: 500000 + (index * 100000),
  })),
};

/**
 * Common assertions for tests
 */
export const expectCarToBeDisplayed = (car: CarAsset) => ({
  vin: expect.any(HTMLElement),
  make: expect.any(HTMLElement),
  model: expect.any(HTMLElement),
  status: expect.any(HTMLElement),
});

/**
 * Mock service responses
 */
export const MOCK_API_RESPONSES = {
  SUCCESS_GET_CARS: createMockApiResponse(TEST_SCENARIOS.SMALL_FLEET),
  SUCCESS_CREATE_CAR: createMockApiResponse(createMockCarAsset()),
  SUCCESS_UPDATE_CAR: createMockApiResponse(createMockCarAsset({ color: 'Updated Color' })),
  SUCCESS_DELETE_CAR: createMockApiResponse(null, true, 204),
  
  ERROR_UNAUTHORIZED: createMockErrorResponse(401, 'Unauthorized'),
  ERROR_NOT_FOUND: createMockErrorResponse(404, 'Car not found'),
  ERROR_VIN_EXISTS: createMockErrorResponse(409, 'VIN already exists'),
  ERROR_SERVER: createMockErrorResponse(500, 'Internal Server Error'),
};