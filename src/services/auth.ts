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
    firstName: string;
    lastName: string;

}
interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  token?: string;
}
// Base API function
const API_BASE_URL = 'http://localhost:3000/api/auth'; 
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Auth functions
export async function loginUser(credentials:LoginRequest):Promise<AuthResponse> {
    return apiCall<AuthResponse>('/login',{
        method: 'POST',
        body: JSON.stringify(credentials),
    })

}
export async function registerUser(userData: RegisterRequest): Promise<AuthResponse> {
  return apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

