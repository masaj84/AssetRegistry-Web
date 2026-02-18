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
  username: string;
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
  userName: string;
}

export interface RegisterResponse {
  message: string;
  requiresEmailConfirmation: boolean;
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

export interface AssetDocument {
  id: number;
  assetId: number;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileHash: string;
  createdAt: string;
}

export type AssetStatus = 'PENDING' | 'ANCHORED' | 'MINTED';

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
  pendingAssets: number;
  anchoredAssets: number;
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
