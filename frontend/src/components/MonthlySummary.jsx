import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react"

// // Placeholder data based on database schema
// const monthlyData = {
//     income: 6500.0,
//     expenses: 4774.6,
//     month: "January",
//     year: 2025,
// }

export default function MonthlySummary({ summary }) {
    const income = summary.income || 0
    const expenses = summary.expense || 0
    const netIncome = income - expenses
    const savingsRate = income > 0 ? ((netIncome / income) * 100).toFixed(1) : 0
    const isPositive = netIncome >= 0

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Monthly Summary</h2>
                <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleString("vi-VN", { month: "long", year: "numeric" })}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Income */}
                <div className="bg-green-50 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-success text-green-500" />
                        <span className="text-sm font-medium text-foreground">Income</span>
                    </div>
                    <p className="text-2xl font-bold text-success">
                        {income.toLocaleString("vi-VN")} ₫
                    </p>
                </div>

                {/* Expenses */}
                <div className="bg-red-50 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-destructive text-red-500" />
                        <span className="text-sm font-medium text-foreground">Expenses</span>
                    </div>
                    <p className="text-2xl font-bold text-destructive">
                        {expenses.toLocaleString("vi-VN")} ₫
                    </p>
                </div>

                {/* Net Income */}
                <div
                    className={`
                        ${isPositive ? "bg-green-200 border-success/20" : "bg-red-200 border-destructive/20"
                        } border rounded-lg p-4`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className={`w-5 h-5 ${isPositive ? "text-success" : "text-destructive"}`} />
                        <span className="text-sm font-medium text-foreground">Net Income</span>
                    </div>
                    {/* <p className="text-2xl font-bold text-primary">
                        {netIncome.toLocaleString("vi-VN")} ₫
                    </p> */}
                    <p className={`text-2xl font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
                        {isPositive ? "+" : "-"}{Math.abs(netIncome).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-xs text-foreground mt-1">{savingsRate}% savings rate</p>
                </div>
            </div>
        </div>
    )
}
