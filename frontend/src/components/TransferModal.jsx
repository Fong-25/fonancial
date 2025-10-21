"use client"

import { useState, useEffect } from "react"
import { X, ArrowRightLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function TransferModal({ onTransferCompleted }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [accounts, setAccounts] = useState([])
    const [formData, setFormData] = useState({
        fromAccount: "",
        toAccount: "",
        amount: "",
        description: "",
    })

    // Fetch accounts when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchAccounts()
        }
    }, [isOpen])

    const fetchAccounts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts`, {
                credentials: "include",
            })
            if (res.ok) {
                const data = await res.json()
                setAccounts(data)
                // Set default accounts
                if (data.length >= 2) {
                    setFormData(prev => ({
                        ...prev,
                        fromAccount: data[0].id.toString(),
                        toAccount: data[1].id.toString(),
                    }))
                }
            }
        } catch (error) {
            console.error("Failed to fetch accounts:", error)
            toast.error("Failed to load accounts")
        }
    }

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

        const fromAccount = accounts.find((acc) => acc.id === Number.parseInt(formData.fromAccount))
        if (Number(fromAccount.balance) < amount) {
            toast.error("Insufficient balance")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/transfer`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fromAccountId: Number.parseInt(formData.fromAccount),
                    toAccountId: Number.parseInt(formData.toAccount),
                    amount: amount,
                    description: formData.description || "Transfer between accounts",
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Transfer completed successfully!")
                setFormData({
                    fromAccount: "",
                    toAccount: "",
                    amount: "",
                    description: "",
                })
                setIsOpen(false)

                // Callback to refresh dashboard data
                if (onTransferCompleted) {
                    onTransferCompleted()
                }
            } else {
                toast.error(data.message || "Transfer failed")
            }
        } catch (error) {
            console.error("Transfer error:", error)
            toast.error("An error occurred during transfer")
        } finally {
            setIsLoading(false)
        }
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
                        <div className="flex items-center justify-between p-3 pl-4 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">Transfer Money</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* From Account */}
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-foreground mb-1">
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
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} - {Number(account.balance).toLocaleString()} ₫
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* To Account */}
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-foreground mb-1">
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
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} - {Number(account.balance).toLocaleString()} ₫
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-foreground mb-1">
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
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
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
                                className="w-full mt-3 bg-neutral-800 transition-all hover:bg-neutral-600 active:bg-neutral-700 text-zinc-200 text-accent-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
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