"use client"

import { X, PieChartIcon, BarChart3 } from "lucide-react"
import { Pie, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function ChartsModal({ isOpen, onClose }) {
    if (!isOpen) return null

    // Placeholder data for previous month expense categories (September 2025)
    const expenseCategoryData = {
        Food: 85000,
        Rent: 300000,
        Shopping: 150000,
        Transport: 40000,
        Other: 75000,
    }

    // Placeholder data for last 6 months income vs expense
    const monthlyData = [
        { month: "May", income: 800000, expense: 550000 },
        { month: "Jun", income: 900000, expense: 620000 },
        { month: "Jul", income: 850000, expense: 580000 },
        { month: "Aug", income: 950000, expense: 700000 },
        { month: "Sep", income: 800000, expense: 650000 },
        { month: "Oct", income: 800000, expense: 650000 },
    ]

    // Pie chart configuration
    const pieChartData = {
        labels: Object.keys(expenseCategoryData),
        datasets: [
            {
                label: "Expense Amount",
                data: Object.values(expenseCategoryData),
                backgroundColor: [
                    "rgba(239, 68, 68, 0.8)", // red
                    "rgba(249, 115, 22, 0.8)", // orange
                    "rgba(234, 179, 8, 0.8)", // yellow
                    "rgba(59, 130, 246, 0.8)", // blue
                    "rgba(168, 85, 247, 0.8)", // purple
                ],
                borderColor: [
                    "rgba(239, 68, 68, 1)",
                    "rgba(249, 115, 22, 1)",
                    "rgba(234, 179, 8, 1)",
                    "rgba(59, 130, 246, 1)",
                    "rgba(168, 85, 247, 1)",
                ],
                borderWidth: 2,
            },
        ],
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
                        const value = new Intl.NumberFormat("vi-VN").format(context.parsed)
                        return `${label}: ${value} đ`
                    },
                },
            },
        },
    }

    // Bar chart configuration
    const barChartData = {
        labels: monthlyData.map((d) => d.month),
        datasets: [
            {
                label: "Income",
                data: monthlyData.map((d) => d.income),
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 2,
            },
            {
                label: "Expense",
                data: monthlyData.map((d) => d.expense),
                backgroundColor: "rgba(239, 68, 68, 0.8)",
                borderColor: "rgba(239, 68, 68, 1)",
                borderWidth: 2,
            },
        ],
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
                    {/* Pie Chart Section */}
                    <div className="bg-background rounded-lg p-4 sm:p-6 border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChartIcon className="w-5 h-5 text-primary" />
                            <h3 className="text-base sm:text-lg font-semibold">Previous Month Expense Categories</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4">September 2025</p>
                        <div className="h-[250px] sm:h-[300px]">
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    </div>

                    {/* Bar Chart Section */}
                    <div className="bg-background rounded-lg p-4 sm:p-6 border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            <h3 className="text-base sm:text-lg font-semibold">Income vs Expense (Last 6 Months)</h3>
                        </div>
                        <div className="h-[250px] sm:h-[350px]">
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
