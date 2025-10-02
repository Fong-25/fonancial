import express from 'express'
import {
    addAccount,
    listAccounts,
    removeAccount
} from '../controllers/account.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/', authMiddleware, addAccount)
router.get('/', authMiddleware, listAccounts)
router.delete('/:id', authMiddleware, removeAccount)
export default router