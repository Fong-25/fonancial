import { Wallet, CreditCard } from "lucide-react"

export default function BalanceCard({ accounts, totalBalance }) {
    if ((accounts.length) === 0) {
        return (
            <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Total Balance</h2>

                <div className="mb-8">
                    <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                    <p className="text-4xl font-bold text-foreground">
                        {totalBalance.toLocaleString("vi-VN")} ₫
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">No accounts</h3>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Total Balance</h2>

            <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                <p className="text-4xl font-bold text-foreground">
                    {totalBalance.toLocaleString("vi-VN")} ₫
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Accounts</h3>
                {accounts.map((account) => {
                    const isNegative = account.balance < 0
                    const Icon = account.name.toLowerCase().includes("card") ? CreditCard : Wallet

                    return (
                        <div
                            key={account.id}
                            className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">{account.name}</span>
                            </div>
                            <span className={`font-semibold ${isNegative ? "text-destructive" : "text-foreground"}`}>
                                {Number(account.balance).toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
