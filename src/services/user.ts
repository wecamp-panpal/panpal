import axiosClient from '@/lib/axiosClient';
import type { User } from '@/types/user';

export interface UpdateUserData {
  name?: string;
  email?: string;
  country?: string | null;
}

export const userService = {
  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  },

  // Update user by ID  
  updateUserById: async (userId: string, userData: UpdateUserData): Promise<User> => {
    const response = await axiosClient.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Upload user avatar
  uploadAvatar: async (userId: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axiosClient.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
