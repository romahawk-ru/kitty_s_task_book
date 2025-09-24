import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  UserIcon,
  ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Дашборд', href: '/dashboard', icon: HomeIcon },
    { name: 'Задачи', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Профиль', href: '/profile', icon: UserIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-74 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-18 px-2 py-2 bg-primary-600">
            <img className='w-20 h-20' src="/public/logo.webp" alt="Cat logo"/>
            <h1 className="text-white text-xl font-bold">Kitty's Task Book</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={user?.avatarUrl || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    console.log('Ошибка загрузки аватара:', user?.avatarUrl)
                    ;(e.target as HTMLImageElement).src = '/default-avatar.png'
                  }}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default Layout