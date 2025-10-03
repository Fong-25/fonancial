"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import toast from "react-hot-toast"

// Placeholder accounts data based on database schema
const accounts = [
    { id: 1, name: "Main Checking" },
    { id: 2, name: "Savings Account" },
    { id: 3, name: "Credit Card" },
]

const EXPENSE_CATEGORIES = ["Food", "Rent", "Shopping", "Transport", "Other"]
const INCOME_CATEGORIES = ["Salary", "Scholarship", "Parents", "Other"]

export default function AddTransaction() {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        account_id: accounts[0].id,
    })

    const categories = formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate form
        if (!formData.category || !formData.amount || !formData.description) {
            toast.error("Please fill in all fields")
            return
        }

        // Create transaction object matching database schema
        const transaction = {
            id: Date.now(), // Mock ID
            user_id: 1, // Mock user ID
            account_id: formData.account_id,
            type: formData.type,
            category: formData.category,
            amount: Number.parseFloat(formData.amount),
            description: formData.description,
            created_at: new Date().toISOString(),
        }

        // Console log instead of making request
        console.log("[v0] New Transaction:", transaction)

        toast.success(`${formData.type === "expense" ? "Expense" : "Income"} added successfully!`)

        // Reset form
        setFormData({
            type: "expense",
            category: "",
            amount: "",
            description: "",
            account_id: accounts[0].id,
        })
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
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Account */}
                            <div>
                                <label htmlFor="account_id" className="block text-sm font-medium text-foreground mb-2">
                                    Account
                                </label>
                                <select
                                    id="account_id"
                                    name="account_id"
                                    value={formData.account_id}
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
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="0.00"
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
                                className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium py-3 rounded-lg transition-colors"
                            >
                                Add Transaction
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
