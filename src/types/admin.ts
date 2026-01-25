// Admin Dashboard Stats
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  verifiedOrganizations: number;
  totalAssets: number;
  mintedAssets: number;
  verifiedAssets: number;
}

// Admin User
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  emailConfirmed: boolean;
  walletAddress?: string;
  organizationId?: number;
  organizationName?: string;
  organizationRole?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminUserListRequest {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  organizationId?: number;
}

export interface AdminUpdateUserRequest {
  email?: string;
  role?: string;
  isActive?: boolean;
  walletAddress?: string;
  organizationId?: number;
  organizationRole?: string;
}

// Admin Organization
export interface AdminOrganization {
  id: number;
  name: string;
  type: string;
  taxId?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  isVerified: boolean;
  createdAt: string;
  userCount: number;
}

export interface AdminOrganizationListRequest {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  isVerified?: boolean;
}

export interface AdminUpdateOrganizationRequest {
  name?: string;
  type?: string;
  taxId?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  isVerified?: boolean;
}

// Admin Asset
export interface AdminAsset {
  id: number;
  tokenId?: number;
  ownerAddress: string;
  type: string;
  status: string;
  name?: string;
  description?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  ownerUsername?: string;
  ownerEmail?: string;
  organizationId?: number;
  organizationName?: string;
}

export interface AdminAssetListRequest {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  status?: string;
  ownerAddress?: string;
  userId?: string;
  organizationId?: number;
}

// Newsletter Subscriber
export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

// Security / Locked Users
export interface LockedUser {
  id: string;
  username: string;
  email: string;
  accessFailedCount: number;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Paged Response
export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
