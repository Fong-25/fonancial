import pool from '../config/db.js'

export const createAccount = async ({ userId, name }) => {
    const result = await pool.query(
        `INSERT INTO accounts (user_id, name, balance)
        VALUES ($1, $2, 0)
        RETURNING id, name, balance`,
        [userId, name]
    );
    return result.rows[0]
}

export const getAccountsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT id, name, balance, created_at
       FROM accounts WHERE user_id = $1`,
        [userId]
    );
    return result.rows;
};

export const getAccountById = async (accountId, userId) => {
    const result = await pool.query(
        `SELECT id, name, balance
       FROM accounts WHERE id = $1 AND user_id = $2`,
        [accountId, userId]
    );
    return result.rows[0] || null;
};

export const deleteAccount = async (accountId, userId) => {
    const result = await pool.query(
        `DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING id`,
        [accountId, userId]
    );
    return result.rows[0] || null;
};