import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import CategoryModal from "../components/CategoryModal";

function CategoryCard({ category, onEdit, onDelete }) {
  const percent = category.budget > 0 ? Math.min(100, Math.round((category.spent || 0) / category.budget * 100)) : 0;
  const isOver = category.spent > category.budget && category.budget > 0;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: category.color || "#4F46E5" }}>{category.name[0]?.toUpperCase()}</div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(category)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-600" /></button>
          <button onClick={() => onDelete(category._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
        </div>
      </div>
      <h3 className="text-base font-semibold mb-1">{category.name}</h3>
      <p className="text-xs text-gray-500 mb-3">Budget: ${category.budget?.toFixed(2) || "0.00"}</p>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-lg font-bold">${(category.spent || 0).toFixed(2)} spent</span>
        {isOver ? <span className="text-sm font-bold text-red-600">Over Limit</span> : <span className="text-sm font-semibold text-indigo-600">{percent}%</span>}
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: isOver ? "#DC2626" : category.color || "#4F46E5" }} />
      </div>
      <button onClick={() => onEdit(category)} className="mt-auto w-full py-2 border border-indigo-200 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50">Edit Budget</button>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/categories");
      const summary = await API.get("/analytics/summary").catch(() => ({ data: { breakdown: [] } }));
      const spentMap = {};
      (summary.data.breakdown || []).forEach((b) => { spentMap[b.category._id] = b.total; });
      const enriched = res.data.map((c) => ({ ...c, spent: spentMap[c._id] || 0 }));
      setCategories(enriched);
    } catch (e) { toast.error(e.response?.data?.message || "Failed to load categories"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? This will not delete its transactions.")) return;
    try { await API.delete(`/categories/${id}`); toast.success("Category deleted"); fetchCategories(); } catch (e) { toast.error(e.response?.data?.message || "Failed to delete"); }
  };

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border rounded-xl text-sm outline-none" />
            </div>
            <button onClick={() => { setEditing(null); setShowModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-2xl p-6"><p className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Categories</p><p className="text-4xl font-bold text-indigo-600">{categories.length}</p></div>
          <div className="bg-white border rounded-2xl p-6"><p className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Budget</p><p className="text-2xl font-bold">${categories.reduce((a, c) => a + (c.budget || 0), 0).toFixed(2)}</p></div>
          <div className="bg-indigo-700 rounded-2xl p-6 text-white"><p className="text-sm text-indigo-200 mb-2">Total Spent</p><p className="text-2xl font-bold">${categories.reduce((a, c) => a + (c.spent || 0), 0).toFixed(2)}</p></div>
        </div>

        {loading ? <p className="text-center text-gray-500">Loading...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((c) => <CategoryCard key={c._id} category={c} onEdit={(cat) => { setEditing(cat); setShowModal(true); }} onDelete={handleDelete} />)}
            <div onClick={() => { setEditing(null); setShowModal(true); }} className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-indigo-400 cursor-pointer min-h-[220px]">
              <div className="w-12 h-12 bg-white border-2 border-indigo-200 rounded-xl flex items-center justify-center mb-3"><Plus className="w-6 h-6 text-indigo-600" /></div>
              <p className="text-sm font-semibold">Add Category</p>
              <p className="text-xs text-gray-500">Create a custom bucket</p>
            </div>
          </div>
        )}
      </div>
      <CategoryModal open={showModal} onClose={() => setShowModal(false)} onSaved={fetchCategories} editing={editing} />
    </div>
  );
}
