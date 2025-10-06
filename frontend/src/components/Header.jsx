"use client"

import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { LogOut, Wallet } from "lucide-react"

export default function Header({ user }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            })
            toast.success("Logged out successfully")
            navigate("/login")
        } catch (err) {
            toast.error("Failed to logout")
        }
    }

    return (
        <header className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Welcome back, {user.username}</h1>
                            <p className="text-sm text-muted-foreground">Here's your financial overview</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
