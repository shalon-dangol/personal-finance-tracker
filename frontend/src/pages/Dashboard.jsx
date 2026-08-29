import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import API from "../services/api";
import TransactionModal from "../components/TransactionModal";
import { SkeletonCard } from "../components/Skeleton";
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
function Header({ onAdd }) {
  const { user } = useAppContext();
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || "User"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your financial overview</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search transactions..." className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm whitespace-nowrap">
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
function DonutChart({ data, total }) {
  const fallback = [{ label: "No data", percent: 100, amount: 0, color: "#E5E7EB" }];
  const chartData = data && data.length ? data : fallback;

  // SVG circle calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* SVG Donut */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {chartData.map((item, index) => {
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

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">${(total || 0).toFixed(2)}</span>
          <span className="text-xs text-gray-500">Spent Total</span>
        </div>
      </div>
      <div className="flex-1 space-y-4 w-full">
        {chartData.map((item) => (
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
function CategoryBreakdown({ breakdown, totalExpense }) {
  const data = breakdown?.map((b) => ({ label: b.category.name, percent: b.percent, amount: b.total, color: b.category.color || "#4F46E5" })) || [];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Category Breakdown</h2>
          <p className="text-sm text-gray-500 mt-0.5">Spending distribution across all segments</p>
        </div>
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">This Month</span>
      </div>
      <DonutChart data={data} total={totalExpense} />
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
function RecentActivity({ transactions }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <Link to="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
      </div>
      {transactions?.length ? (
        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <TransactionItem key={tx._id} icon={tx.type === "income" ? Briefcase : ShoppingBag} iconBg={tx.type === "income" ? "bg-green-100" : "bg-gray-100"} title={tx.description || tx.category?.name || "Transaction"} date={new Date(tx.date).toLocaleDateString()} category={tx.category?.name || ""} amount={`${tx.type === "income" ? "+" : "-"}$${tx.amount.toFixed(2)}`} isIncome={tx.type === "income"} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-4">No transactions yet. Add one to get started.</p>
      )}
      <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-0.5">Spending Tip</p>
          <p className="text-sm text-gray-600">Track every transaction to stay on budget.</p>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard Component ---
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const [summary, cats] = await Promise.all([API.get("/analytics/summary"), API.get("/categories")]);
      setData(summary.data);
      setCategories(cats.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load dashboard");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="p-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load dashboard. Check API connection.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto">
        <Header onAdd={() => setShowModal(true)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Balance" value={`$${data.balance.toFixed(2)}`} subtext={`${data.transactionCount} transactions`} trend="up" trendColor="text-green-500" />
          <StatCard label="Total Income" value={`$${data.totalIncome.toFixed(2)}`} subtext={`${data.incomeCount} income`} trend="up" trendColor="text-green-500" />
          <StatCard label="Total Expenses" value={`$${data.totalExpense.toFixed(2)}`} subtext={`${data.expenseCount} expenses`} trend="down" trendColor="text-red-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBreakdown breakdown={data.breakdown} totalExpense={data.totalExpense} />
          <RecentActivity transactions={data.recentTransactions} />
        </div>
      </div>
      <TransactionModal open={showModal} onClose={() => setShowModal(false)} onSaved={fetchData} categories={categories} />
    </div>
  );
}
