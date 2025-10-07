import pool from '../config/db.js';
import { CATEGORIES } from '../constants/categories.js'
import { getCurrentBudget, getMonthlySpent } from "./budget.service.js"

export const getDashboardData = async (userId) => {
    // User info
    const userRes = await pool.query(
        `SELECT id, username, email FROM users WHERE id = $1`,
        [userId]
    );
    const user = userRes.rows[0];

    // Accounts
    const accountsRes = await pool.query(
        `SELECT id, name, balance FROM accounts WHERE user_id = $1`,
        [userId]
    );
    const accounts = accountsRes.rows;

    // Total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // Monthly income/expense summary
    const summaryRes = await pool.query(
        `SELECT type, SUM(amount) as total
     FROM transactions
     WHERE user_id = $1
       AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
     GROUP BY type`,
        [userId]
    );
    const summary = { income: 0, expense: 0 };
    summaryRes.rows.forEach(r => summary[r.type] = Number(r.total));

    // Recent transactions (last 5)
    const trxRes = await pool.query(
        `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at, a.name AS account_name
     FROM transactions t
     JOIN accounts a ON t.account_id = a.id
     WHERE t.user_id = $1
     ORDER BY t.created_at DESC
     LIMIT 5`,
        [userId]
    );

    // Separate categories by type
    const expenseCategories = CATEGORIES.filter(cat => cat.type === 'expense');
    const incomeCategories = CATEGORIES.filter(cat => cat.type === 'income');

    const budget = await getCurrentBudget(userId)
    const totalBudget = budget?.amount || 0
    const totalSpent = await getMonthlySpent(userId)

    return {
        user,
        accounts,
        totalBalance,
        summary,
        recentTransactions: trxRes.rows,
        categories: {
            expense: expenseCategories,
            income: incomeCategories,
            all: CATEGORIES
        },
        budget: { totalBudget, totalSpent }
    };
};
