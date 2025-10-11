import express from 'express'
import { getHistory, getCategories } from '../controllers/history.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/history', authMiddleware, getHistory)
router.get('/categories', authMiddleware, getCategories)

export default router