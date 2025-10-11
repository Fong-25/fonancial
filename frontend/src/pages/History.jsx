"use client"

import { useState, useEffect, use } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Filter } from "lucide-react"
import TransactionFilter from "../components/TransactionFilter"

export default function History() {
    const navigate = useNavigate()
    const [showFilters, setShowFilters] = useState(false)
    const [allTransactions, setAllTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filters, setFilters] = useState({
        account: "all",
        type: "all",
        category: "all",
        fromDate: "",
        toDate: "",
    })
    const fetchHistory = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
                credentials: "include",
            })
            if (res.ok) {
                const allTransactions = await res.json()
                setAllTransactions(allTransactions)
                console.log("History data:", allTransactions)
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])
    // Filter transactions based on selected filters
    const filteredTransactions = allTransactions?.filter((transaction) => {
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!allTransactions) {
        return <p className="text-center text-red-500">Failed to load History</p>
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
