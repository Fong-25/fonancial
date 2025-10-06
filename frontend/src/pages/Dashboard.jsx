import Header from "../components/Header.jsx"
import BalanceCard from "../components/BalanceCard.jsx"
import MonthlySummary from "../components/MonthlySummary.jsx"
import RecentTransactions from "../components/RecentTransactions.jsx"
import { useEffect, useState } from "react"
import { useUser } from '../components/ProtectedRoute.jsx'
import AddTransaction from "../components/AddTransaction.jsx"
import AddAccount from "../components/AddAccount.jsx"

export default function Dashboard() {
    const user = useUser()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchDashboard = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
                credentials: "include",
            })
            if (res.ok) {
                const result = await res.json()
                setData(result)
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchDashboard()
    }, [])


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!data) {
        return <p className="text-center text-red-500">Failed to load dashboard</p>
    }
    return (
        <div className="min-h-screen bg-background">
            <Header user={data.user} />
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                <BalanceCard accounts={data.accounts} totalBalance={data.totalBalance} />
                <MonthlySummary summary={data.summary} />
                <RecentTransactions categories={data.categories} transactions={data.recentTransactions} />
            </div>
            <AddTransaction accounts={data.accounts} user={data.user} categories={data.categories} onTransactionAdded={fetchDashboard} />
            <AddAccount user={data.user} onAccountAdded={fetchDashboard} />
        </div>
    )

}
