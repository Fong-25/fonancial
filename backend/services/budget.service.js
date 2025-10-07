import pool from "../config/db.js"

// Get current month budget
export const getCurrentBudget = async (userId) => {
    const res = await pool.query(
        `SELECT amount
     FROM budgets
     WHERE user_id = $1
       AND month = EXTRACT(MONTH FROM CURRENT_DATE)
       AND year = EXTRACT(YEAR FROM CURRENT_DATE)
     LIMIT 1`,
        [userId]
    )
    return res.rows[0] || null
}

// Create or update current month budget
export const upsertBudget = async (userId, amount) => {
    const res = await pool.query(
        `INSERT INTO budgets (user_id, amount, month, year)
     VALUES ($1, $2, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE))
     ON CONFLICT (user_id, month, year)
     DO UPDATE SET amount = EXCLUDED.amount
     RETURNING *`,
        [userId, amount]
    )
    return res.rows[0]
}

// Calculate total spent for current month
export const getMonthlySpent = async (userId) => {
    const res = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) AS spent
     FROM transactions
     WHERE user_id = $1
       AND type = 'expense'
       AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)`,
        [userId]
    )
    return Number(res.rows[0].spent)
}
