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
      return res.status(400).json({ message: 'User already exists' })
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
      message: 'User created successfully',
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      message: 'Server error', 
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
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate tokens
    const tokens = generateTokens({ userId: user.id })

    res.json({
      message: 'Login successful',
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}