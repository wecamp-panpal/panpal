import axiosClient from '@/lib/axiosClient';
import axios from 'axios';

// Cache for getCurrentUser to prevent multiple concurrent requests
let currentUserPromise: Promise<any> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache

export async function getCurrentUser() {
  // Check if we have a recent cached result or ongoing request
  const now = Date.now();
  if (currentUserPromise && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Using cached getCurrentUser result');
    return currentUserPromise;
  }

  // Check if we have a token first
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log('No access token found');
    return null;
  }

  // Create new request
  lastFetchTime = now;
  currentUserPromise = (async () => {
    try {
      console.log('Fetching current user from API');
      const response = await axiosClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear localStorage
          localStorage.removeItem('access_token');
          console.warn('Token expired, cleared from localStorage');
        } else if (error.response?.status === 429) {
          console.error('Too many requests to auth/profile');
        } else {
          console.error('getCurrentUser error:', error.response?.status, error.message);
        }
      }
      return null;
    }
  })();

  return currentUserPromise;
}
// define types for API
interface LoginRequest{
    email:string;
    password:string;
}
interface RegisterRequest{
    email: string;
    password: string;
    name: string;

}
interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    // ... other fields
  };
  token?: string; 
  accessToken?: string;
}

export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
    try{
        const response = await axiosClient.post('/auth/login', credentials);
        // save token after login successfully
        if(response.data.accessToken){
            localStorage.setItem('access_token', response.data.accessToken);
            // Clear cache so next getCurrentUser call fetches fresh data
            clearCurrentUserCache();
        }
        return {
            success:true,
            user: response.data.user,
            token: response.data.accessToken,
        }
    }
    catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw new Error('Login failed');
    }
}

export async function registerUser(userData: RegisterRequest): Promise<AuthResponse> {
    try{
        const response=await axiosClient.post('/auth/register', userData);

        // Save token after register successfully
        if(response.data.accessToken){
            localStorage.setItem('access_token', response.data.accessToken);
            // Clear cache so next getCurrentUser call fetches fresh data
            clearCurrentUserCache();
        }
        return {
            success: true,
            user: response.data.user,
            token: response.data.accessToken,
        }

    }
    catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
}

// Function to clear user cache - call after login/logout/update
export function clearCurrentUserCache() {
  currentUserPromise = null;
  lastFetchTime = 0;
  console.log('Current user cache cleared');
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem('access_token');
  
  clearCurrentUserCache();
  
  // Optional: Call backend logout endpoint if it exists
  try {
    await axiosClient.post('/auth/logout');
  } catch (error) {
    // Ignore errors on logout call, as we're clearing local state anyway
    console.log('Logout endpoint not available or failed, but local token cleared');
  }
}

