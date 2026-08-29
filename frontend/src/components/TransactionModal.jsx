import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function TransactionModal({ open, onClose, onSaved, categories, editing }) {
  const [form, setForm] = useState({ category: "", description: "", amount: "", type: "expense", date: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        category: editing.category?._id || editing.category || "",
        description: editing.description || "",
        amount: editing.amount || "",
        type: editing.type || "expense",
        date: editing.date ? new Date(editing.date).toISOString().slice(0, 10) : "",
      });
    } else {
      setForm({ category: categories[0]?._id || "", description: "", amount: "", type: "expense", date: "" });
    }
  }, [editing, categories, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (!payload.date) delete payload.date;
      if (editing) await API.put(`/transactions/${editing._id}`, payload);
      else await API.post("/transactions", payload);
      toast.success(editing ? "Transaction updated" : "Transaction created");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save transaction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">{editing ? "Edit Transaction" : "Add Transaction"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            {categories.length === 0 ? (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">No categories yet — <a href="/category" className="underline font-medium">create one</a> first.</p>
            ) : (
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Grocery shopping" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={saving || (categories.length === 0 && !editing)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-60">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
