import React, { useState } from "react";
import {
  Bell,
  ShieldCheck,
  Search,
  ChevronDown,
  SlidersHorizontal,
  TrendingUp,
  LayoutGrid,
  ShoppingBag,
  Coffee,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Mock Data ---
// Keeping data separate from UI makes it easier to replace with API calls later
const transactionsData = [
  {
    id: "#4928104",
    category: "Subscriptions",
    description: "Amazon Prime Membership",
    date: "Oct 24, 2023",
    amount: -14.99,
  },
  {
    id: "#4928105",
    category: "Groceries",
    description: "Whole Foods Market",
    date: "Oct 23, 2023",
    amount: -124.5,
  },
  {
    id: "#4928106",
    category: "Dining Out",
    description: "Blue Bottle Coffee",
    date: "Oct 23, 2023",
    amount: -6.25,
  },
  {
    id: "#4928107",
    category: "Salary",
    description: "Institutional Payroll - TechCorp",
    date: "Oct 20, 2023",
    amount: 4250.0,
  },
  {
    id: "#4928108",
    category: "Transport",
    description: "Uber Technologies",
    date: "Oct 19, 2023",
    amount: -24.18,
  },
];

// --- Helper: Category Badge Colors ---
// Maps category names to specific Tailwind color classes
const categoryColors = {
  Subscriptions: "bg-purple-50 text-purple-600",
  Groceries: "bg-green-50 text-green-600",
  "Dining Out": "bg-red-50 text-red-600",
  Salary: "bg-emerald-50 text-emerald-600",
  Transport: "bg-indigo-50 text-indigo-600",
};

// --- Component: Category Badge ---
function CategoryBadge({ category }) {
  const colorClass = categoryColors[category] || "bg-gray-100 text-gray-600";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {category}
    </span>
  );
}

// --- Component: Page Header ---
function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage your financial activity
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className="text-sm font-bold text-gray-900">Synced</span>
        </div>
      </div>
    </div>
  );
}

// --- Component: Filter Bar ---
function FilterBar() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by description or amount..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Category Dropdown */}
      <div className="relative">
        <select className="appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
          <option>Filter by Category</option>
          <option>Groceries</option>
          <option>Salary</option>
          <option>Transport</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Filter Button */}
      <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

// --- Component: Transaction Table ---
function TransactionTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-3">Category</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-3 text-right">Amount</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {transactionsData.map((tx) => (
          <div
            key={tx.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
          >
            {/* Category */}
            <div className="col-span-3">
              <CategoryBadge category={tx.category} />
            </div>

            {/* Description & ID */}
            <div className="col-span-4">
              <p className="text-sm font-medium text-gray-900 truncate">
                {tx.description}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">ID: {tx.id}</p>
            </div>

            {/* Date */}
            <div className="col-span-2 text-sm text-gray-600">{tx.date}</div>

            {/* Amount */}
            <div className="col-span-3 text-right">
              <span
                className={`text-sm font-bold ${
                  tx.amount >= 0 ? "text-green-600" : "text-gray-900"
                }`}
              >
                {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Showing 1 to 5 of 42 transactions
        </p>

        <div className="flex items-center gap-1">
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="w-8 h-8 bg-indigo-600 text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
            2
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
            3
          </button>
          <span className="px-2 text-gray-400">...</span>
          <button className="w-8 h-8 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
            9
          </button>

          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Component: Summary Cards ---
function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Weekly Spend */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Weekly Spend</h3>
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">$2,410.12</p>
        <p className="text-sm text-gray-500 mb-4">+12.5% from last week</p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-indigo-600 rounded-full" />
        </div>
      </div>

      {/* Card 2: Top Category */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Top Category</h3>
          <LayoutGrid className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">Groceries</p>
        <p className="text-sm text-gray-500 mb-6">32% of total expenditures</p>

        {/* Category Icons */}
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white">
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-white">
            <Coffee className="w-4 h-4 text-green-600" />
          </div>
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border-2 border-white">
            <Zap className="w-4 h-4 text-red-600" />
          </div>
        </div>
      </div>

      {/* Card 3: Savings Goal */}
      <div className="bg-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Faint background pattern/icon */}
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
          <ShoppingBag className="w-32 h-32" />
        </div>

        <h3 className="text-sm font-semibold text-indigo-200 mb-2 relative z-10">
          Savings Goal
        </h3>
        <p className="text-2xl font-bold mb-1 relative z-10">
          New Office Setup
        </p>
        <p className="text-sm text-indigo-200 mb-6 relative z-10">
          82% completed • $410 to go
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden relative z-10">
          <div className="h-full w-[82%] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function Transactions() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <FilterBar />
        <TransactionTable />
        <SummaryCards />
      </div>
    </div>
  );
}
