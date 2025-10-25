import pool from "../config/db.js"
import prisma from '../config/prisma.js'

// Get current month budget
// export const getCurrentBudget = async (userId) => {
//     const res = await pool.query(
//         `SELECT amount
//      FROM budgets
//      WHERE user_id = $1
//        AND month = EXTRACT(MONTH FROM CURRENT_DATE)
//        AND year = EXTRACT(YEAR FROM CURRENT_DATE)
//      LIMIT 1`,
//         [userId]
//     )
//     return res.rows[0] || null
// }

// Prisma getCurrentBudget
export const getCurrentBudget = async (userId) => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // 0-indexed
    const currentYear = currentDate.getFullYear()

    const budget = await prisma.budget.findFirst({
        where: {
            userId,
            month: currentMonth,
            year: currentYear
        },
        select: {
            amount: true
        }
    })

    return budget
}

// Create or update current month budget
// export const upsertBudget = async (userId, amount) => {
//     const res = await pool.query(
//         `INSERT INTO budgets (user_id, amount, month, year)
//      VALUES ($1, $2, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE))
//      ON CONFLICT (user_id, month, year)
//      DO UPDATE SET amount = EXCLUDED.amount
//      RETURNING *`,
//         [userId, amount]
//     )
//     return res.rows[0]
// }

// Prisma upsertBudget
export const upsertBudget = async (userId, amount) => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    // Check if budget exists
    const existingBudget = await prisma.budget.findFirst({
        where: {
            userId,
            month: currentMonth,
            year: currentYear
        }
    })
    let budget
    if (existingBudget) {
        // Update existing budget
        budget = await prisma.budget.update({
            where: { id: existingBudget.id },
            data: { amount }
        })
    } else {
        // Create new budget
        budget = await prisma.budget.create({
            data: {
                userId,
                amount,
                month: currentMonth,
                year: currentYear
            }
        })
    }
    return budget
}

// Calculate total spent for current month
// export const getMonthlySpent = async (userId) => {
//     const res = await pool.query(
//         `SELECT COALESCE(SUM(amount), 0) AS spent
//      FROM transactions
//      WHERE user_id = $1
//        AND type = 'expense'
//        AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)`,
//         [userId]
//     )
//     return Number(res.rows[0].spent)
// }

// Prisma getMonthlySpent
export const getMonthlySpent = async (userId) => {
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)

    const result = await prisma.transaction.aggregate({
        where: {
            userId,
            type: 'expense',
            createdAt: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        },
        _sum: {
            amount: true
        }
    })

    return Number(result._sum.amount || 0)
}
