import express from 'express'
import {
    addTransaction,
    listTransactions,
    getTransaction,
    removeTransaction,
    transferBetweenAccounts
} from '../controllers/transaction.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/', authMiddleware, addTransaction)
router.get('/', authMiddleware, listTransactions)
router.get('/:id', authMiddleware, getTransaction)
router.delete('/:id', authMiddleware, removeTransaction)
router.post('/transfer', authMiddleware, transferBetweenAccounts)

export default router