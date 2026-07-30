import React, { useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Home,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Heart,
  Crown,
  MoreVertical,
  Plus,
  Copy,
  ListFilter,
  LayoutGrid,
} from "lucide-react";

// --- Mock Data ---
const categoriesData = [
  {
    id: 1,
    name: "Housing",
    spent: 1200.0,
    budget: 2500.0,
    percent: 48,
    icon: Home,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    barColor: "bg-indigo-600",
    status: "normal",
  },
  {
    id: 2,
    name: "Food & Dining",
    spent: 342.15,
    budget: 2500.0,
    percent: 13.6,
    icon: UtensilsCrossed,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    barColor: "bg-green-500",
    status: "normal",
  },
  {
    id: 3,
    name: "Transport",
    spent: 120.0,
    budget: 2500.0,
    percent: 4.8,
    icon: Car,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    barColor: "bg-gray-400",
    status: "normal",
  },
  {
    id: 4,
    name: "Shopping",
    spent: 256.9,
    budget: 200.0,
    percent: 100,
    icon: ShoppingBag,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    barColor: "bg-red-600",
    status: "over",
  },
  {
    id: 5,
    name: "Health",
    spent: 85.0,
    budget: 2500.0,
    percent: 3.4,
    icon: Heart,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    barColor: "bg-blue-500",
    status: "normal",
  },
  {
    id: 6,
    name: "Entertainment",
    spent: 45.0,
    budget: 2500.0,
    percent: 1.8,
    icon: Crown,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    barColor: "bg-purple-500",
    status: "normal",
  },
];

// --- Header Component ---
function PageHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h1 className="text-2xl font-bold text-indigo-700">Categories</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Icon Buttons */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          alt="User"
          className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
        />
      </div>
    </header>
  );
}

// --- Stat Card: Total Categories ---
function TotalCategoriesCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Total Categories
      </p>
      <p className="text-4xl font-bold text-indigo-600 mb-2">12</p>
      <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
        <span>↗</span>
        <span>+2 this month</span>
      </div>

      {/* Decorative squares */}
      <div className="absolute bottom-4 right-4 opacity-20">
        <div className="grid grid-cols-2 gap-1">
          <div className="w-6 h-6 bg-indigo-400 rounded-sm" />
          <div className="w-6 h-6 bg-indigo-300 rounded-sm rotate-12" />
          <div className="w-6 h-6 bg-indigo-200 rounded-sm -rotate-6" />
          <div className="w-6 h-6 bg-indigo-400 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

// --- Stat Card: Highest Spending ---
function HighestSpendingCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
        <Home className="w-7 h-7 text-red-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-0.5">Highest Spending</p>
        <p className="text-lg font-bold text-gray-900">Housing</p>
        <p className="text-sm text-gray-500">$1,200.00 spent</p>
      </div>
    </div>
  );
}

// --- Stat Card: Monthly Budget ---
function MonthlyBudgetCard() {
  return (
    <div className="bg-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-indigo-200">Monthly Budget</p>
        <Copy className="w-4 h-4 text-indigo-300" />
      </div>

      <p className="text-xl font-bold mb-4">$1,800 / $2,500</p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden mb-3">
        <div className="h-full w-[72%] bg-green-400 rounded-full" />
      </div>

      <p className="text-sm text-indigo-200">
        <span className="font-semibold text-white">72%</span> of budget used.{" "}
        <span className="font-semibold text-white">You're on track!</span>
      </p>
    </div>
  );
}

// --- Category Card Component ---
function CategoryCard({ category }) {
  const isOverLimit = category.status === "over";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
      {/* Top Row: Icon + Menu */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.iconBg}`}
        >
          <category.icon className={`w-5 h-5 ${category.iconColor}`} />
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Category Info */}
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        {category.name}
      </h3>
      <p className="text-xs text-gray-500 mb-3">Spent this month</p>

      {/* Amount + Percentage */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-lg font-bold text-gray-900">
          ${category.spent.toFixed(2)}
        </span>

        {isOverLimit ? (
          <span className="text-sm font-bold text-red-600 text-right leading-tight">
            Over
            <br />
            Limit
          </span>
        ) : (
          <span className="text-sm font-semibold text-indigo-600">
            {category.percent}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${category.barColor}`}
          style={{ width: `${Math.min(category.percent, 100)}%` }}
        />
      </div>

      {/* Edit Budget Button */}
      <button className="mt-auto w-full py-2 border border-indigo-200 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50 transition-colors">
        Edit Budget
      </button>
    </div>
  );
}

// --- Add Category Card ---
function AddCategoryCard() {
  return (
    <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer min-h-[220px]">
      <div className="w-12 h-12 bg-white border-2 border-indigo-200 rounded-xl flex items-center justify-center mb-3">
        <Plus className="w-6 h-6 text-indigo-600" />
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-0.5">Add Category</p>
      <p className="text-xs text-gray-500">Create a custom bucket</p>
    </div>
  );
}

// --- Main Categories Page ---
export default function Categories() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader />

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <TotalCategoriesCard />
          <HighestSpendingCard />
          <MonthlyBudgetCard />
        </div>

        {/* Active Categories Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Active Categories
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ListFilter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <LayoutGrid className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoriesData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
          <AddCategoryCard />
        </div>
      </div>
    </div>
  );
}
