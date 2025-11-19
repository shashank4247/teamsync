import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiPlus, FiTrash2, FiZap, FiSave, FiX } from 'react-icons/fi';

export default function WorkflowRules() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        trigger: 'create',
        condition: { field: 'priority', operator: 'equals', value: 'high' },
        action: { type: 'assign', value: '' }
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await api.get('/api/workflows');
            setRules(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/workflows', formData);
            setShowForm(false);
            fetchRules();
            setFormData({
                name: '',
                trigger: 'create',
                condition: { field: 'priority', operator: 'equals', value: 'high' },
                action: { type: 'assign', value: '' }
            });
        } catch (err) {
            alert("Failed to create rule");
        }
    };

    const deleteRule = async (id) => {
        if (!confirm("Delete this rule?")) return;
        try {
            await api.delete(`/api/workflows/${id}`);
            fetchRules();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <FiZap className="text-blue-600" /> Automation Rules
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">Streamline your workflow with powerful automated actions.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all hover:scale-105
                        ${showForm
                            ? 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                        }
                    `}
                >
                    {showForm ? <><FiX /> Cancel</> : <><FiPlus /> New Rule</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 mb-10 animate-scaleIn relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Automation</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rule Name</label>
                            <input
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="e.g., Auto-assign High Priority"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trigger</label>
                                <select
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                                    value={formData.trigger}
                                    onChange={e => setFormData({ ...formData, trigger: e.target.value })}
                                >
                                    <option value="create">When Issue Created</option>
                                    <option value="update">When Issue Updated</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Condition</label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-1/2 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                                        value={formData.condition.field}
                                        onChange={e => setFormData({ ...formData, condition: { ...formData.condition, field: e.target.value } })}
                                    >
                                        <option value="priority">Priority</option>
                                        <option value="status">Status</option>
                                    </select>
                                    <select
                                        className="w-1/2 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                                        value={formData.condition.value}
                                        onChange={e => setFormData({ ...formData, condition: { ...formData.condition, value: e.target.value } })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Action</label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-1/2 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                                        value={formData.action.type}
                                        onChange={e => setFormData({ ...formData, action: { ...formData.action, type: e.target.value } })}
                                    >
                                        <option value="set_priority">Set Priority</option>
                                        <option value="move">Move to Status</option>
                                    </select>
                                    <input
                                        className="w-1/2 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-900"
                                        value={formData.action.value}
                                        onChange={e => setFormData({ ...formData, action: { ...formData.action, value: e.target.value } })}
                                        placeholder="Value"
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]">
                            <FiSave /> Save Rule
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Loading rules...</div>
            ) : (
                <div className="space-y-4">
                    {rules.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <FiZap className="mx-auto text-4xl text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No automation rules defined yet.</p>
                        </div>
                    )}
                    {rules.map(rule => (
                        <div key={rule._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center hover:shadow-md transition-all hover:border-blue-200 group">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FiZap className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{rule.name}</h3>
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                        When <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{rule.trigger}</span>,
                                        if <span className="font-semibold">{rule.condition.field}</span> is <span className="font-semibold">{rule.condition.value}</span>,
                                        then <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{rule.action.type.replace('_', ' ')}</span> to <span className="font-semibold">{rule.action.value}</span>.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteRule(rule._id)}
                                className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
                                title="Delete Rule"
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
