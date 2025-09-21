import express from 'express'
import { getTasks, createTask, updateTask, deleteTask, getUsers } from '../controllers/taskController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.get('/', authMiddleware, getTasks)
router.post('/', authMiddleware, createTask)
router.put('/:id', authMiddleware, updateTask)
router.delete('/:id', authMiddleware, deleteTask)
router.get('/users', authMiddleware, getUsers)

export default router