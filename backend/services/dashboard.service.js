import pool from '../config/db.js';
import prisma from '../config/prisma.js';
import { CATEGORIES } from '../constants/categories.js'
import { getCurrentBudget, getMonthlySpent } from "./budget.service.js"

export const getDashboardData = async (userId) => {
    // User info
    // const userRes = await pool.query(
    //     `SELECT id, username, email FROM users WHERE id = $1`,
    //     [userId]
    // );
    // const user = userRes.rows[0];

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true
        }
    })

    // Accounts
    // const accountsRes = await pool.query(
    //     `SELECT id, name, balance FROM accounts WHERE user_id = $1`,
    //     [userId]
    // );
    // const accounts = accountsRes.rows;
    const accounts = await prisma.account.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            balance: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    // Total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // Monthly income/expense summary
    // const summaryRes = await pool.query(
    //     `SELECT type, SUM(amount) as total
    //  FROM transactions
    //  WHERE user_id = $1
    //    AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
    //  GROUP BY type`,
    //     [userId]
    // );
    // const summary = { income: 0, expense: 0 };
    // summaryRes.rows.forEach(r => summary[r.type] = Number(r.total));

    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)


    // Recent transactions (last 5)
    // const trxRes = await pool.query(
    //     `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at, a.name AS account_name
    //  FROM transactions t
    //  JOIN accounts a ON t.account_id = a.id
    //  WHERE t.user_id = $1
    //  ORDER BY t.created_at DESC
    //  LIMIT 5`,
    //     [userId]
    // );

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            createdAt: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        },
        select: {
            type: true,
            amount: true
        }
    })

    const summary = { income: 0, expense: 0 }
    transactions.forEach(t => {
        summary[t.type] = (summary[t.type] || 0) + Number(t.amount)
    })

    const recentTransactions = await prisma.transaction.findMany({
        where: { userId },
        include: {
            account: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    })

    const formattedRecentTransactions = recentTransactions.map(t => ({
        id: t.id,
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description,
        created_at: t.createdAt,
        account_name: t.account.name
    }))

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
        recentTransactions: formattedRecentTransactions,
        categories: {
            expense: expenseCategories,
            income: incomeCategories,
            all: CATEGORIES
        },
        budget: { totalBudget, totalSpent }
    };
};
