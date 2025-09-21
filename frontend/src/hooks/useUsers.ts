import { useQuery } from '@tanstack/react-query'
import { User } from '../types'
import { api } from '../utils/api'

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/tasks/users')
      return response.data
    },
    enabled: false // Будем включать только когда нужно
  })
}