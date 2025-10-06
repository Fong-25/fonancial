import { ArrowUpRight, ArrowDownRight, ShoppingBag, Home, Car, Coffee, Briefcase } from "lucide-react"

// // Placeholder data based on database schema
// const transactions = [
//     {
//         id: 1,
//         type: "income",
//         category: "Salary",
//         amount: 6500.0,
//         description: "Monthly Salary",
//         created_at: "2025-01-01T10:00:00Z",
//         icon: Briefcase,
//     },
//     {
//         id: 2,
//         type: "expense",
//         category: "Groceries",
//         amount: 156.8,
//         description: "Whole Foods Market",
//         created_at: "2025-01-15T14:30:00Z",
//         icon: ShoppingBag,
//     },
//     {
//         id: 3,
//         type: "expense",
//         category: "Rent",
//         amount: 2500.0,
//         description: "Monthly Rent Payment",
//         created_at: "2025-01-01T09:00:00Z",
//         icon: Home,
//     },
//     {
//         id: 4,
//         type: "expense",
//         category: "Transportation",
//         amount: 85.5,
//         description: "Gas Station",
//         created_at: "2025-01-18T16:45:00Z",
//         icon: Car,
//     },
//     {
//         id: 5,
//         type: "expense",
//         category: "Food & Dining",
//         amount: 42.3,
//         description: "Starbucks",
//         created_at: "2025-01-20T08:15:00Z",
//         icon: Coffee,
//     },
// ]

export default function RecentTransactions({ transactions, categories }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })
    }

    const getCategoryDetails = (categoryKey) => {
        const category = categories.all.find(cat => cat.key === categoryKey)
        return category || { label: categoryKey, icon: "🪙" }
    }


    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Recent Transactions</h2>

            <div className="space-y-4">
                {transactions.length === 0 ? (
                    <p className="text-muted-foreground">No transactions yet</p>
                ) : (
                    transactions.map((transaction) => {
                        const isIncome = transaction.type === "income"
                        const categoryDetails = getCategoryDetails(transaction.category)
                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                                <div className={`p-2 rounded-lg ${isIncome ? "bg-success/10" : "bg-destructive/10"}`}>
                                    {isIncome ? (
                                        <ArrowUpRight className="w-5 h-5 text-success text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="w-5 h-5 text-destructive text-red-500" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{transaction.description || categoryDetails.label}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">{categoryDetails.icon} {categoryDetails.label}</span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">{transaction.account_name}</span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">{formatDate(transaction.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className={`font-semibold ${isIncome ? "text-success" : "text-destructive"}`}>
                                        {isIncome ? "+" : "-"}{Number(transaction.amount).toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
