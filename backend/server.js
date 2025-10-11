import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.route.js'
import accountRoutes from './routes/account.route.js'
import transactionRoutes from './routes/transaction.route.js'
import dashboardRoutes from './routes/dashboard.route.js'
import budgetRoutes from './routes/budget.route.js'
import path from 'path'

dotenv.config()

const app = express()
const __dirname = path.resolve()

// app.use(cors({
//     origin: ["http://localhost:5173", "https://fong-fonancial.onrender.com", "capacitor://localhost", "http://localhost", "https://localhost"],
//     credentials: true,
// }))

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://fong-fonancial.onrender.com",
            "capacitor://localhost",
            "http://localhost",
            "https://localhost"
        ];

        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.use('/api/auth', authRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/budget', budgetRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})