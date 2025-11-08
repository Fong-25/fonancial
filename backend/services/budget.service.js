import pool from "../config/db.js"
import prisma from '../config/prisma.js'

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
