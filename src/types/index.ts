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

export interface AssetDocument {
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

// Backend OrganizationType enum — serialized as int (integer index in enum order).
// Order matches AssetRegistry.Contracts.Organizations.OrganizationType.cs.
export const OrganizationTypeEnum = {
  DEALERSHIP: 0,
  LEASING: 1,
  NOTARY: 2,
  INSURANCE: 3,
  AUCTION: 4,
  GALLERY: 5,
  REAL_ESTATE: 6,
  MARINA: 7,
  OTHER: 8,
} as const;
export type OrganizationTypeKey = keyof typeof OrganizationTypeEnum;

export interface CreateOrganizationRequest {
  name: string;
  type: number;
  taxId?: string | null;
  address?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export interface CreateOrganizationResponse {
  organization: Organization;
  token: string;
  refreshToken: string;
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
