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

export const getAccountData = async (userId) => {
    // Accounts
    const accountsRes = await pool.query(
        `SELECT id, name, balance FROM accounts WHERE user_id = $1`,
        [userId]
    );
    const accounts = accountsRes.rows;
    return accounts
}

export const getChartData = async (userId) => {
    const currentDate = new Date();
    const previousMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
    const previousYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

    const expenseCategoriesQuery = await pool.query(
        `SELECT category, SUM(amount) as total
       FROM transactions
       WHERE user_id = $1 
       AND type = 'expense'
       AND EXTRACT(MONTH FROM created_at) = $2
       AND EXTRACT(YEAR FROM created_at) = $3
       GROUP BY category
       ORDER BY total DESC`,
        [userId, previousMonth + 1, previousYear]
    );

    // Get last 6 months income vs expense
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyDataQuery = await pool.query(
        `SELECT 
         EXTRACT(YEAR FROM created_at) as year,
         EXTRACT(MONTH FROM created_at) as month,
         type,
         SUM(amount) as total
       FROM transactions
       WHERE user_id = $1 
       AND created_at >= $2
       GROUP BY year, month, type
       ORDER BY year, month`,
        [userId, sixMonthsAgo]
    );

    // Process monthly data into a more usable format
    const monthlyMap = {};
    monthlyDataQuery.rows.forEach(row => {
        const monthKey = `${row.year}-${row.month}`;
        if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { year: row.year, month: row.month, income: 0, expense: 0 };
        }
        if (row.type === 'income') {
            monthlyMap[monthKey].income = parseInt(row.total);
        } else {
            monthlyMap[monthKey].expense = parseInt(row.total);
        }
    });

    // Convert to array and sort
    const monthlyData = Object.values(monthlyMap).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });

    // Format expense categories
    const expenseCategories = {};
    expenseCategoriesQuery.rows.forEach(row => {
        expenseCategories[row.category] = parseInt(row.total);
    });

    return {
        expenseCategories,
        monthlyData,
        previousMonth: {
            month: previousMonth + 1,
            year: previousYear + 1
        }
    }
}