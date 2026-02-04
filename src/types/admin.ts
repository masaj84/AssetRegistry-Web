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

// Blockchain / Merkle Batch
export interface MerkleBatch {
  id: number;
  merkleRoot: string;
  recordCount: number;
  transactionHash?: string;
  blockNumber?: number;
  chainId: number;
  status: 'Pending' | 'Anchored' | 'Failed';
  createdAt: string;
  anchoredAt?: string;
  errorMessage?: string;
}

export interface AnchoringStats {
  totalBatches: number;
  anchoredBatches: number;
  pendingBatches: number;
  failedBatches: number;
  totalRecordsAnchored: number;
  blockchain: {
    totalBatches: number;
    totalRecords: number;
  };
}

export interface BlockchainHealth {
  status: 'healthy' | 'unhealthy';
  blockchain: 'connected' | 'disconnected';
}

export interface VerificationResponse {
  isVerified: boolean;
  recordHash: string;
  merkleRoot?: string;
  batchId?: number;
  transactionHash?: string;
  blockNumber?: number;
  chainId?: number;
  anchoredAt?: string;
  blockchainVerified?: boolean;
  status: string;
  error?: string;
}

export interface BatchInfoResponse {
  batchId: number;
  merkleRoot: string;
  recordCount: number;
  status: string;
  transactionHash?: string;
  blockNumber?: number;
  chainId?: number;
  createdAt: string;
  anchoredAt?: string;
}

// Audit Log
export interface AuditLogEntry {
  id: number;
  userId?: string;
  username?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogListRequest {
  pageNumber?: number;
  pageSize?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

// Asset Detail (extended)
export interface AdminAssetDetail extends AdminAsset {
  metadata?: Record<string, unknown>;
  recordHash?: string;
  merkleBatchId?: number;
  merkleProof?: string;
  anchoredAt?: string;
}
