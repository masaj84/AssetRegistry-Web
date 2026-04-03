// Auth types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  walletAddress?: string;
  organizationId?: number;
  organizationName?: string;
  organizationRole?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
  walletAddress?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName?: string;
}

export interface RegisterResponse {
  message: string;
  requiresEmailConfirmation: boolean;
}

export interface OAuthUrlResponse {
  url: string;
  state: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state: string;
}

export interface OAuthCallbackResponse extends LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    provider: 'google' | 'facebook';
  };
}

// Asset types
export interface Asset {
  id: number;
  tokenId?: number;
  ownerAddress: string;
  type: string;
  status: AssetStatus;
  metadata: AssetMetadata;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  documents?: AssetDocument[];
}

export interface AssetMetadata {
  name?: string;
  description?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  year?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  purchaseCurrency?: string;
  images?: string[];
  documents?: string[];
  [key: string]: unknown;
}

// Car Asset types for leasing companies
export interface CarAsset {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  mileage?: number;
  status: CarAssetStatus;
  location?: string;
  bookValue?: number;
  residualValue?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  currentLessee?: string;
  organizationId: number;
  organizationName: string;
  photos?: string[];
  documents?: string[];
  blockchainAnchoredAt?: string;
  blockchainHash?: string;
  createdAt: string;
  updatedAt: string;
}

export type CarAssetStatus = 'AVAILABLE' | 'LEASED' | 'IN_SERVICE' | 'SOLD' | 'DAMAGED' | 'RESERVED';

export interface CreateCarAssetRequest {
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  mileage?: number;
  location?: string;
  bookValue?: number;
  residualValue?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  currentLessee?: string;
  photos?: string[];
}

export interface UpdateCarAssetRequest {
  color?: string;
  mileage?: number;
  status?: CarAssetStatus;
  location?: string;
  bookValue?: number;
  residualValue?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  currentLessee?: string;
  photos?: string[];
}

export interface CarAssetSearchRequest {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  status?: CarAssetStatus;
  location?: string;
  organizationId?: number;
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

export interface AssetDocument {
  id: number;
  assetId: number;
  filename: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileHash: string;
  uploadedAt: string;
}

export interface CarAssetDocument {
  id: number;
  assetId: number;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileHash: string;
  createdAt: string;
}

export type AssetStatus = 'DRAFT' | 'VERIFIED' | 'MINTED';

export interface CreateAssetRequest {
  ownerAddress: string;
  type: string;
  metadata: AssetMetadata;
}

export interface UpdateAssetRequest {
  type?: string;
  metadata?: AssetMetadata;
  isFavorite?: boolean;
}

// Organization types
export interface Organization {
  id: number;
  name: string;
  type: string;
  taxId?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  isVerified: boolean;
  createdAt: string;
}

export type OrganizationRole = 'MEMBER' | 'ADMIN';

export interface OrganizationMember {
  id: string;
  email: string;
  userName: string;
  organizationRole: OrganizationRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Profile types
export interface UpdateProfileRequest {
  email?: string;
  walletAddress?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Dashboard types
export interface DashboardStats {
  totalAssets: number;
  draftAssets: number;
  verifiedAssets: number;
  mintedAssets: number;
  assetsByType: Record<string, number>;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
