import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CommentsPanel from './CommentsPanel';
import ActivityTimeline from './ActivityTimeline';
import { useAuth } from '../context/AuthContext';
import { FiX, FiTrash2, FiSave, FiCpu, FiActivity, FiCheck, FiClock, FiAlertCircle, FiEye } from 'react-icons/fi';

export default function IssueModal({ issue, onClose, onUpdate, onDelete, socket }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: ''
  });
  const [users, setUsers] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description || '',
        status: issue.status,
        priority: issue.priority,
        assignee: issue.assignee ? issue.assignee._id : ''
      });
    }
    fetchUsers();
  }, [issue]);

  // Task Viewing Presence
  useEffect(() => {
    if (!issue || !socket || !user) return;

    // Emit viewing event
    socket.emit("task_viewing", {
      taskId: issue._id,
      user: { _id: user._id, name: user.name, avatar: user.avatarUrl }
    });

    const handleViewerJoined = (viewer) => {
      setViewers(prev => {
        if (prev.find(v => v._id === viewer._id)) return prev;
        return [...prev, viewer];
      });
    };

    const handleViewerLeft = (viewerId) => {
      setViewers(prev => prev.filter(v => v._id !== viewerId));
    };

    socket.on("task_viewer_joined", handleViewerJoined);
    socket.on("task_viewer_left", handleViewerLeft);

    return () => {
      socket.emit("task_stopped_viewing", {
        taskId: issue._id,
        userId: user._id
      });
      socket.off("task_viewer_joined", handleViewerJoined);
      socket.off("task_viewer_left", handleViewerLeft);
    };
  }, [issue, socket, user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      if (payload.assignee === '') payload.assignee = null;

      const res = await api.patch(`/api/issues/${issue._id}`, payload);
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update issue');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    try {
      await api.delete(`/api/issues/${issue._id}`);
      onDelete(issue._id);
      onClose();
    } catch (err) {
      alert('Failed to delete issue');
    }
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    setAiSuggestions(null);
    try {
      const res = await api.post('/api/ai/suggest', {
        title: formData.title,
        description: formData.description
      });
      setAiSuggestions(res.data);
    } catch (err) {
      alert("AI Suggestion failed. Check console.");
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestions = () => {
    if (!aiSuggestions) return;
    setFormData(prev => ({
      ...prev,
      priority: aiSuggestions.suggestedPriority.toLowerCase(),
      description: aiSuggestions.summary + "\n\n" + (prev.description || "")
    }));
    setAiSuggestions(null);
  };

  if (!issue) return null;

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-indigo-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-start bg-gradient-to-r from-slate-50 to-white">
          <div className="flex-1 mr-8">
            {/* Viewers Indicator */}
            {viewers.length > 0 && (
              <div className="flex items-center gap-3 mb-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <FiEye className="text-sm animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Viewing</span>
                </div>

                <div className="flex -space-x-2">
                  {viewers.map(v => (
                    <div key={v._id} className="relative group transition-transform hover:z-10 hover:scale-110">
                      {v.avatar ? (
                        <img
                          src={v.avatar}
                          alt={v.name}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                          title={`${v.name} is viewing`}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}

                      {/* Fallback for no avatar or error */}
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm"
                        style={{ display: v.avatar ? 'none' : 'flex' }}
                        title={`${v.name} is viewing`}
                      >
                        {v.name ? v.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium ml-1">
                  {viewers.length} {viewers.length === 1 ? 'person' : 'people'} here
                </span>
              </div>
            )}

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="text-2xl font-bold text-slate-900 w-full border-none focus:ring-0 p-0 placeholder-slate-300 bg-transparent"
              placeholder="Issue Title"
            />
            <div className="text-sm text-slate-500 mt-2 flex items-center gap-2">
              <span>in list</span>
              <span className="font-semibold text-blue-600 uppercase text-xs px-2 py-0.5 bg-blue-50 rounded-md">{formData.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2.5 rounded-xl hover:bg-slate-100 transition-all hover:scale-110">
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">

          {/* Main Content */}
          <div className="flex-1 p-8 border-r border-slate-100">
            {/* AI Section */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Description</h3>
              <button
                onClick={handleAiSuggest}
                disabled={aiLoading}
                className="text-xs flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 px-4 py-2 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md border border-blue-200"
              >
                <FiCpu className="text-sm" /> {aiLoading ? 'Analyzing...' : 'AI Assist'}
              </button>
            </div>

            {aiSuggestions && (
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                    <FiCpu className="text-blue-600" /> AI Suggestions
                  </h4>
                  <button onClick={applyAiSuggestions} className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all">
                    Apply All
                  </button>
                </div>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong className="font-semibold">Priority:</strong> {aiSuggestions.suggestedPriority}</p>
                  <p><strong className="font-semibold">Summary:</strong> {aiSuggestions.summary}</p>
                  {aiSuggestions.improvements && <p><strong className="font-semibold">Tip:</strong> {aiSuggestions.improvements}</p>}
                </div>
              </div>
            )}

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-xl p-4 text-slate-700 leading-relaxed resize-none transition-all"
              placeholder="Add a more detailed description..."
            />

            <div className="mt-8">
              <CommentsPanel issueId={issue._id} />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <button
                onClick={() => setShowActivity(!showActivity)}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-semibold mb-4 transition-colors"
              >
                <FiActivity /> {showActivity ? 'Hide Activity' : 'Show Activity History'}
              </button>
              {showActivity && <ActivityTimeline issueId={issue._id} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 bg-gradient-to-b from-slate-50 to-white p-8 space-y-6">

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-all"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(p => (
                  <button
                    key={p}
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`
                      px-3 py-2.5 rounded-xl text-xs font-bold capitalize border-2 transition-all
                      ${formData.priority === p
                        ? (p === 'high' ? 'bg-red-50 border-red-300 text-red-700 shadow-md' : p === 'medium' ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-md' : 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-md')
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Assignee</label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-all"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <FiSave /> Save Changes
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
              >
                <FiTrash2 /> Delete Issue
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
