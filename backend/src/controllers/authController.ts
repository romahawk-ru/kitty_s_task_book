import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { generateTokens } from '../utils/jwt'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    // Generate tokens
    const tokens = generateTokens({ userId: user.id })

    res.status(201).json({
      message: 'Пользователь успешно создан',
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    })
  } catch (error: any) {
    console.error('Ошибка регистрации:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'Неверные учетные данные' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверные учетные данные' })
    }

    // Generate tokens
    const tokens = generateTokens({ userId: user.id })

    res.json({
      message: 'Вход в систему прошел успешно',
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    })
  } catch (error: any) {
    console.error('Ошибка входа в систему:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}