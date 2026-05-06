import { api } from '../lib/api';
import type {
  CarAsset,
  CreateCarAssetRequest,
  UpdateCarAssetRequest,
  CarAssetSearchRequest,
  CarAssetSearchResponse,
  PublicCarAsset,
} from '../types/carAsset';

export const carAssetsService = {
  async getAll(): Promise<CarAsset[]> {
    const response = await api.get<CarAsset[]>('/CarAssets');
    return response.data;
  },

  async getById(id: string): Promise<CarAsset> {
    const response = await api.get<CarAsset>(`/CarAssets/${id}`);
    return response.data;
  },

  async getPublicById(id: string): Promise<PublicCarAsset> {
    const response = await api.get<PublicCarAsset>(`/CarAssets/public/${id}`);
    return response.data;
  },

  async getByVin(vin: string): Promise<CarAsset> {
    const response = await api.get<CarAsset>(`/CarAssets/vin/${vin.toUpperCase()}`);
    return response.data;
  },

  async search(request: CarAssetSearchRequest): Promise<CarAssetSearchResponse> {
    const response = await api.post<CarAssetSearchResponse>('/CarAssets/search', request);
    return response.data;
  },

  async create(data: CreateCarAssetRequest): Promise<CarAsset> {
    const response = await api.post<CarAsset>('/CarAssets', data);
    return response.data;
  },

  async update(id: string, data: UpdateCarAssetRequest): Promise<CarAsset> {
    const response = await api.put<CarAsset>(`/CarAssets/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/CarAssets/${id}`);
  },

  async getStats(): Promise<{
    totalCars: number;
    availableCars: number;
    leasedCars: number;
    inServiceCars: number;
    soldCars: number;
    averageYear: number;
    blockchainAnchored: number;
    topMakes: Array<{ make: string; count: number }>;
  }> {
    const response = await api.get('/CarAssets/stats');
    return response.data;
  },
};
