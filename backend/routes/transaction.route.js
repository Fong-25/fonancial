import express from 'express'
import {
    addTransaction,
    listTransactions,
    getTransaction,
    removeTransaction
} from '../controllers/transaction.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/', authMiddleware, addTransaction)
router.get('/', authMiddleware, listTransactions)
router.get('/:id', authMiddleware, getTransaction)
router.delete('/:id', authMiddleware, removeTransaction)

export default router