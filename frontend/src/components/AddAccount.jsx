import { useState } from "react";
import { BanknoteArrowUp, X } from "lucide-react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function AddAccount({ user, onAccountAdded }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        console.log(formData)
        try {
            // Validate form
            if (!formData.name) {
                toast.error('Name is required')
                return
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (res.ok) {
                toast.success('Account added successfully')
                if (onAccountAdded) {
                    onAccountAdded()
                }
                setIsOpen(false)
            } else {
                toast.error(data.message || "Add account failed")
            }
            setFormData({ name: "" })
        } catch (error) {
            toast.error("Add transaction error:", error)
        } finally {
            setIsLoading(false)
        }
        setIsOpen(false)
    }
    return (
        <>
            {/* Add Transaction Button */}
            {!isOpen && (
                <button
                    onClick={(e) => setIsOpen(true)}
                    className="fixed bottom-25 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all hover:scale-105 z-50"
                >
                    <BanknoteArrowUp className="w-6 h-6" />
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
                                name: "",
                            })
                        }
                    }}
                >
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm border border-border rounded-lg lg:w-[40vw] w-md max-h-75vh overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">Add Account</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* Amount */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                                    Account
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                                    <input
                                        type="text"
                                        id="account"
                                        name="name"
                                        value={formData.account}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        required
                                        placeholder="Cash / MBCard"
                                        className="w-full pl-8 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
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
                                        Adding Account...
                                    </>
                                ) : (
                                    "Add Account"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}