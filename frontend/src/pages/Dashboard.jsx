import React from "react";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Coffee,
  Home,
  Briefcase,
  ShoppingBag,
  Car,
  Lightbulb,
  ChevronDown,
} from "lucide-react";

// --- Header Component ---
function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Welcome Text */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Your financial overview for October 2023
        </p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
          />
        </div>

        {/* Add Transaction Button */}
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-indigo-200 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Add Transaction</span>
        </button>
      </div>
    </header>
  );
}

// --- Stat Card Component ---
function StatCard({ label, value, subtext, trend, trendColor, badge }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span
            className={`flex items-center text-sm font-medium ${trendColor}`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </span>
        )}
      </div>

      {/* Subtext / Badge */}
      {badge ? (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            {badge}
          </span>
          <span className="text-xs text-gray-500">{subtext}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">{subtext}</span>
        </div>
      )}

      {/* Progress bar for income card */}
      {label === "Total Income" && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-green-500 rounded-full" />
            </div>
            <span className="text-xs text-gray-500 ml-3">75% Target</span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Donut Chart Component ---
function DonutChart() {
  // Chart data
  const data = [
    { label: "Rent", percent: 40, amount: 740, color: "#4F46E5" },
    { label: "Food", percent: 30, amount: 555, color: "#6EE7B7" },
    { label: "Transport", percent: 15, amount: 277.5, color: "#DC2626" },
    { label: "Others", percent: 15, amount: 277.5, color: "#9CA3AF" },
  ];

  // SVG circle calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* SVG Donut */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const strokeDash = (item.percent / 100) * circumference;
            const offset = currentOffset;
            currentOffset += strokeDash;

            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="28"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeDashoffset={-offset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">$1,850</span>
          <span className="text-xs text-gray-500">Spent Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-4 w-full">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                {item.percent}%
              </span>
              <p className="text-xs text-gray-500">${item.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Category Breakdown Card ---
function CategoryBreakdown() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Category Breakdown
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Spending distribution across all segments
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
          This Month
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <DonutChart />
    </div>
  );
}

// --- Transaction Item Component ---
function TransactionItem({
  icon: Icon,
  iconBg,
  title,
  date,
  category,
  amount,
  isIncome,
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500">
          {date} • {category}
        </p>
      </div>

      <span
        className={`text-sm font-semibold whitespace-nowrap ${
          isIncome ? "text-green-600" : "text-red-600"
        }`}
      >
        {isIncome ? "+" : ""}
        {amount}
      </span>
    </div>
  );
}

// --- Recent Activity Card ---
function RecentActivity() {
  const transactions = [
    {
      icon: Coffee,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Starbucks",
      date: "Oct 24, 2023",
      category: "Food",
      amount: "-$6.50",
      isIncome: false,
    },
    {
      icon: Home,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Monthly Rent",
      date: "Oct 23, 2023",
      category: "Rent",
      amount: "-$1,200.00",
      isIncome: false,
    },
    {
      icon: Briefcase,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "Freelance Pay",
      date: "Oct 21, 2023",
      category: "Income",
      amount: "+$2,450.00",
      isIncome: true,
    },
    {
      icon: ShoppingBag,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Amazon Prime",
      date: "Oct 20, 2023",
      category: "Others",
      amount: "-$14.99",
      isIncome: false,
    },
    {
      icon: Car,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "Uber Ride",
      date: "Oct 19, 2023",
      category: "Transport",
      amount: "-$24.50",
      isIncome: false,
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          View All
        </button>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-100">
        {transactions.map((tx, index) => (
          <TransactionItem key={index} {...tx} />
        ))}
      </div>

      {/* Spending Tip */}
      <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-0.5">
            Spending Tip
          </p>
          <p className="text-sm text-gray-600">
            You spent 12% less on coffee this week than average.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard Component ---
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Balance"
            value="$12,450.00"
            subtext="+2.4% from last month"
            trend="up"
            trendColor="text-green-500"
          />
          <StatCard
            label="Total Income"
            value="$5,200.00"
            trend="up"
            trendColor="text-green-500"
          />
          <StatCard
            label="Total Expenses"
            value="$1,850.00"
            trend="down"
            trendColor="text-red-500"
            badge="High Spend: Food"
            subtext="12 Transactions"
          />
        </div>

        {/* Bottom Grid: Category + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBreakdown />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
