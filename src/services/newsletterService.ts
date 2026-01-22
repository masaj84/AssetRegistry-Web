import { api, getErrorMessage } from '../lib/api';

export interface NewsletterSubscribeResponse {
  message: string;
}

export const newsletterService = {
  async subscribe(email: string): Promise<NewsletterSubscribeResponse> {
    const response = await api.post<NewsletterSubscribeResponse>('/newsletter/subscribe', { email });
    return response.data;
  },

  async unsubscribe(email: string): Promise<NewsletterSubscribeResponse> {
    const response = await api.post<NewsletterSubscribeResponse>('/newsletter/unsubscribe', { email });
    return response.data;
  },

  async isSubscribed(email: string): Promise<boolean> {
    const response = await api.get<{ email: string; isSubscribed: boolean }>('/newsletter/is-subscribed', {
      params: { email }
    });
    return response.data.isSubscribed;
  }
};

export { getErrorMessage };
