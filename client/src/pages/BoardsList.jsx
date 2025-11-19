import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FiPlus, FiLayout, FiClock, FiArrowRight } from "react-icons/fi";

export default function BoardsList() {
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/boards");
        setBoards(res.data);
      } catch (err) {
        console.error("Error loading boards:", err);
      }
      setLoading(false);
    })();
  }, []);

  const createBoard = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);

    try {
      const res = await api.post("/api/boards", {
        name,
        description: desc,
      });

      setBoards((prev) => [res.data, ...prev]);
      setName("");
      setDesc("");
    } catch (err) {
      console.error("Board creation error:", err);
    }
    setCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Your Workspace</h1>
          <p className="text-slate-600 mt-2 font-medium">Manage all your projects and tasks in one place.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar / Create Board */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-7 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 text-lg">
              <FiPlus className="text-blue-600" /> New Board
            </h3>
            <form onSubmit={createBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marketing Launch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Board"}
              </button>
            </form>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-7 rounded-2xl border border-blue-200 shadow-sm">
            <h4 className="font-bold text-blue-900 mb-3 text-lg">Pro Tip</h4>
            <p className="text-sm text-blue-800 leading-relaxed mb-4">
              Use <strong>Automation Rules</strong> to automatically move tasks or assign them based on priority.
            </p>
            <Link to="/workflows" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              Configure Automation <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* Boards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-24 text-slate-400 font-medium">Loading your boards...</div>
          ) : boards.length === 0 ? (
            <div className="text-center py-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border-2 border-dashed border-slate-300">
              <FiLayout className="mx-auto text-5xl text-slate-300 mb-5" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">No boards yet</h3>
              <p className="text-slate-500">Create your first board to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boards.map((b) => (
                <Link
                  key={b._id}
                  to={`/boards/${b._id}`}
                  className="group bg-white p-7 rounded-2xl shadow-md border border-slate-200 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-56"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl text-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <FiLayout className="text-2xl" />
                      </div>
                      <FiArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {b.name}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                      {b.description || "No description provided"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold pt-5 border-t border-slate-100">
                    <FiClock />
                    Created {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
