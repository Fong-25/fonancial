import { getHistoryData } from "../services/history.service.js";

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