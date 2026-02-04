import { api } from '../lib/api';
import type {
  AdminDashboardStats,
  AdminUser,
  AdminUserListRequest,
  AdminUpdateUserRequest,
  AdminOrganization,
  AdminOrganizationListRequest,
  AdminUpdateOrganizationRequest,
  AdminAsset,
  AdminAssetDetail,
  AdminAssetListRequest,
  NewsletterSubscriber,
  LockedUser,
  PagedResponse,
  AnchoringStats,
  BlockchainHealth,
  BatchInfoResponse,
  VerificationResponse,
  AuditLogEntry,
  AuditLogListRequest,
} from '../types/admin';

export const adminService = {
  // Dashboard
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await api.get<AdminDashboardStats>('/admin/dashboard');
    return response.data;
  },

  // Users
  async getUsers(params?: AdminUserListRequest): Promise<PagedResponse<AdminUser>> {
    const response = await api.get<PagedResponse<AdminUser>>('/admin/users', { params });
    return response.data;
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await api.get<AdminUser>(`/admin/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: AdminUpdateUserRequest): Promise<AdminUser> {
    const response = await api.put<AdminUser>(`/admin/users/${id}`, data);
    return response.data;
  },

  async activateUser(id: string): Promise<AdminUser> {
    const response = await api.patch<AdminUser>(`/admin/users/${id}/activate`);
    return response.data;
  },

  async deactivateUser(id: string): Promise<AdminUser> {
    const response = await api.patch<AdminUser>(`/admin/users/${id}/deactivate`);
    return response.data;
  },

  // Organizations
  async getOrganizations(params?: AdminOrganizationListRequest): Promise<PagedResponse<AdminOrganization>> {
    const response = await api.get<PagedResponse<AdminOrganization>>('/admin/organizations', { params });
    return response.data;
  },

  async getOrganizationById(id: number): Promise<AdminOrganization> {
    const response = await api.get<AdminOrganization>(`/admin/organizations/${id}`);
    return response.data;
  },

  async updateOrganization(id: number, data: AdminUpdateOrganizationRequest): Promise<AdminOrganization> {
    const response = await api.put<AdminOrganization>(`/admin/organizations/${id}`, data);
    return response.data;
  },

  async verifyOrganization(id: number): Promise<AdminOrganization> {
    const response = await api.patch<AdminOrganization>(`/admin/organizations/${id}/verify`);
    return response.data;
  },

  async unverifyOrganization(id: number): Promise<AdminOrganization> {
    const response = await api.patch<AdminOrganization>(`/admin/organizations/${id}/unverify`);
    return response.data;
  },

  // Assets
  async getAssets(params?: AdminAssetListRequest): Promise<PagedResponse<AdminAsset>> {
    const response = await api.get<PagedResponse<AdminAsset>>('/admin/assets', { params });
    return response.data;
  },

  // Newsletter
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const response = await api.get<NewsletterSubscriber[]>('/newsletter/subscribers');
    return response.data;
  },

  // Security
  async getLockedUsers(): Promise<LockedUser[]> {
    const response = await api.get<LockedUser[]>('/admin/security/locked-users');
    return response.data;
  },

  async unlockUser(id: string): Promise<void> {
    await api.post(`/admin/security/users/${id}/unlock`);
  },

  async resetAccessFailedCount(id: string): Promise<void> {
    await api.post(`/admin/security/users/${id}/reset-failed-count`);
  },

  async confirmUserEmail(id: string): Promise<void> {
    await api.post(`/admin/security/users/${id}/confirm-email`);
  },

  async setLockoutEnabled(id: string, enabled: boolean): Promise<void> {
    await api.post(`/admin/security/users/${id}/set-lockout`, { enabled });
  },

  // Asset Detail
  async getAssetById(id: number): Promise<AdminAssetDetail> {
    const response = await api.get<AdminAssetDetail>(`/assets/${id}`);
    return response.data;
  },

  // Blockchain / Verification
  async getAnchoringStats(): Promise<AnchoringStats> {
    const response = await api.get<AnchoringStats>('/verification/stats');
    return response.data;
  },

  async getBlockchainHealth(): Promise<BlockchainHealth> {
    const response = await api.get<BlockchainHealth>('/verification/health');
    return response.data;
  },

  async getBatchInfo(batchId: number): Promise<BatchInfoResponse> {
    const response = await api.get<BatchInfoResponse>(`/verification/batch/${batchId}`);
    return response.data;
  },

  async verifyAsset(assetId: number): Promise<VerificationResponse> {
    const response = await api.get<VerificationResponse>(`/verification/asset/${assetId}`);
    return response.data;
  },

  async verifyHash(recordHash: string): Promise<VerificationResponse> {
    const response = await api.get<VerificationResponse>(`/verification/hash/${recordHash}`);
    return response.data;
  },

  // Audit Log (if backend supports it)
  async getAuditLogs(params?: AuditLogListRequest): Promise<PagedResponse<AuditLogEntry>> {
    const response = await api.get<PagedResponse<AuditLogEntry>>('/admin/audit-logs', { params });
    return response.data;
  },
};
