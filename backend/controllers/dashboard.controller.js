import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId
        const data = await getDashboardData(userId)
        return res.status(200).json(data)
    } catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}