import pool from '../config/db.js'

export const createTransaction = async ({ userId, accountId, type, category, amount, description }) => {
    // Insert transaction
    const result = await pool.query(
        `INSERT INTO transactions (user_id, account_id, type, category, amount, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, account_id, type, category, amount, description, created_at`,
        [userId, accountId, type, category, amount, description]
    );
    const transaction = result.rows[0];

    // Update account balance
    if (type === 'income') {
        await pool.query(`UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3`,
            [amount, accountId, userId]);
    } else if (type === 'expense') {
        await pool.query(`UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3`,
            [amount, accountId, userId]);
    }

    return transaction;
};

export const getTransactionsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at,
              a.name AS account_name
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC`,
        [userId]
    );
    return result.rows;
};

export const getTransactionById = async (id, userId) => {
    const result = await pool.query(
        `SELECT t.id, t.type, t.category, t.amount, t.description, t.created_at,
              a.name AS account_name
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE t.id = $1 AND t.user_id = $2`,
        [id, userId]
    );
    return result.rows[0] || null;
};

export const deleteTransaction = async (id, userId) => {
    // Find transaction first
    const trxResult = await pool.query(
        `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    const transaction = trxResult.rows[0];
    if (!transaction) return null;

    // Reverse account balance change
    if (transaction.type === 'income') {
        await pool.query(`UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3`,
            [transaction.amount, transaction.account_id, userId]);
    } else if (transaction.type === 'expense') {
        await pool.query(`UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3`,
            [transaction.amount, transaction.account_id, userId]);
    }

    // Delete transaction
    await pool.query(`DELETE FROM transactions WHERE id = $1 AND user_id = $2`, [id, userId]);
    return transaction;
};

export const createTransfer = async ({ userId, fromAccountId, toAccountId, amount, description }) => {
    const client = await pool.connect();

    try {
        // Start transaction
        await client.query('BEGIN');

        // Verify both accounts belong to the user
        const accountCheck = await client.query(
            `SELECT id, balance FROM accounts WHERE id IN ($1, $2) AND user_id = $3`,
            [fromAccountId, toAccountId, userId]
        );

        if (accountCheck.rows.length !== 2) {
            throw new Error('Account not found or unauthorized');
        }

        const fromAccount = accountCheck.rows.find(acc => acc.id === fromAccountId);
        const toAccount = accountCheck.rows.find(acc => acc.id === toAccountId);

        // Check sufficient balance
        if (Number(fromAccount.balance) < amount) {
            throw new Error('Insufficient balance');
        }

        // Create expense transaction (withdrawal from fromAccount)
        const expenseResult = await client.query(
            `INSERT INTO transactions (user_id, account_id, type, category, amount, description)
             VALUES ($1, $2, 'expense', 'other', $3, $4)
             RETURNING id, created_at`,
            [userId, fromAccountId, amount, `${description} (Transfer out)`]
        );

        // Create income transaction (deposit to toAccount)
        const incomeResult = await client.query(
            `INSERT INTO transactions (user_id, account_id, type, category, amount, description)
             VALUES ($1, $2, 'income', 'other_income', $3, $4)
             RETURNING id, created_at`,
            [userId, toAccountId, amount, `${description} (Transfer in)`]
        );

        // Update fromAccount balance (decrease)
        await client.query(
            `UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3`,
            [amount, fromAccountId, userId]
        );

        // Update toAccount balance (increase)
        await client.query(
            `UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3`,
            [amount, toAccountId, userId]
        );

        // Commit transaction
        await client.query('COMMIT');

        return {
            expenseTransaction: expenseResult.rows[0],
            incomeTransaction: incomeResult.rows[0],
            fromAccountId,
            toAccountId,
            amount,
            description
        };
    } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
