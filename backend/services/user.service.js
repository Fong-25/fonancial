import pool from '../config/db.js'
import prisma from '../config/prisma.js'

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

// Prisma getUserByEmail
export const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    return user
}

// Prisma getUserById
export const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id }
    })
    return user
}

// Prisma getUserByUsername
export const getUserByUsername = async (username) => {
    const user = await prisma.user.findUnique({
        where: { username }
    })
    return user
}