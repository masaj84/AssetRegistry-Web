export type CarAssetStatus = 'AVAILABLE' | 'LEASED' | 'IN_SERVICE' | 'SOLD' | 'DAMAGED' | 'RESERVED';

export interface CarAsset {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string | null;
  mileage?: number | null;
  status: CarAssetStatus | string;
  location?: string | null;
  bookValue?: number | null;
  residualValue?: number | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  currentLessee?: string | null;
  organizationId: number;
  organizationName: string;
  photos?: string[] | null;
  documents?: string[] | null;
  blockchainAnchoredAt?: string | null;
  blockchainHash?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarAssetRequest {
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string | null;
  mileage?: number | null;
  location?: string | null;
  bookValue?: number | null;
  residualValue?: number | null;
  photos?: string[] | null;
}

export interface UpdateCarAssetRequest {
  color?: string | null;
  mileage?: number | null;
  status?: CarAssetStatus | string | null;
  location?: string | null;
  bookValue?: number | null;
  residualValue?: number | null;
  photos?: string[] | null;
}

export interface CarAssetSearchRequest {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  status?: string;
  location?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CarAssetSearchResponse {
  assets: CarAsset[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PublicCarAsset {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string | null;
  mileage?: number | null;
  status: string;
  dealershipName: string;
  photos?: string[] | null;
  blockchainAnchoredAt?: string | null;
  blockchainHash?: string | null;
  createdAt: string;
  updatedAt: string;
}
