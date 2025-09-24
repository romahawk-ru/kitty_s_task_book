import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import prisma from '../utils/prisma'

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorId: req.user!.userId },
          { assignedToId: req.user!.userId }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(tasks)
  } catch (error: any) {
    console.error('Ошибка получения задач:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, assignedToId } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        authorId: req.user!.userId,
        assignedToId: assignedToId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    res.status(201).json({ message: 'Задача успешно создана', task })
  } catch (error: any) {
    console.error('Ошибка создания задачи:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, dueDate, assignedToId } = req.body

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    res.json({ message: 'Задача успешно обновлена', task })
  } catch (error: any) {
    console.error('Ошибка задачи обновления:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    await prisma.task.delete({
      where: { id }
    })

    res.json({ message: 'Задача успешно удалена' })
  } catch (error: any) {
    console.error('Ошибка удаления задачи:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    })

    res.json(users)
  } catch (error: any) {
    console.error('Ошибка получения пользователя:', error)
    res.status(500).json({ 
      message: 'Ошибка сервера', 
      error: error.message 
    })
  }
}