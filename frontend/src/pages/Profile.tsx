import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)

  /////
  const handleNameUpdate = async (e: React.FormEvent) => {
  e.preventDefault()
  if (name === user?.name) return

  setLoading(true)
  setError('')
  setMessage('')

  try {
    const response = await api.put('/users/me', { name })
    if (response.data.user) {
      updateUser(response.data.user)
      setMessage('Имя успешно обновлено')
      
      // Принудительное обновление через секунду
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  } catch (error: any) {
    setError(error.response?.data?.message || 'Не удалось обновить имя')
  } finally {
    setLoading(false)
  }
}

const handleAvatarUpload = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!avatar) return

  setAvatarLoading(true)
  setError('')
  setMessage('')

  try {
    const formData = new FormData()
    formData.append('avatar', avatar)

    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    })

    if (response.data.user) {
      updateUser(response.data.user)
      setMessage('Аватар загружен успешно')
      setAvatar(null)
      
      // Принудительное обновление для применения изменений
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  } catch (error: any) {
    console.error('Ошибка при загрузке аватара:', error)
    setError(error.response?.data?.message || 'Не удалось загрузить аватар')
  } finally {
    setAvatarLoading(false)
  }
}

  /////

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Проверка размера файла
      if (file.size > 10 * 1024 * 1024) {
        setError('Размер файла более 10MB')
        return
      }
      
      setAvatar(file)
      setError('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Настройки профиля</h1>

      <div className="card">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Секция аватара */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Аватар
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatarUrl || '/default-avatar.png'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png'
              }}
            />
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                disabled={avatarLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Выберите вайл изображение (JPG, PNG, GIF) не более 10MB
              </p>
              {avatar && (
                <div className="mt-2">
                  <p className="text-xs text-green-600">
                    Выбран файл: {avatar.name} ({(avatar.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <button
                    onClick={handleAvatarUpload}
                    disabled={avatarLoading}
                    className="btn-primary mt-2 text-sm px-3 py-1 disabled:opacity-50"
                  >
                    {avatarLoading ? 'Загрузка...' : 'Загрузить аватар'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Секция имени */}
        <form onSubmit={handleNameUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Полное имя
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || name === user?.name}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Обновление...' : 'Обновить Имя'}
            </button>
          </div>
        </form>

        {/* Секция email */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            className="input-field bg-gray-100"
            disabled
          />
          <p className="text-sm text-gray-500 mt-1">
            Email нельзя изменить
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile