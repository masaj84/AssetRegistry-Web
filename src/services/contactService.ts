import { api, getErrorMessage } from '../lib/api';

export interface DemoRequestPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export const contactService = {
  async sendDemoRequest(payload: DemoRequestPayload): Promise<void> {
    await api.post('/contact/demo-request', payload);
  },
};

export { getErrorMessage };
