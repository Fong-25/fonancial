"use client"

import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

// Placeholder accounts data based on database schema
// const accounts = [
//     { id: 1, name: "Main Checking" },
//     { id: 2, name: "Savings Account" },
//     { id: 3, name: "Credit Card" },
// ]

export default function AddTransaction({ user, accounts, categories, onTransactionAdded }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        accountId: accounts?.[0]?.id || "",
    })

    const currentCategories = formData.type === "expense"
        ? categories.expense
        : categories.income

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validate form
            if (!formData.category || !formData.amount || !formData.description) {
                toast.error("Please fill in all fields")
                return
            }
            console.log(formData)
            if (!formData.accountId) return toast.error('No account found')
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (res.ok) {
                toast.success(`${formData.type === "expense" ? "Expense" : "Income"} added successfully!`)
                if (onTransactionAdded) {
                    await onTransactionAdded()
                }

                setIsOpen(false)
            } else {
                toast.error(data.message || "Add transaction failed")
            }

            // Reset form
            setFormData({
                type: "expense",
                category: "",
                amount: "",
                description: "",
                accountId: accounts[0].id,
            })
        } catch (error) {
            toast.error("Add transaction error:", error)
        } finally {
            setIsLoading(false)
        }
        setIsOpen(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Reset category when type changes
            ...(name === "type" && { category: "" }),
        }))
    }

    return (
        <>
            {/* Add Transaction Button */}
            {!isOpen && (
                <button
                    onClick={(e) => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all hover:scale-105 z-50"
                >
                    <Plus className="w-6 h-6" />
                </button>
            )}

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-[100]"
                    onClick={(e) => {
                        // Close modal when clicking on overlay
                        if (e.target === e.currentTarget) {
                            setIsOpen(false)
                            // Reset form
                            setFormData({
                                type: "expense",
                                category: "",
                                amount: "",
                                description: "",
                                accountId: accounts[0].id,
                            })
                        }
                    }}
                >
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm border border-border rounded-lg lg:w-[40vw] w-md max-h-75vh overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">Add Transaction</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* Transaction Type */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: "type", value: "expense" } })}
                                        className={`py-2.5 px-4 rounded-lg border transition-colors ${formData.type === "expense"
                                            ? "bg-red-500/10 border-red-500 text-red-500 font-semibold"
                                            : "bg-background border-border text-muted-foreground hover:border-foreground"
                                            }`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: "type", value: "income" } })}
                                        className={`py-2.5 px-4 rounded-lg border transition-colors ${formData.type === "income"
                                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-semibold"
                                            : "bg-background border-border text-muted-foreground hover:border-foreground"
                                            }`}
                                    >
                                        Income
                                    </button>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select a category</option>
                                    {currentCategories.map((cat) => (
                                        <option key={cat.key} value={cat.key}>
                                            {cat.icon} {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Account */}
                            <div>
                                <label htmlFor="accountId" className="block text-sm font-medium text-foreground mb-2">
                                    Account
                                </label>
                                <select
                                    id="accountId"
                                    name="accountId"
                                    value={formData.accountId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="100000"
                                        className="w-full pl-8 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    placeholder="Enter transaction details..."
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-neutral-800 transition-all hover:bg-neutral-600 active:bg-neutral-700 text-zinc-200 font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {/* Add Transaction */}
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding Transaction...
                                    </>
                                ) : (
                                    "Add Transaction"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
