import pool from '../config/db.js'
import prisma from '../config/prisma.js'

// Prisma createAccount
export const createAccount = async ({ userId, name }) => {
    const account = await prisma.account.create({
        data: {
            userId,
            name,
            balance: 0
        },
        select: {
            id: true,
            name: true,
            balance: true
        }
    })
    return account
}

// Prisma getAccountsByUser
export const getAccountsByUser = async (userId) => {
    const accounts = await prisma.account.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            balance: true,
            createdAt: true
        },
        orderBy: {
            createdAt: "asc" // ascendent
        }
    })
    return accounts
}

// Prisma getAccountById
export const getAccountById = async (accountId, userId) => {
    const account = prisma.account.findFirst({
        where: {
            id: accountId,
            userId
        },
        select: {
            id: true,
            name: true,
            balance: true
        }
    })
    return account
}

// Prisma deleteAccount
export const deleteAccount = async (accountId, userId) => {
    try {
        const account = prisma.account.delete({
            where: {
                id: accountId,
                userId
            }
        })
        return account
    } catch (error) {
        return null
    }
}