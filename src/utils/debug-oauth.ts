// Debug utility for OAuth testing
import axiosClient from '@/lib/axiosClient';

export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await axiosClient.get('/health');
    console.log('Backend health check:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

export const validateFirebaseToken = async (token: string) => {
  try {
    console.log('Validating Firebase token with backend...');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 50) + '...');
    
    const response = await axiosClient.post('/auth/firebase/oauth', 
      { token }, 
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': undefined // Don't send auth header for oauth endpoint
        }
      }
    );
    
    console.log('Backend validation successful:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Firebase token validation failed:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status 
    };
  }
};

export const debugFirebaseAuth = () => {
  console.log('Firebase Config Debug:');
  console.log('Auth Domain:', 'panpal-api.firebaseapp.com');
  console.log('Project ID:', 'panpal-api');
  console.log('App ID:', '1:984938034444:web:6ef113f4b60593c75c4529');
};