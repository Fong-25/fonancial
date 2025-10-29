import { useState, useEffect } from "react"

export default function TransactionFilter({ filters, setFilters }) {
    const types = ["all", "expense", "income", "transfer"]
    const [isLoading, setIsLoading] = useState(true)
    const [accounts, setAccounts] = useState([])
    const [categoriesData, setCategoriesData] = useState(null)

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => {
            const newFilters = {
                ...prev,
                [filterType]: value,
            }

            // Reset category when type changes
            if (filterType === "type") {
                newFilters.category = "all"
            }

            return newFilters
        })
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history/categories`, {
                credentials: "include",
            })
            if (res.ok) {
                const data = await res.json()
                setCategoriesData(data.categories)
            }
        } catch (err) {
            console.error("Categories fetch error:", err)
        }
    }

    const fetchAccounts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history/accounts`, {
                credentials: "include",
            })
            if (res.ok) {
                const accountsData = await res.json()
                // Add "all" option and extract account names
                const accountNames = ["all", ...accountsData.map(acc => acc.name)]
                setAccounts(accountNames)
            }
        } catch (err) {
            console.error("Accounts fetch error:", err)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            await Promise.all([fetchCategories(), fetchAccounts()])
            setIsLoading(false)
        }
        fetchData()
    }, [])

    // Get current categories based on selected type
    const getCurrentCategories = () => {
        if (!categoriesData) return ["all"]

        let categoryList = []
        if (filters.type === "expense") {
            categoryList = categoriesData.expense
        } else if (filters.type === "income") {
            categoryList = categoriesData.income
        } else {
            // When type is "all", combine both expense and income categories
            categoryList = categoriesData.all
        }
        return ["all", ...categoryList]
    }

    const currentCategories = getCurrentCategories()

    if (isLoading) {
        return (
            <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        )
    }

    if (!accounts.length || !categoriesData) {
        return <p className="text-center text-red-500">Failed to load filters</p>
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
                        {currentCategories.map((category) =>
                            typeof category === "string" ? (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ) : (
                                <option key={category.key} value={category.key}>
                                    {category.label}
                                </option>
                            )
                        )}
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
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                        {currentCategories.find(cat => typeof cat === 'object' && cat.key === filters.category)?.label || filters.category}
                                    </span>
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