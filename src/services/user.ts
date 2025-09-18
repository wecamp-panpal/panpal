import type { User } from './auth';

const API_BASE_URL = 'http://localhost:3000';

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  country?: string;
}

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    console.log('🔍 Getting auth headers - Token exists:', !!token);
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getCurrentUser(): Promise<User> {
    console.log('🔵 Fetching current user profile');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('🔵 Get current user response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to get user profile' }));
        throw new Error(error.message || 'Failed to get user profile');
      }

      const userData = await response.json();
      console.log('🔵 Current user data received:', userData);
      return userData;
    } catch (error) {
      console.error('🔴 Error fetching current user:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: UpdateUserRequest): Promise<User> {
    console.log('🔵 Updating current user profile:', updateData);
    
    const headers = this.getAuthHeaders();
    console.log('🔵 Request headers:', headers);
    console.log('🔵 API URL:', `${API_BASE_URL}/api/users/${userId}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData),
      });

      console.log('🔵 Update profile response status:', response.status);
      console.log('🔵 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔴 Raw error response:', errorText);
        
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: 'Failed to update profile', details: errorText };
        }
        
        console.log('🔴 Parsed error:', error);
        throw new Error(error.message || `HTTP ${response.status}: Failed to update profile`);
      }

      const userData = await response.json();
      console.log('🔵 Updated user data received:', userData);
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('🔴 Error updating profile:', error);
      throw error;
    }
  }

  async uploadAvatar(avatarFile: File): Promise<User> {
    console.log('🔵 Uploading avatar');
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      console.log('🔵 Upload avatar response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to upload avatar' }));
        throw new Error(error.message || 'Failed to upload avatar');
      }

      const userData = await response.json();
      console.log('🔵 Avatar upload successful, updated user data:', userData);
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('🔴 Error uploading avatar:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
