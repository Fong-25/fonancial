import express from 'express'
import { getHistory, getCategories, getAccounts, getChart } from '../controllers/history.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/history', authMiddleware, getHistory)
router.get('/categories', authMiddleware, getCategories)
router.get('/accounts', authMiddleware, getAccounts)
router.get('/chart', authMiddleware, getChart)

export default router