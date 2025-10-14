"use client"

import { X, PieChartIcon, BarChart3 } from "lucide-react"
import { Pie, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { useState, useEffect } from "react"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

// Category labels mapping, lazy to take from backend
const CATEGORY_LABELS = {
    food: "Food & Drinks",
    transport: "Transport",
    rent: "Rent",
    shopping: "Shopping",
    entertainment: "Entertainment",
    health: "Health",
    education: "Education",
    other: "Other",
    salary: "Salary",
    scholarship: "Scholarship",
    gift: "Gift",
    parents: "Parents",
    other_income: "Other Income"
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function ChartsModal({ isOpen, onClose }) {
    const [chartData, setChartData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen) {
            fetchChartData()
        }
    }, [isOpen])

    const fetchChartData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history/chart`, {
                credentials: "include",
            })

            if (!res.ok) {
                throw new Error('Failed to fetch chart data')
            }

            const data = await res.json()
            setChartData(data)
        } catch (err) {
            console.error("Chart data fetch error:", err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    // Pie chart configuration
    const getPieChartData = () => {
        if (!chartData?.expenseCategories || Object.keys(chartData.expenseCategories).length === 0) {
            return null
        }

        const labels = Object.keys(chartData.expenseCategories).map(
            key => CATEGORY_LABELS[key] || key
        )
        const data = Object.values(chartData.expenseCategories)

        return {
            labels,
            datasets: [
                {
                    label: "Expense Amount",
                    data,
                    backgroundColor: [
                        "rgba(239, 68, 68, 0.8)", // red
                        "rgba(249, 115, 22, 0.8)", // orange
                        "rgba(234, 179, 8, 0.8)", // yellow
                        "rgba(59, 130, 246, 0.8)", // blue
                        "rgba(168, 85, 247, 0.8)", // purple
                        "rgba(236, 72, 153, 0.8)", // pink
                        "rgba(20, 184, 166, 0.8)", // teal
                        "rgba(139, 92, 246, 0.8)", // violet
                    ],
                    borderColor: [
                        "rgba(239, 68, 68, 1)",
                        "rgba(249, 115, 22, 1)",
                        "rgba(234, 179, 8, 1)",
                        "rgba(59, 130, 246, 1)",
                        "rgba(168, 85, 247, 1)",
                        "rgba(236, 72, 153, 1)",
                        "rgba(20, 184, 166, 1)",
                        "rgba(139, 92, 246, 1)",
                    ],
                    borderWidth: 2,
                },
            ],
        }
    }

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 15,
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12,
                    },
                    color: "rgb(156, 163, 175)",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || ""
                        const currentValue = context.parsed;
                        const formattedValue = new Intl.NumberFormat("vi-VN").format(currentValue);

                        // Calculate the total of all dataset values
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);

                        // Calculate the percentage
                        const percentage = ((currentValue / total) * 100).toFixed(1);
                        return `${label}: ${formattedValue} đ (${percentage}%)`;
                    },
                },
            },
        },
    }

    // Bar chart configuration
    const getBarChartData = () => {
        if (!chartData?.monthlyData || chartData.monthlyData.length === 0) {
            return null
        }

        const labels = chartData.monthlyData.map(d =>
            `${MONTH_NAMES[d.month - 1]} ${d.year}`
        )
        const incomeData = chartData.monthlyData.map(d => d.income)
        const expenseData = chartData.monthlyData.map(d => d.expense)

        return {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    backgroundColor: "rgba(16, 185, 129, 0.8)",
                    borderColor: "rgba(16, 185, 129, 1)",
                    borderWidth: 2,
                },
                {
                    label: "Expense",
                    data: expenseData,
                    backgroundColor: "rgba(239, 68, 68, 0.8)",
                    borderColor: "rgba(239, 68, 68, 1)",
                    borderWidth: 2,
                },
            ],
        }
    }

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    padding: 15,
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12,
                    },
                    color: "rgb(156, 163, 175)",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || ""
                        const value = new Intl.NumberFormat("vi-VN").format(context.parsed.y)
                        return `${label}: ${value} đ`
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(value),
                    color: "rgb(156, 163, 175)",
                    font: {
                        size: window.innerWidth < 640 ? 9 : 11,
                    },
                },
                grid: {
                    color: "rgba(156, 163, 175, 0.1)",
                },
            },
            x: {
                ticks: {
                    color: "rgb(156, 163, 175)",
                    font: {
                        size: window.innerWidth < 640 ? 9 : 11,
                    },
                },
                grid: {
                    color: "rgba(156, 163, 175, 0.1)",
                },
            },
        },
    }

    const pieData = getPieChartData()
    const barData = getBarChartData()
    const previousMonthLabel = chartData?.previousMonth
        ? `${MONTH_NAMES[chartData.previousMonth.month - 1]} ${chartData.previousMonth.year}`
        : "Previous Month"

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold">Financial Charts</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            <p>Failed to load chart data</p>
                            <button
                                onClick={fetchChartData}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Pie Chart Section */}
                            <div className="bg-background rounded-lg p-4 sm:p-6 border border-border">
                                <div className="flex items-center gap-2 mb-4">
                                    <PieChartIcon className="w-5 h-5 text-primary" />
                                    <h3 className="text-base sm:text-lg font-semibold">Expense Categories</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-4">{previousMonthLabel}</p>
                                {pieData ? (
                                    <div className="h-[250px] sm:h-[300px]">
                                        <Pie data={pieData} options={pieChartOptions} />
                                    </div>
                                ) : (
                                    <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                                        No expense data available for {previousMonthLabel}
                                    </div>
                                )}
                            </div>

                            {/* Bar Chart Section */}
                            <div className="bg-background rounded-lg p-4 sm:p-6 border border-border">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    <h3 className="text-base sm:text-lg font-semibold">Income vs Expense (Last 6 Months)</h3>
                                </div>
                                {barData ? (
                                    <div className="h-[250px] sm:h-[350px]">
                                        <Bar data={barData} options={barChartOptions} />
                                    </div>
                                ) : (
                                    <div className="h-[250px] sm:h-[350px] flex items-center justify-center text-muted-foreground">
                                        No monthly data available
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}