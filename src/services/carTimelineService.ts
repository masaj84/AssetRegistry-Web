import { api } from '../lib/api';
import type {
  CarTimelineEntry,
  AddCarTimelineEntryRequest,
  PublicCarTimelineEntry,
} from '../types/timeline';

export const carTimelineService = {
  async list(carId: string): Promise<CarTimelineEntry[]> {
    const response = await api.get<CarTimelineEntry[]>(`/CarAssets/${carId}/timeline`);
    return response.data;
  },

  async add(carId: string, data: AddCarTimelineEntryRequest): Promise<CarTimelineEntry> {
    const response = await api.post<CarTimelineEntry>(`/CarAssets/${carId}/timeline`, data);
    return response.data;
  },

  async listPublic(carId: string): Promise<PublicCarTimelineEntry[]> {
    const response = await api.get<PublicCarTimelineEntry[]>(`/CarAssets/public/${carId}/timeline`);
    return response.data;
  },
};
