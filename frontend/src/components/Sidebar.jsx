import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Tags,
  Plus,
  LogOut,
} from "lucide-react";

// --- User Profile Component ---
function UserProfile({ name, role, avatarUrl }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <img
        src={avatarUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{name}</span>
        <span className="text-xs text-gray-500">{role}</span>
      </div>
    </div>
  );
}

// --- Sidebar Component ---
export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-indigo-50 text-indigo-700 relative"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const iconClass = (path) =>
    `w-5 h-5 ${location.pathname === path ? "text-indigo-600" : "text-gray-500"}`;

  return (
    <aside className="w-72 bg-white border-r border-gray-100 h-screen sticky top-0 overflow-y-hidden flex flex-col py-6 px-4">
      <div className="px-4 mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">WalletWise</span>
        </div>
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase ml-[42px]">
          Institutional Precision
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <LayoutDashboard className={iconClass("/dashboard")} />
          <span>Dashboard</span>
          {location.pathname === "/dashboard" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full" />
          )}
        </Link>

        <Link to="/transactions" className={linkClass("/transactions")}>
          <Receipt className={iconClass("/transactions")} />
          <span>Transactions</span>
          {location.pathname === "/transactions" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full" />
          )}
        </Link>

        <Link to="/category" className={linkClass("/category")}>
          <Tags className={iconClass("/category")} />
          <span>Categories</span>
          {location.pathname === "/category" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full" />
          )}
        </Link>
      </nav>

      {/* Footer Section */}
      <div className="px-2 space-y-4">
        {/* User Profile */}
        <UserProfile
          name="Alex Sterling"
          role="Premium Account"
          avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        />

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
