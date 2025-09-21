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
    console.error('Get tasks error:', error)
    res.status(500).json({ 
      message: 'Server error', 
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

    res.status(201).json({ message: 'Task created successfully', task })
  } catch (error: any) {
    console.error('Create task error:', error)
    res.status(500).json({ 
      message: 'Server error', 
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

    res.json({ message: 'Task updated successfully', task })
  } catch (error: any) {
    console.error('Update task error:', error)
    res.status(500).json({ 
      message: 'Server error', 
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

    res.json({ message: 'Task deleted successfully' })
  } catch (error: any) {
    console.error('Delete task error:', error)
    res.status(500).json({ 
      message: 'Server error', 
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
    console.error('Get users error:', error)
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}