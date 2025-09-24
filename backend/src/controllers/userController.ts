import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true
      }
    })

    res.json(user)
  } catch (error: any) {
    console.error('Ошибка получения профиля:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body

    console.log('Обновление профиля пользователя:', req.user!.userId)
    console.log('Новое имя:', name)

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true
      }
    })

    console.log('Обновленный полльзователь:', user)

    res.json({ 
      message: 'Профиль успешно обновлен', 
      user 
    })
  } catch (error: any) {
    console.error('Ошибка обновления профиля:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' })
    }

    // Используем относительный путь через proxy
    const avatarUrl = `/uploads/avatars/${req.file.filename}`

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true
      }
    })

    res.json({ message: 'Аватар успешно загружен', user })
  } catch (error: any) {
    console.error('Ошибка при загрузке аватара:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}