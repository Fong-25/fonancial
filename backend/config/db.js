import pkg from "pg";
const { Pool } = pkg;
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
    connectionString: process.env.DB_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})

export default pool

export const connectDB = async () => {
    try {
        // pool.connect()
        console.log('PostgreSQL connected!')
    } catch (error) {
        console.error('Error connecting to PostgreSQL: ', error)
        process.exit(1)
    }
}