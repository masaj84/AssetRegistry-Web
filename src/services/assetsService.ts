import { api } from '../lib/api';
import type { Asset, AssetDocument, CreateAssetRequest, UpdateAssetRequest } from '../types';

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

  async uploadDocument(assetId: number, file: File): Promise<AssetDocument> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<AssetDocument>(`/assets/${assetId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getDocuments(assetId: number): Promise<AssetDocument[]> {
    const response = await api.get<AssetDocument[]>(`/assets/${assetId}/documents`);
    return response.data;
  },

  async downloadDocument(docId: number): Promise<void> {
    const response = await api.get(`/documents/${docId}/download`, { responseType: 'blob' });
    const blob = new Blob([response.data]);
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'download';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match?.[1]) fileName = match[1].replace(/['"]/g, '');
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  async deleteDocument(docId: number): Promise<void> {
    await api.delete(`/documents/${docId}`);
  },
};
