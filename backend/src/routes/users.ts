import express from 'express'
import { getProfile, updateProfile, uploadAvatar } from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'
import { upload } from '../middleware/upload'

const router = express.Router()

router.get('/me', authMiddleware, getProfile)
router.put('/me', authMiddleware, updateProfile)
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar)

export default router