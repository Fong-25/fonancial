import {
    createAccount,
    getAccountsByUser,
    getAccountById,
    deleteAccount
} from '../services/account.service.js'

export const addAccount = async (req, res) => {
    try {
        const { name } = req.body
        const userId = req.user.userId // from authMiddleware
        if (!name) {
            return res.status(400).json({ message: 'Name is required' })
        }
        // if (!['cash', 'card'].includes(type)) {
        //     return res.status(400).json({ message: 'Type must be cash or card' });
        // }
        const account = await createAccount({ userId, name })
        return res.status(201).json({ message: 'Account created successfully', account })
    } catch (error) {
        console.error('Add account error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const listAccounts = async (req, res) => {
    try {
        const userId = req.user.userId // from authMiddleware
        const accounts = await getAccountsByUser(userId)
        return res.status(200).json(accounts)
    } catch (error) {
        console.error('List accounts error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const removeAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const accountId = req.params.id;
        const deleted = await deleteAccount(accountId, userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Account not found' });
        }
        return res.status(200).json({ message: 'Account deleted' });
    } catch (error) {
        console.error('Remove account error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
