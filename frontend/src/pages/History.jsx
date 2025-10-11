"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Filter } from "lucide-react"
import TransactionFilter from "../components/TransactionFilter"

export default function History() {
    const navigate = useNavigate()
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        account: "all",
        type: "all",
        category: "all",
        fromDate: "",
        toDate: "",
    })

    // Placeholder transaction data based on database schema
    const allTransactions = [
        {
            id: 1,
            user_id: 1,
            account_id: 1,
            account_name: "Card BIDV",
            type: "expense",
            category: "Food",
            amount: 50000,
            description: "Lunch at restaurant",
            created_at: "2025-10-08T12:30:00",
        },
        {
            id: 2,
            user_id: 1,
            account_id: 2,
            account_name: "Cash",
            type: "income",
            category: "Salary",
            amount: 100000,
            description: "Monthly salary",
            created_at: "2025-10-01T09:00:00",
        },
        {
            id: 3,
            user_id: 1,
            account_id: 1,
            account_name: "Card BIDV",
            type: "expense",
            category: "Transport",
            amount: 25000,
            description: "Taxi to work",
            created_at: "2025-10-07T08:15:00",
        },
        {
            id: 4,
            user_id: 1,
            account_id: 2,
            account_name: "Cash",
            type: "expense",
            category: "Shopping",
            amount: 150000,
            description: "New clothes",
            created_at: "2025-10-06T15:45:00",
        },
        {
            id: 5,
            user_id: 1,
            account_id: 1,
            account_name: "Card BIDV",
            type: "income",
            category: "Parents",
            amount: 200000,
            description: "Gift from parents",
            created_at: "2025-10-05T10:00:00",
        },
        {
            id: 6,
            user_id: 1,
            account_id: 2,
            account_name: "Cash",
            type: "expense",
            category: "Rent",
            amount: 300000,
            description: "Monthly rent payment",
            created_at: "2025-10-01T00:00:00",
        },
        {
            id: 7,
            user_id: 1,
            account_id: 1,
            account_name: "Card BIDV",
            type: "expense",
            category: "Food",
            amount: 35000,
            description: "Grocery shopping",
            created_at: "2025-10-04T18:20:00",
        },
        {
            id: 8,
            user_id: 1,
            account_id: 2,
            account_name: "Cash",
            type: "income",
            category: "Scholarship",
            amount: 500000,
            description: "University scholarship",
            created_at: "2025-10-03T14:00:00",
        },
        {
            id: 9,
            user_id: 1,
            account_id: 1,
            account_name: "Card BIDV",
            type: "expense",
            category: "Other",
            amount: 75000,
            description: "Medical checkup",
            created_at: "2025-10-02T11:30:00",
        },
        {
            id: 10,
            user_id: 1,
            account_id: 2,
            account_name: "Cash",
            type: "expense",
            category: "Transport",
            amount: 15000,
            description: "Bus fare",
            created_at: "2025-10-01T07:45:00",
        },
    ]

    // Filter transactions based on selected filters
    const filteredTransactions = allTransactions.filter((transaction) => {
        const accountMatch = filters.account === "all" || transaction.account_name === filters.account
        const typeMatch = filters.type === "all" || transaction.type === filters.type
        const categoryMatch = filters.category === "all" || transaction.category === filters.category

        // Date range filtering
        const transactionDate = new Date(transaction.created_at)
        const fromDateMatch = !filters.fromDate || transactionDate >= new Date(filters.fromDate)
        const toDateMatch = !filters.toDate || transactionDate <= new Date(filters.toDate + "T23:59:59")

        return accountMatch && typeMatch && categoryMatch && fromDateMatch && toDateMatch
    })

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount)
    }

    const getCategoryEmoji = (category) => {
        const emojiMap = {
            Food: "🍔",
            Rent: "🏠",
            Shopping: "🛍️",
            Transport: "🚗",
            Salary: "💼",
            Scholarship: "🎓",
            Parents: "👨‍👩‍👧",
            Other: "📦",
        }
        return emojiMap[category] || "📦"
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="p-2 hover:bg-accent rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold">Transaction History</h1>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Component */}
                {showFilters && (
                    <div className="mb-6">
                        <TransactionFilter filters={filters} setFilters={setFilters} />
                    </div>
                )}

                {/* Transaction Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredTransactions.length} of {allTransactions.length} transactions
                </div>

                {/* Transactions List */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {filteredTransactions.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">No transactions found matching your filters</div>
                    ) : (
                        <div className="divide-y divide-border">
                            {filteredTransactions.map((transaction) => (
                                <div key={transaction.id} className="p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="text-2xl flex-shrink-0">{getCategoryEmoji(transaction.category)}</div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-foreground truncate">{transaction.description}</h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                    <span>{transaction.category}</span>
                                                    <span>•</span>
                                                    <span>{transaction.account_name}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(transaction.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <div
                                                className={`text-lg font-bold ${transaction.type === "income"
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-red-600 dark:text-red-400"
                                                    }`}
                                            >
                                                {transaction.type === "income" ? "+" : "-"}
                                                {formatAmount(transaction.amount)} đ
                                            </div>
                                            <div
                                                className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${transaction.type === "income"
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}
                                            >
                                                {transaction.type}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
