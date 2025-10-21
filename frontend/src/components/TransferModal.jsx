"use client"

import { useState } from "react"
import { X, ArrowRightLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const ACCOUNTS = [
    { id: 1, name: "Main Checking", balance: 500000 },
    { id: 2, name: "Cash", balance: 200000 },
]

export default function TransferModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fromAccount: "",
        toAccount: "",
        amount: "",
        description: "",
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
            toast.error("Please fill in all required fields")
            return
        }

        if (formData.fromAccount === formData.toAccount) {
            toast.error("Cannot transfer to the same account")
            return
        }

        const amount = Number.parseFloat(formData.amount)
        if (amount <= 0) {
            toast.error("Amount must be greater than 0")
            return
        }

        const fromAccount = ACCOUNTS.find((acc) => acc.id === Number.parseInt(formData.fromAccount))
        if (fromAccount.balance < amount) {
            toast.error("Insufficient balance")
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            const transferData = {
                fromAccountId: Number.parseInt(formData.fromAccount),
                toAccountId: Number.parseInt(formData.toAccount),
                amount: amount,
                description: formData.description || "Transfer between accounts",
                timestamp: new Date().toISOString(),
            }

            console.log("[v0] Transfer Data:", transferData)
            toast.success("Transfer completed successfully!")

            setFormData({
                fromAccount: "",
                toAccount: "",
                amount: "",
                description: "",
            })
            setIsOpen(false)
            setIsLoading(false)
        }, 1000)
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-42 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all hover:scale-105 z-50"
                title="Transfer Money"
            >
                <ArrowRightLeft size={24} />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">Transfer Money</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* From Account */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    From Account
                                </label>
                                <select
                                    name="fromAccount"
                                    value={formData.fromAccount}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                                >
                                    <option value="">Select account</option>
                                    {ACCOUNTS.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} - ${account.balance.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* To Account */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    To Account
                                </label>
                                <select
                                    name="toAccount"
                                    value={formData.toAccount}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                                >
                                    <option value="">Select account</option>
                                    {ACCOUNTS.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} - ${account.balance.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    placeholder="Add a note for this transfer..."
                                    rows="3"
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-6 bg-neutral-800 transition-all hover:bg-neutral-600 active:bg-neutral-700 text-zinc-200 text-accent-foreground py-2.5 rounded-lg font-semibold hover:opacity-90  disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRightLeft size={20} />
                                        Transfer Money
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
