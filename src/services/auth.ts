export async function getCurrentUser() {
  const res = await fetch("http://localhost:3000/api/auth/profile", {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json(); // { id, name, ... }
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
  token?: string; // Will be mapped from accessToken
  accessToken?: string; // Raw response field
}// Base API function
import axiosClient from '@/lib/axiosClient';
import axios from 'axios';

export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
    try{
        const response = await axiosClient.post('/auth/login', credentials);
        // save token after login successfully
        if(response.data.accessToken){
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user data if needed
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

