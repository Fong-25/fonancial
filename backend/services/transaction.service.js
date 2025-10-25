import pool from '../config/db.js'
import prisma from '../config/prisma.js'

// export const createTransaction = async ({ userId, accountId, type, category, amount, description }) => {
//     // Insert transaction
//     const result = await pool.query(
//         `INSERT INTO transactions (user_id, account_id, type, category, amount, description)
//        VALUES ($1, $2, $3, $4, $5, $6)
//        RETURNING id, account_id, type, category, amount, description, created_at`,
//         [userId, accountId, type, category, amount, description]
//     );
//     const transaction = result.rows[0];

//     // Update account balance
//     if (type === 'income') {
//         await pool.query(`UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3`,
//             [amount, accountId, userId]);
//     } else if (type === 'expense') {
//         await pool.query(`UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3`,
//             [amount, accountId, userId]);
//     }

//     return transaction;
// };

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

// export const getTransactionsByUser = async (userId) => {
//     const result = await pool.query(
//         `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at,
//               a.name AS account_name
//        FROM transactions t
//        JOIN accounts a ON t.account_id = a.id
//        WHERE t.user_id = $1
//        ORDER BY t.created_at DESC`,
//         [userId]
//     );
//     return result.rows;
// };

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

// export const getTransactionById = async (id, userId) => {
//     const result = await pool.query(
//         `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at,
//               a.name AS account_name
//        FROM transactions t
//        JOIN accounts a ON t.account_id = a.id
//        WHERE t.id = $1 AND t.user_id = $2`,
//         [id, userId]
//     );
//     return result.rows[0] || null;
// };

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

// export const deleteTransaction = async (id, userId) => {
//     // Find transaction first
//     const trxResult = await pool.query(
//         `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
//         [id, userId]
//     );
//     const transaction = trxResult.rows[0];
//     if (!transaction) return null;

//     // Reverse account balance change
//     if (transaction.type === 'income') {
//         await pool.query(`UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3`,
//             [transaction.amount, transaction.account_id, userId]);
//     } else if (transaction.type === 'expense') {
//         await pool.query(`UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3`,
//             [transaction.amount, transaction.account_id, userId]);
//     }

//     // Delete transaction
//     await pool.query(`DELETE FROM transactions WHERE id = $1 AND user_id = $2`, [id, userId]);
//     return transaction;
// };

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

// export const createTransfer = async ({ userId, fromAccountId, toAccountId, amount, description }) => {
//     const client = await pool.connect();

//     try {
//         // Start transaction
//         await client.query('BEGIN');

//         // Verify both accounts belong to the user
//         const accountCheck = await client.query(
//             `SELECT id, balance FROM accounts WHERE id IN ($1, $2) AND user_id = $3`,
//             [fromAccountId, toAccountId, userId]
//         );

//         if (accountCheck.rows.length !== 2) {
//             throw new Error('Account not found or unauthorized');
//         }

//         const fromAccount = accountCheck.rows.find(acc => acc.id === fromAccountId);
//         const toAccount = accountCheck.rows.find(acc => acc.id === toAccountId);

//         // Check sufficient balance
//         if (Number(fromAccount.balance) < amount) {
//             throw new Error('Insufficient balance');
//         }

//         // Create expense transaction (withdrawal from fromAccount)
//         const expenseResult = await client.query(
//             `INSERT INTO transactions (user_id, account_id, type, category, amount, description)
//              VALUES ($1, $2, 'expense', 'other', $3, $4)
//              RETURNING id, created_at`,
//             [userId, fromAccountId, amount, `${description} (Transfer out)`]
//         );

//         // Create income transaction (deposit to toAccount)
//         const incomeResult = await client.query(
//             `INSERT INTO transactions (user_id, account_id, type, category, amount, description)
//              VALUES ($1, $2, 'income', 'other_income', $3, $4)
//              RETURNING id, created_at`,
//             [userId, toAccountId, amount, `${description} (Transfer in)`]
//         );

//         // Update fromAccount balance (decrease)
//         await client.query(
//             `UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3`,
//             [amount, fromAccountId, userId]
//         );

//         // Update toAccount balance (increase)
//         await client.query(
//             `UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3`,
//             [amount, toAccountId, userId]
//         );

//         // Commit transaction
//         await client.query('COMMIT');

//         return {
//             expenseTransaction: expenseResult.rows[0],
//             incomeTransaction: incomeResult.rows[0],
//             fromAccountId,
//             toAccountId,
//             amount,
//             description
//         };
//     } catch (error) {
//         // Rollback on error
//         await client.query('ROLLBACK');
//         throw error;
//     } finally {
//         client.release();
//     }
// };

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
                    type: 'expense',
                    category: 'other',
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
                    type: 'income',
                    category: 'other_income',
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