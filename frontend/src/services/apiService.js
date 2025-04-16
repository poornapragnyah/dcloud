import { BACKEND_API } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseUrl = BACKEND_API || '';
  }

  async request(endpoint, method = 'GET', data = null, headers = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        credentials: 'include'
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'API request failed');
        }
        
        return result;
      } else {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'API request failed');
        }
        return await response.text();
      }
    } catch (error) {
      console.error('API Service Error:', error);
      throw error;
    }
  }

  // User authentication endpoints
  async login(walletAddress, signature) {
    return this.request('/auth/login', 'POST', { walletAddress, signature });
  }

  async logout() {
    return this.request('/auth/logout', 'POST');
  }

  // File metadata endpoints
  async getFileMetadata(cid) {
    return this.request(`/files/${cid}/metadata`);
  }

  async saveFileMetadata(metadata) {
    return this.request('/files/metadata', 'POST', metadata);
  }

  async updateFileMetadata(cid, metadata) {
    return this.request(`/files/${cid}/metadata`, 'PUT', metadata);
  }

  // Stats and analytics
  async getUserStats() {
    return this.request('/user/stats');
  }

  async getSystemStats() {
    return this.request('/system/stats');
  }

  // Search functionality
  async searchFiles(query) {
    return this.request(`/files/search?q=${encodeURIComponent(query)}`);
  }
}

export default new ApiService();
