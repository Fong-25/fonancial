import pool from '../config/db.js'
import prisma from '../config/prisma.js'

// export const createUser = async ({ username, email, password }) => {
//     const result = await pool.query(
//         `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
//         [username, email, password]
//     )
//     return result.rows[0]
// }

// Prisma createUser
export const createUser = async ({ username, email, password }) => {
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password
        },
        select: {
            id: true,
            username: true,
            email: true
        }
    })
    return user
}

export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
}

// export const getUserByEmail = async (email) => {
//     const result = await pool.query(
//         `SELECT * FROM users WHERE email = $1`,
//         [email]
//     )
//     return result.rows[0] || null
// }

// Prisma getUserByEmail
export const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    return user
}


// export const getUserById = async (id) => {
//     const result = await pool.query(
//         `SELECT * FROM users WHERE id = $1`,
//         [id]
//     )
//     return result.rows[0] || null
// }

// Prisma getUserById
export const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id }
    })
    return user
}

// export const getUserByUsername = async (username) => {
//     const result = await pool.query(
//         `SELECT * FROM users WHERE username = $1`,
//         [username]
//     )
//     return result.rows[0] || null
// }

// Prisma getUserByUsername
export const getUserByUsername = async (username) => {
    const user = await prisma.user.findUnique({
        where: { username }
    })
    return user
}