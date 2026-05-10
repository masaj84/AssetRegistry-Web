import { api, setTokens } from '../lib/api';
import type {
  Organization,
  CreateOrganizationRequest,
  CreateOrganizationResponse,
} from '../types';

export const organizationsService = {
  async getMy(): Promise<Organization> {
    const response = await api.get<Organization>('/organizations/my');
    return response.data;
  },

  /**
   * Creates a new organization and assigns the caller as ORG_ADMIN.
   * Returned tokens carry the new organization_id / organization_role claims —
   * stored immediately so subsequent requests are org-scoped.
   */
  async create(data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const response = await api.post<CreateOrganizationResponse>('/organizations', data);
    const { token, refreshToken } = response.data;
    setTokens(token, refreshToken);
    return response.data;
  },
};
