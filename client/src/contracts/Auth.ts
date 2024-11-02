export interface ApiToken {
  type: 'bearer'
  token: string
  expires_at?: string
  expires_in?: number
}

export interface RegisterData {
  firstName: string,
  lastName: string,
  nickname: string,
  email: string,
  password: string,
  passwordRepeated: string,
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
