export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  department?: string;
  avatarUrl?: string;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  plan: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  company: Company;
}
