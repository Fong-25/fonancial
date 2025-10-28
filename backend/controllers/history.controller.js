import { getHistoryData, getCategoriesData, getAccountData, getChartData } from "../services/history.service.js";

export const getHistory = async (req, res) => {
    try {
        const userId = req.user.userId
        const data = await getHistoryData(userId)
        return res.status(200).json(data)
    } catch (error) {
        console.error("History error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getCategories = async (req, res) => {
    try {
        const data = await getCategoriesData()
        return res.status(200).json(data)
    } catch (error) {
        console.error("History error 2:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAccounts = async (req, res) => {
    try {
        const userId = req.user.userId
        const data = await getAccountData(userId)
        return res.status(200).json(data)
    } catch (error) {
        console.error("History error 3:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getChart = async (req, res) => {
    try {
        const userId = req.user.userId
        const { month, year } = req.query

        // Convert to numbers if provided
        const selectedMonth = month ? parseInt(month) - 1 : null  // Convert to 0-based
        const selectedYear = year ? parseInt(year) : null

        const data = await getChartData(userId, selectedMonth, selectedYear)
        return res.status(200).json(data)
    } catch (error) {
        console.error("Error fetching chart data", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}