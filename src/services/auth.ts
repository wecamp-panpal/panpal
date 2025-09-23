import axiosClient from '@/lib/axiosClient';
import axios from 'axios';

// Create a separate axios instance for OAuth without automatic token injection
const oauthAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

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
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user data if needed

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
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user data if needed

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
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Clear cache
    clearCurrentUserCache();
    
  
}

// Utitlity function to check authentication status
export function isAuthenticated():boolean{
    return !!localStorage.getItem('access_token');
}

export async function loginWithFirebase(firebaseToken:string):Promise<AuthResponse>{
    try{
      console.log('Sending Firebase token to backend:', firebaseToken.substring(0, 20) + '...');
      
      // Try with Authorization header first (common pattern for Firebase OAuth)
      console.log('Trying Authorization header approach...');
      const response = await oauthAxios.post('/auth/firebase/oauth', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`,
        }
      });
      
      console.log('Backend response:', response.data);
      
      if(response.data.accessToken){
        localStorage.setItem('access_token',response.data.accessToken);
        localStorage.setItem('user',JSON.stringify(response.data.user));
        clearCurrentUserCache();
      }
      return {
        success:true,
        user:response.data.user,
        token:response.data.accessToken,
      }
    }
    catch(error){
      if(axios.isAxiosError(error)){
        console.error('Authorization header approach failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        
        // If Authorization header approach fails, try request body approach
        if (error.response?.status === 401) {
          console.log('Trying request body approach...');
          try {
            const retryResponse = await oauthAxios.post('/auth/firebase/oauth', {
              token: firebaseToken,
              idToken: firebaseToken,
              firebaseToken: firebaseToken // Try multiple field names
            }, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            console.log('Backend response (request body):', retryResponse.data);
            
            if(retryResponse.data.accessToken){
              localStorage.setItem('access_token',retryResponse.data.accessToken);
              localStorage.setItem('user',JSON.stringify(retryResponse.data.user));
              clearCurrentUserCache();
            }
            return {
              success:true,
              user:retryResponse.data.user,
              token:retryResponse.data.accessToken,
            }
          } catch (retryError) {
            console.error('Request body approach also failed:', retryError);
            if (axios.isAxiosError(retryError)) {
              console.error('Retry error details:', {
                status: retryError.response?.status,
                data: retryError.response?.data,
              });
            }
            throw error; // Throw original error
          }
        }
        
        throw new Error(error.response?.data?.message || `Firebase login failed: ${error.response?.status} ${error.response?.statusText}`);
      }
      console.error('Firebase OAuth Non-Axios Error:', error);
      throw new Error('Firebase login failed');
    }
}