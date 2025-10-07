import {
    getCurrentBudget,
    upsertBudget,
    getMonthlySpent
} from "../services/budget.service.js"

export const getBudget = async (req, res) => {
    try {
        const userId = req.user.userId
        const budget = await getCurrentBudget(userId)
        const spent = await getMonthlySpent(userId)
        const limit = budget?.amount || 0

        return res.status(200).json({ limit, spent })
    } catch (error) {
        console.error('Get budget error:', error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const setBudget = async (req, res) => {
    try {
        const userId = req.user.userId
        const { amount } = req.body
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" })
        }
        const newBudget = await upsertBudget(userId, amount)
        return res.status(200).json({ message: "Budget updated", budget: newBudget })
    } catch (error) {
        console.error("Set budget error:", err)
        return res.status(500).json({ message: "Internal server error" })
    }
}