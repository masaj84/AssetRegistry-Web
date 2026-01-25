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
  AdminAssetListRequest,
  NewsletterSubscriber,
  LockedUser,
  PagedResponse,
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
};
