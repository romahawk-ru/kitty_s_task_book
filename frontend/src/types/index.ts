export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  createdAt: string
  updatedAt: string
  authorId: string
  assignedToId?: string
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>
  assignedTo?: Pick<User, 'id' | 'name' | 'avatarUrl'>
}

export interface AuthResponse {
  message: string
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: User
}