import {
    createTransaction,
    getTransactionsByUser,
    getTransactionById,
    deleteTransaction,
    createTransfer
} from '../services/transaction.service.js'

export const addTransaction = async (req, res) => {
    try {
        const { accountId, type, category, amount, description } = req.body;
        const userId = req.user.userId;

        if (!accountId || !type || !category || !amount) {
            return res.status(400).json({ message: 'accountId, type, category and amount are required' });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'Type must be income or expense' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        const transaction = await createTransaction({
            userId,
            accountId,
            type,
            category,
            amount,
            description: description || null
        });

        return res.status(201).json(transaction);
    } catch (error) {
        console.error('Add transaction error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const listTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const transactions = await getTransactionsByUser(userId);
        return res.status(200).json(transactions);
    } catch (error) {
        console.error('List transactions error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const transaction = await getTransactionById(id, userId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(200).json(transaction);
    } catch (error) {
        console.error('Get transaction error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const deleted = await deleteTransaction(id, userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(200).json({ message: 'Transaction deleted and balance updated' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const transferBetweenAccounts = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount, description } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!fromAccountId || !toAccountId || !amount) {
            return res.status(400).json({ message: 'fromAccountId, toAccountId, and amount are required' });
        }

        if (fromAccountId === toAccountId) {
            return res.status(400).json({ message: 'Cannot transfer to the same account' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        // Perform the transfer
        const result = await createTransfer({
            userId,
            fromAccountId,
            toAccountId,
            amount,
            description: description || 'Transfer between accounts'
        });

        return res.status(201).json({
            message: 'Transfer completed successfully',
            transfer: result
        });
    } catch (error) {
        console.error('Transfer error:', error);
        if (error.message === 'Insufficient balance') {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === 'Account not found or unauthorized') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};