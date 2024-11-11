export interface ListChannel {
  id: number;
  name: string;
  isPrivate: boolean;
  ownerId: number;
  created_at: string;
  updated_at: string;
  pivot_invited: boolean;
  is_typing?: IsTyping[];
}

export interface IsTyping {
  user: User;
  message: string;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  author: Author;
  createdAt: Date;
}

export interface Author {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  remember_me_token: null
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  state: UserStatus;
}

export type UserStatus = 'online' | 'dnd' | 'offline';
