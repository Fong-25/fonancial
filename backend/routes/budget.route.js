import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { setBudget, getBudget } from '../controllers/budget.controller.js'

const router = express.Router()

router.get('/', authMiddleware, getBudget)
router.post('/', authMiddleware, setBudget)

export default router