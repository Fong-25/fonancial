import pool from '../config/db.js';
import prisma from '../config/prisma.js';
import { CATEGORIES } from '../constants/categories.js'
import { getCurrentBudget, getMonthlySpent } from "./budget.service.js"

// export const getHistoryData = async (userId) => {
//     // All transactions
//     const allTransactions = await pool.query(
//         `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at, a.name AS account_name
//          FROM transactions t
//          JOIN accounts a ON t.account_id = a.id
//          WHERE t.user_id = $1
//          ORDER BY t.created_at DESC`,
//         [userId]
//     );
//     return allTransactions.rows
// }

// Prisma getHistoryData
export const getHistoryData = async (userId) => {
    const allTransactions = await prisma.transaction.findMany({
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
        }
    })

    return allTransactions.map(t => ({
        id: t.id,
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description,
        created_at: t.createdAt,
        account_name: t.account.name
    }))
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

// export const getAccountData = async (userId) => {
//     // Accounts
//     const accountsRes = await pool.query(
//         `SELECT id, name, balance FROM accounts WHERE user_id = $1`,
//         [userId]
//     );
//     const accounts = accountsRes.rows;
//     return accounts
// }

// Prisma getAccountData
export const getAccountData = async (userId) => {
    const accounts = await prisma.account.findMany({
        where: { userId },
        select: {
            id: true,
            balance: true,
            name: true
        },
        orderBy: {
            createdAt: "asc"
        }
    })

    return accounts
}

// export const getChartData = async (userId) => {
//     const currentDate = new Date();
//     const previousMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
//     const previousYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

//     const startOfPrevMonth = new Date(previousYear, previousMonth, 1)
//     const endOfPrevMonth = new Date(previousYear, previousMonth + 1, 1)

//     const expenseCategoriesQuery = await pool.query(
//         `SELECT category, SUM(amount) as total
//         FROM transactions
//         WHERE user_id = $1
//         AND type = 'expense'
//         AND created_at >= $2
//         AND created_at < $3
//         GROUP BY category
//         ORDER BY total DESC`,
//         [userId, startOfPrevMonth, endOfPrevMonth]
//     )
//     const endOfPeriod = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     endOfPeriod.setHours(0, 0, 0, 0);

//     const startOfPeriod = new Date(endOfPeriod);
//     startOfPeriod.setMonth(startOfPeriod.getMonth() - 6);

//     const monthlyDataQuery = await pool.query(
//         `SELECT 
//          EXTRACT(YEAR FROM created_at) as year,
//          EXTRACT(MONTH FROM created_at) as month,
//          type,
//          SUM(amount) as total
//        FROM transactions
//        WHERE user_id = $1 
//        AND created_at >= $2
//        AND created_at < $3 
//        GROUP BY year, month, type
//        ORDER BY year, month`,
//         [userId, startOfPeriod, endOfPeriod]
//     );

//     // Process monthly data into a more usable format
//     const monthlyMap = {};
//     monthlyDataQuery.rows.forEach(row => {
//         const monthKey = `${row.year}-${row.month}`;
//         if (!monthlyMap[monthKey]) {
//             monthlyMap[monthKey] = { year: row.year, month: row.month, income: 0, expense: 0 };
//         }
//         if (row.type === 'income') {
//             monthlyMap[monthKey].income = parseInt(row.total);
//         } else {
//             monthlyMap[monthKey].expense = parseInt(row.total);
//         }
//     });

//     // Convert to array and sort
//     const monthlyData = Object.values(monthlyMap).sort((a, b) => {
//         if (a.year !== b.year) return a.year - b.year;
//         return a.month - b.month;
//     });

//     // Format expense categories
//     const expenseCategories = {};
//     expenseCategoriesQuery.rows.forEach(row => {
//         expenseCategories[row.category] = parseInt(row.total);
//     });

//     return {
//         expenseCategories,
//         monthlyData,
//         previousMonth: {
//             month: previousMonth + 1,
//             year: previousYear
//         }
//     }
// }

// Prisma getChartData
export const getChartData = async (userId, selectedMonth = null, selectedYear = null) => {
    const currentDate = new Date()

    let targetMonth, targetYear;
    if (selectedMonth !== null && selectedYear !== null) {
        targetMonth = selectedMonth
        targetYear = selectedYear
    } else {
        targetMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
        targetYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()
    }

    const startOfMonth = new Date(targetYear, targetMonth, 1)
    const endOfMonth = new Date(targetYear, targetMonth + 1, 1)

    const expenseTransactions = await prisma.transaction.findMany({
        where: {
            userId,
            type: 'expense',
            createdAt: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        },
        select: {
            category: true,
            amount: true
        }
    })

    const expenseCategories = {}
    expenseTransactions.forEach(t => {
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Number(t.amount)
    })

    const sortedExpenseCategories = Object.fromEntries(
        Object.entries(expenseCategories).sort(([, a], [, b]) => b - a)
    )

    // Get last 6 months income vs expense
    const endOfPeriod = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    endOfPeriod.setHours(0, 0, 0, 0)

    const startOfPeriod = new Date(endOfPeriod)
    startOfPeriod.setMonth(startOfPeriod.getMonth() - 6)

    const monthlyTransactions = await prisma.transaction.findMany({
        where: {
            userId,
            type: { not: 'transfer' },
            createdAt: {
                gte: startOfPeriod,
                lt: endOfPeriod
            }
        },
        select: {
            type: true,
            amount: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    // Process monthly data into a map
    const monthlyMap = {}
    monthlyTransactions.forEach(t => {
        const date = new Date(t.createdAt)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const monthKey = `${year}-${month}`

        if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { year, month, income: 0, expense: 0 }
        }

        if (t.type === 'income') {
            monthlyMap[monthKey].income += Number(t.amount)
        } else {
            monthlyMap[monthKey].expense += Number(t.amount)
        }
    })

    // Convert to array and sort
    const monthlyData = Object.values(monthlyMap).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return a.month - b.month
    })

    return {
        expenseCategories: sortedExpenseCategories,
        monthlyData,
        selectedMonth: {
            month: targetMonth + 1,
            year: targetYear
        }
    }
}