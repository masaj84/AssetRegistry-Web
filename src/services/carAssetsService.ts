import type { 
  CarAsset, 
  CreateCarAssetRequest, 
  UpdateCarAssetRequest, 
  CarAssetSearchRequest,
  CarAssetSearchResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class CarAssetsService {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    return response.json();
  }

  // Get all car assets for current user's organization
  async getCarAssets(): Promise<CarAsset[]> {
    const response = await fetch(`${API_BASE_URL}/api/carassets`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Get car asset by ID
  async getCarAsset(id: string): Promise<CarAsset> {
    const response = await fetch(`${API_BASE_URL}/api/carassets/${id}`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Get car asset by VIN
  async getCarAssetByVin(vin: string): Promise<CarAsset> {
    const response = await fetch(`${API_BASE_URL}/api/carassets/vin/${vin}`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Create new car asset
  async createCarAsset(request: CreateCarAssetRequest): Promise<CarAsset> {
    const response = await fetch(`${API_BASE_URL}/api/carassets`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // Update car asset
  async updateCarAsset(id: string, request: UpdateCarAssetRequest): Promise<CarAsset> {
    const response = await fetch(`${API_BASE_URL}/api/carassets/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // Delete car asset
  async deleteCarAsset(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/carassets/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
  }

  // Search car assets
  async searchCarAssets(request: CarAssetSearchRequest): Promise<CarAssetSearchResponse> {
    const response = await fetch(`${API_BASE_URL}/api/carassets/search`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // Get fleet statistics
  async getFleetStats(): Promise<{
    totalCars: number;
    availableCars: number;
    leasedCars: number;
    inServiceCars: number;
    soldCars: number;
    topMakes: { make: string; count: number }[];
    averageYear: number;
    blockchainAnchored: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/carassets/stats`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const carAssetsService = new CarAssetsService();