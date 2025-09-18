const API_BASE_URL = 'http://localhost:3000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string; // Combined firstName + lastName
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl?: string | null;
    country?: string | null;
    role?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
  country?: string | null;
  role?: string | null;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔵 Attempting login with:', { email: credentials.email, API_BASE_URL });
    
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('🔵 Login response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.log('🔴 Login error:', error);
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    console.log('🔵 Login successful, received user:', data.user);
    
    // Store token in localStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    console.log('🔵 Token and user data saved to localStorage');
    
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('🔵 Attempting registration with:', { ...userData, password: '[HIDDEN]' });
    
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('🔵 Registration response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.log('🔴 Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    console.log('🔵 Registration successful, received user:', data.user);
    
    // Store token in localStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    console.log('🔵 Token and user data saved to localStorage');
    
    return data;
  }

  async getProfile(): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('🔵 Profile API response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: Token is invalid or expired');
        }
        const error = await response.json().catch(() => ({ message: 'Failed to get user profile' }));
        throw new Error(error.message || 'Failed to get user profile');
      }

      const userData = await response.json();
      console.log('🔵 Profile data received:', userData);
      return userData;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🟡 Network error when fetching profile - backend might be down');
        throw new Error('Network error: Cannot connect to backend');
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getGoogleAuthUrl(): string {
    return `${API_BASE_URL}/api/auth/google`;
  }
}

export const authService = new AuthService();
