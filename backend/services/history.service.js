import pool from '../config/db.js';
import { CATEGORIES } from '../constants/categories.js'
import { getCurrentBudget, getMonthlySpent } from "./budget.service.js"

export const getHistoryData = async (userId) => {
    // All transactions
    const allTransactions = await pool.query(
        `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at, a.name AS account_name
         FROM transactions t
         JOIN accounts a ON t.account_id = a.id
         WHERE t.user_id = $1
         ORDER BY t.created_at DESC`,
        [userId]
    );
    return allTransactions.rows
}

export const getCategoriesData = async () => {
    const expenseCategories = CATEGORIES.filter(cat => cat.type === 'expense');
    const incomeCategories = CATEGORIES.filter(cat => cat.type === 'income');

    return {
        categories: {
            expense: expenseCategories,
            income: incomeCategories,
            all: CATEGORIES
        },
    }
}