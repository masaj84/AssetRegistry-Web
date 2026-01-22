import { api } from '../lib/api';
import type { Asset, CreateAssetRequest, UpdateAssetRequest } from '../types';

export interface GetAssetsParams {
  ownerAddress?: string;
  type?: string;
  status?: string;
}

export const assetsService = {
  async getAll(params?: GetAssetsParams): Promise<Asset[]> {
    const response = await api.get<Asset[]>('/assets', { params });
    return response.data;
  },

  async getById(id: number): Promise<Asset> {
    const response = await api.get<Asset>(`/assets/${id}`);
    return response.data;
  },

  async create(data: CreateAssetRequest): Promise<Asset> {
    const response = await api.post<Asset>('/assets', data);
    return response.data;
  },

  async update(id: number, data: UpdateAssetRequest): Promise<Asset> {
    const response = await api.put<Asset>(`/assets/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  async verify(id: number): Promise<Asset> {
    const response = await api.patch<Asset>(`/assets/${id}/verify`);
    return response.data;
  },

  async mint(id: number): Promise<Asset> {
    const response = await api.post<Asset>(`/assets/${id}/mint`);
    return response.data;
  },

  async batchMint(ids: number[]): Promise<Asset[]> {
    const response = await api.post<Asset[]>('/assets/batch-mint', { assetIds: ids });
    return response.data;
  },

  async toggleFavorite(id: number, isFavorite: boolean): Promise<Asset> {
    const response = await api.put<Asset>(`/assets/${id}`, { isFavorite });
    return response.data;
  },
};
