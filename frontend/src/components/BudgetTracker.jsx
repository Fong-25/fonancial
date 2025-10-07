"use client"

import { useState } from "react"
import { TrendingUp, X, Edit2 } from "lucide-react"
import toast from "react-hot-toast"

export default function ({ budgetData, onBudgetUpdated }) {
    const currentMonth = new Date().toLocaleString("vi-VN", { month: "long" })
    const currentYear = new Date().getFullYear

    const [showEditForm, setShowEditForm] = useState(false)
    const [newBudgetAmount, setNewBudgetAmount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const hasBudget = budgetData?.totalBudget > 0
    const budgetAmount = budgetData?.totalBudget || 0
    const currentExpenses = budgetData?.totalSpent || 0
    const progressPercentage = (currentExpenses / budgetAmount) * 100

    const getProgressColor = () => {
        if (progressPercentage < 50) return "bg-emerald-500"
        if (progressPercentage < 75) return "bg-yellow-500"
        if (progressPercentage < 90) return "bg-orange-500"
        return "bg-red-500"
    }

    const getTextColor = () => {
        if (progressPercentage < 50) return "text-emerald-500"
        if (progressPercentage < 75) return "text-yellow-500"
        if (progressPercentage < 90) return "text-orange-500"
        return "text-red-500"
    }

    const handleSubmitBudget = async (e) => {
        e.preventDefault()
        const amount = Number.parseFloat(newBudgetAmount)

        if (!amount || amount <= 0) {
            toast.error("Please enter a valid budget amount")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budget`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount }),
            })

            if (res.ok) {
                toast.success(hasBudget ? "Budget updated successfully!" : "Budget set successfully!")
                setNewBudgetAmount("")
                setShowEditForm(false)
                if (onBudgetUpdated) {
                    onBudgetUpdated()
                }
            } else {
                const error = await res.json()
                toast.error(error.message || "Failed to set budget")
            }
        } catch (error) {
            console.error("Budget submission error:", error)
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }
    // If no budget exists, show form to set one
    if (!hasBudget) {
        return (
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">Budget Tracker</h2>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                        No budget set for {currentMonth} {currentYear}
                    </p>

                    <form onSubmit={handleSubmitBudget} className="max-w-sm mx-auto">
                        <label className="block text-sm font-medium text-foreground mb-2">Set Monthly Budget</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">đ</span>
                                <input
                                    type="number"
                                    value={newBudgetAmount}
                                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                                disabled={isLoading}
                            >
                                {isLoading ? "Setting..." : "Set Budget"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    // If budget exists, show progress bar
    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">Budget Tracker</h2>
                </div>
                <button
                    onClick={() => setShowEditForm(true)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Edit budget"
                >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">
                        {currentMonth} {currentYear}
                    </span>
                    <span className={`text-sm font-semibold ${getTextColor()}`}>{progressPercentage.toFixed(1)}% used</span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getProgressColor()} transition-all duration-500 ease-out rounded-full`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                </div>

                {/* Amounts */}
                <div className="flex justify-between items-center text-sm">
                    <div>
                        <span className="text-muted-foreground">Spent: </span>
                        <span className={`font-semibold ${getTextColor()}`}>{currentExpenses.toLocaleString()} đ</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Budget: </span>
                        <span className="font-semibold text-foreground">{budgetAmount.toLocaleString()} đ</span>
                    </div>
                </div>

                {/* Remaining amount */}
                <div className="pt-2 border-t border-border">
                    {progressPercentage < 100 ? (
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-emerald-600">
                                {(budgetAmount - currentExpenses).toLocaleString()} đ
                            </span>{" "}
                            remaining this month
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-red-600">{(currentExpenses - budgetAmount).toLocaleString()} đ</span>{" "}
                            over budget
                        </p>
                    )}
                </div>
            </div>

            {/* Edit Budget Modal */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm border border-border rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Update Budget</h3>
                            <button
                                onClick={() => {
                                    setShowEditForm(false)
                                    setNewBudgetAmount("")
                                }}
                                className="p-1 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitBudget}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Monthly Budget for {currentMonth} {currentYear}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">đ</span>
                                    <input
                                        type="number"
                                        value={newBudgetAmount}
                                        onChange={(e) => setNewBudgetAmount(e.target.value)}
                                        placeholder={budgetAmount.toString()}
                                        className="w-full pl-8 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Current budget: {budgetAmount.toLocaleString()} đ</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditForm(false)
                                        setNewBudgetAmount("")
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Updating..." : "Update Budget"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}