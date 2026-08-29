import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function CategoryModal({ open, onClose, onSaved, editing }) {
  const [form, setForm] = useState({ name: "", budget: "", color: "#4F46E5", icon: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) setForm({ name: editing.name || "", budget: editing.budget || "", color: editing.color || "#4F46E5", icon: editing.icon || "" });
    else setForm({ name: "", budget: "", color: "#4F46E5", icon: "" });
  }, [editing, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { name: form.name, budget: Number(form.budget) || 0, color: form.color, icon: form.icon };
      if (editing) await API.put(`/categories/${editing._id}`, payload);
      else await API.post("/categories", payload);
      toast.success(editing ? "Category updated" : "Category created");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">{editing ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Groceries" className="w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget</label>
            <input type="number" step="0.01" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full h-10 rounded-lg border p-1" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-60">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
