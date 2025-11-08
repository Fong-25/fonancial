import pool from '../config/db.js'
import prisma from '../config/prisma.js'

// Prisma createTransaction
export const createTransaction = async ({ userId, accountId, type, category, amount, description }) => {
    const result = await prisma.$transaction(async (tx) => {
        const transaction = prisma.transaction.create({
            data: {
                userId,
                accountId: Number(accountId),
                type,
                category,
                amount,
                description
            },
            select: {
                id: true,
                accountId: true,
                type: true,
                category: true,
                amount: true,
                description: true,
                createdAt: true
            }
        })

        if (type === 'income') {
            await tx.account.update({
                where: {
                    id: Number(accountId),
                    userId
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })
        } else if (type === 'expense') {
            await tx.account.update({
                where: {
                    id: Number(accountId),
                    userId
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            })
        }
        return transaction
    })
    return result
}

// Prisma getTransactionsByUser
export const getTransactionsByUser = async (userId) => {
    const transactions = await prisma.transaction.findMany({
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
    return transactions.map(t => ({
        id: t.id,
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description,
        created_at: t.createdAt,
        account_name: t.account.name
    }))
}


// Prisma getTransactionById
export const getTransactionById = async (id, userId) => {
    const transaction = await prisma.transaction.findFirst({
        where: {
            id,
            userId
        },
        include: {
            account: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!transaction) return null

    // Format to match old structure
    return {
        id: transaction.id,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        created_at: transaction.createdAt,
        account_name: transaction.account.name
    }
}

// Prisma deleteTransaction
export const deleteTransaction = async (id, userId) => {
    try {
        // Use transaction to ensure both operations succeed or fail together
        const result = await prisma.$transaction(async (tx) => {
            // Find transaction first
            const transaction = await tx.transaction.findFirst({
                where: {
                    id,
                    userId
                }
            })

            if (!transaction) return null

            // Reverse account balance change
            if (transaction.type === 'income') {
                await tx.account.update({
                    where: {
                        id: transaction.accountId,
                        userId
                    },
                    data: {
                        balance: {
                            decrement: transaction.amount
                        }
                    }
                })
            } else if (transaction.type === 'expense') {
                await tx.account.update({
                    where: {
                        id: transaction.accountId,
                        userId
                    },
                    data: {
                        balance: {
                            increment: transaction.amount
                        }
                    }
                })
            }

            // Delete transaction
            await tx.transaction.delete({
                where: { id }
            })

            return transaction
        })

        return result
    } catch (error) {
        console.error('Delete transaction error:', error)
        return null
    }
}

// Prisma createTransfer
export const createTransfer = async ({ userId, fromAccountId, toAccountId, amount, description }) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Verify both accounts belong to the user
            const accounts = await tx.account.findMany({
                where: {
                    id: { in: [fromAccountId, toAccountId] },
                    userId
                }
            })

            if (accounts.length !== 2) {
                throw new Error('Account not found or unauthorized')
            }

            const fromAccount = accounts.find(acc => acc.id === fromAccountId)

            // Check sufficient balance
            if (Number(fromAccount.balance) < amount) {
                throw new Error('Insufficient balance')
            }

            // Create expense transaction (withdrawal from fromAccount)
            const expenseTransaction = await tx.transaction.create({
                data: {
                    userId,
                    accountId: fromAccountId,
                    type: 'transfer',
                    category: 'transfer_out',
                    amount,
                    description: `${description} (Transfer out)`
                },
                select: {
                    id: true,
                    createdAt: true
                }
            })

            // Create income transaction (deposit to toAccount)
            const incomeTransaction = await tx.transaction.create({
                data: {
                    userId,
                    accountId: toAccountId,
                    type: 'transfer',
                    category: 'transfer_in',
                    amount,
                    description: `${description} (Transfer in)`
                },
                select: {
                    id: true,
                    createdAt: true
                }
            })

            // Update fromAccount balance (decrease)
            await tx.account.update({
                where: {
                    id: fromAccountId,
                    userId
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            })

            // Update toAccount balance (increase)
            await tx.account.update({
                where: {
                    id: toAccountId,
                    userId
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })

            return {
                expenseTransaction,
                incomeTransaction,
                fromAccountId,
                toAccountId,
                amount,
                description
            }
        })

        return result
    } catch (error) {
        throw error
    }
}