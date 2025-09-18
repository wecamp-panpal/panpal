export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url?: string | null;
  country?: string | null;
  role?: string | null;
  created_at: string;
  updated_at: string;
}
