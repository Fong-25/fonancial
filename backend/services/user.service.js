import pool from '../config/db.js'

export const createUser = async ({ username, email, password }) => {
    const result = await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
        [username, email, password]
    )
    return result.rows[0]
}

export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
}

export const getUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    )
    return result.rows[0] || null
}

export const getUserById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    )
    return result.rows[0] || null
}

export const getUserByUsername = async (username) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    )
    return result.rows[0] || null
}