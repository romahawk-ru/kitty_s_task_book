import { useState, useEffect } from 'react'
import { User } from '../types'
import { api } from '../utils/api'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { tokens, user } = response.data

      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)

      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      const { tokens, user } = response.data

      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)

      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  // const logout = () => {
  //   // Очищаем localStorage
  //   localStorage.removeItem('accessToken')
  //   localStorage.removeItem('refreshToken')
  //   localStorage.removeItem('user')
    
  //   // Сбрасываем состояние
  //   setUser(null)
    
  //   // Перенаправляем на страницу входа
  //   navigate('/login')
    
  //   // Принудительно перезагружаем страницу для полного сброса состояния
  //   window.location.reload()
  // }

  // Более мягкий Logout безе перезагрузки страницы
  const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  // Сбрасываем состояние
  setUser(null)
  navigate('/login', { replace: true }) // replace: true очищает историю навигации
}

  return {
    user,
    loading,
    login,
    register,
    logout
  }
}