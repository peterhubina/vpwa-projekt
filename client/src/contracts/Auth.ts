export interface ApiToken {
  type: 'bearer'
  token: string
  expires_at?: string
  expires_in?: number
}

export interface RegisterData {
  email: string
  username: string
  name: string
  surname: string
  password: string
  passwordConfirmation: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

export interface User {
  id: number
  email: string
  createdAt: string,
  updatedAt: string
}

export interface ListChannel {
  id: number;
  name: string;
  isPrivate: boolean;
  ownerId: number;
  created_at: string;
  updated_at: string;
  pivot_invited: boolean;
}
