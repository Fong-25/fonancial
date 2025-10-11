"use client"

export default function TransactionFilter({ filters, setFilters }) {
    const accounts = ["all", "Card BIDV", "Cash"]
    const types = ["all", "expense", "income"]
    const categories = ["all", "Food", "Rent", "Shopping", "Transport", "Salary", "Scholarship", "Parents", "Other"]

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }))
    }

    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Filter Transactions</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Account Filter */}
                <div>
                    <label className="block text-sm font-medium mb-2">Account</label>
                    <select
                        value={filters.account}
                        onChange={(e) => handleFilterChange("account", e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {accounts.map((account) => (
                            <option key={account} value={account}>
                                {account === "all" ? "All Accounts" : account}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type Filter */}
                <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange("type", e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === "all" ? "All Categories" : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* From Date */}
                <div>
                    <label className="block text-sm font-medium mb-2">From Date</label>
                    <input
                        type="date"
                        value={filters.fromDate || ""}
                        onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* To Date */}
                <div>
                    <label className="block text-sm font-medium mb-2">To Date</label>
                    <input
                        type="date"
                        value={filters.toDate || ""}
                        onChange={(e) => handleFilterChange("toDate", e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            {/* Active Filters Display */}
            {(filters.account !== "all" ||
                filters.type !== "all" ||
                filters.category !== "all" ||
                filters.fromDate ||
                filters.toDate) && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                {filters.account !== "all" && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{filters.account}</span>
                                )}
                                {filters.type !== "all" && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{filters.type}</span>
                                )}
                                {filters.category !== "all" && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{filters.category}</span>
                                )}
                                {filters.fromDate && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                        From: {new Date(filters.fromDate).toLocaleDateString("vi-VN")}
                                    </span>
                                )}
                                {filters.toDate && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                        To: {new Date(filters.toDate).toLocaleDateString("vi-VN")}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setFilters({ account: "all", type: "all", category: "all", fromDate: "", toDate: "" })}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Clear all
                            </button>
                        </div>
                    </div>
                )}
        </div>
    )
}
