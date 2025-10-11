import { getHistoryData, getCategoriesData } from "../services/history.service.js";

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