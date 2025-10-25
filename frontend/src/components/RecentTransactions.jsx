import { ArrowUpRight, ArrowDownRight, ShoppingBag, Home, Car, Coffee, Briefcase, History } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function RecentTransactions({ transactions, categories }) {
    // const formatDate = (dateString) => {
    //     return new Date(dateString).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })
    // }

    const navigate = useNavigate()

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "Invalid date";

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed

        return `${day}/${month}`;
    }


    const getCategoryDetails = (categoryKey) => {
        const category = categories.all.find(cat => cat.key === categoryKey)
        return category || { label: categoryKey, icon: "🪙" }
    }


    return (
        <div className="bg-card border border-border rounded-lg lg:p-3 p-2">
            <div className="flex justify-between mb-0">

                <h2 className="text-lg font-semibold text-foreground mb-0 transform m-2">Recent Transactions</h2>

                <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-1 px-2 py-1.5 text-sm bg-accent hover:bg-accent/80 rounded-lg transition-colors font-medium mb-6 m-2 ml-1"
                >
                    <History className="w-4 h-4" />
                    View All History
                </button>
            </div>

            <div className="space-y-4 m-3 mt-1 p-0">
                {transactions.length === 0 ? (
                    <p className="text-muted-foreground">No transactions yet</p>
                ) : (
                    transactions.map((transaction) => {
                        const isIncome = transaction.type === "income"
                        const categoryDetails = getCategoryDetails(transaction.category)
                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center gap-1 p-0 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors -translate-x-2"
                            >
                                <div className={`lg:p-2 p-1 rounded-lg ${isIncome ? "bg-success/10" : "bg-destructive/10"}`}>
                                    {isIncome ? (
                                        <ArrowUpRight className="w-5 h-5 text-success text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="w-5 h-5 text-destructive text-red-500" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{transaction.description || categoryDetails.label}</p>
                                    <div className="flex items-center gap-1 mt-1">
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
