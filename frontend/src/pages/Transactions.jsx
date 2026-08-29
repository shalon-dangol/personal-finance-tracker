import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import TransactionModal from "../components/TransactionModal";
import { SkeletonRow } from "../components/Skeleton";

function CategoryBadge({ category }) {
  return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700" style={{ backgroundColor: category?.color ? category.color + "20" : undefined, color: category?.color || undefined }}>{category?.name || "Unknown"}</span>;
}

export default function Transactions() {
  const [data, setData] = useState({ transactions: [], total: 0, page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchTransactions = async (overrides = {}) => {
    setLoading(true);
    try {
      const params = {
        page: overrides.page ?? page,
        limit: 10,
        search: overrides.search !== undefined ? overrides.search : debouncedSearch,
        category: overrides.category !== undefined ? overrides.category : categoryFilter,
        type: overrides.type !== undefined ? overrides.type : typeFilter,
        dateFrom: overrides.dateFrom !== undefined ? overrides.dateFrom : dateFrom,
        dateTo: overrides.dateTo !== undefined ? overrides.dateTo : dateTo,
      };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await API.get("/transactions", { params });
      setData(res.data);
    } catch (e) { toast.error(e.response?.data?.message || "Failed to load transactions"); } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try { const res = await API.get("/categories"); setCategories(res.data); } catch (e) { toast.error(e.response?.data?.message || "Failed to load categories"); }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Debounce search input (also resets to page 1 when search changes)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage((p) => (p === 1 ? 1 : 1));
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch when page or debounced filters change (single source, no double-fetch)
  useEffect(() => { fetchTransactions(); }, [page, debouncedSearch, categoryFilter, typeFilter, dateFrom, dateTo]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    try { await API.delete(`/transactions/${id}`); toast.success("Transaction deleted"); fetchTransactions(); } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage your financial activity</p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add Transaction</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search by description..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
          {(categoryFilter || typeFilter || dateFrom || dateTo) && <button onClick={() => { setCategoryFilter(""); setTypeFilter(""); setDateFrom(""); setDateTo(""); setPage(1); }} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">Clear</button>}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
            <div className="col-span-3">Category</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {loading ? <><SkeletonRow /><SkeletonRow /><SkeletonRow /></> : data.transactions.length === 0 ? <p className="p-6 text-center text-gray-500">No transactions found. Try adjusting filters or add one.</p> : (
            <div className="divide-y divide-gray-100">
              {data.transactions.map((tx) => (
                <div key={tx._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50">
                  <div className="col-span-3"><CategoryBadge category={tx.category} /></div>
                  <div className="col-span-4"><p className="text-sm font-medium truncate">{tx.description || "-"}</p><p className="text-xs text-gray-500">{tx._id.slice(-6)}</p></div>
                  <div className="col-span-2 text-sm text-gray-600">{new Date(tx.date).toLocaleDateString()}</div>
                  <div className="col-span-2 text-right"><span className={`text-sm font-bold ${tx.type === "income" ? "text-green-600" : "text-gray-900"}`}>{tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}</span></div>
                  <div className="col-span-1 flex justify-end gap-2">
                    <button onClick={() => { setEditing(tx); setShowModal(true); }} className="p-1.5 hover:bg-gray-200 rounded-lg"><Pencil className="w-4 h-4 text-gray-600" /></button>
                    <button onClick={() => handleDelete(tx._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {data.transactions.length} of {data.total} transactions</p>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-2 border rounded-lg disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-3 text-sm">Page {data.page} of {data.pages || 1}</span>
              <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="p-2 border rounded-lg disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
      <TransactionModal open={showModal} onClose={() => setShowModal(false)} onSaved={fetchTransactions} categories={categories} editing={editing} />
    </div>
  );
}
