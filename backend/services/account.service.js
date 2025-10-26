import pool from '../config/db.js'
import prisma from '../config/prisma.js'

// export const createAccount = async ({ userId, name }) => {
//     const result = await pool.query(
//         `INSERT INTO accounts (user_id, name, balance)
//         VALUES ($1, $2, 0)
//         RETURNING id, name, balance`,
//         [userId, name]
//     );
//     return result.rows[0]
// }

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

// export const getAccountsByUser = async (userId) => {
//     const result = await pool.query(
//         `SELECT id, name, balance, created_at
//        FROM accounts WHERE user_id = $1`,
//         [userId]
//     );
//     return result.rows;
// };

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

// export const getAccountById = async (accountId, userId) => {
//     const result = await pool.query(
//         `SELECT id, name, balance
//        FROM accounts WHERE id = $1 AND user_id = $2`,
//         [accountId, userId]
//     );
//     return result.rows[0] || null;
// };

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

// export const deleteAccount = async (accountId, userId) => {
//     const result = await pool.query(
//         `DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING id`,
//         [accountId, userId]
//     );
//     return result.rows[0] || null;
// };

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