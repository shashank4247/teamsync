import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import socket from "../services/socket";
import { FiSend, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function CommentsPanel({ issueId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const { user } = useAuth();

  // Load comments
  const loadComments = async () => {
    try {
      const res = await api.get(`/api/comments/${issueId}`);
      setComments(res.data);
      // Scroll to bottom only on initial load or new comment
    } catch (err) {
      console.error("Load comments error", err);
    }
  };

  // On mount — load + join socket room
  useEffect(() => {
    loadComments();
    socket.connect();
    socket.emit("join-issue", issueId);

    socket.on("refresh-comments", () => {
      loadComments();
    });

    return () => {
      socket.emit("leave-issue", issueId);
      socket.off("refresh-comments");
      socket.disconnect();
    };
  }, [issueId]);

  // Send comment
  const sendComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post("/api/comments", {
        issueId,
        text,
      });

      socket.emit("comment-added", issueId);
      setText("");
      loadComments();
    } catch (err) {
      console.error("Send comment error", err);
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/api/comments/${id}`);
      socket.emit("comment-added", issueId);
      loadComments();
    } catch (err) {
      console.error("Delete comment error", err);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
        <FiMessageSquare className="text-blue-600" /> Comments ({comments.length})
      </h3>

      {/* COMMENTS LIST */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
        {comments.length === 0 && (
          <div className="text-slate-400 text-sm italic bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
            No comments yet. Be the first to say something!
          </div>
        )}

        {comments.map((c) => (
          <div key={c._id} className="flex gap-3 items-start group">
            {/* AVATAR */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
              {c.userId?.name?.[0]?.toUpperCase() || "U"}
            </div>

            {/* BUBBLE */}
            <div className="flex-1">
              <div className="bg-slate-50 rounded-2xl rounded-tl-none p-3 border border-slate-200 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-bold text-slate-900">{c.userId?.name || "Unknown"}</span>
                  <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{c.text}</p>
              </div>

              {/* Delete Action */}
              {user && c.userId?._id === user._id && (
                <button
                  onClick={() => deleteComment(c._id)}
                  className="text-red-400 hover:text-red-600 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold"
                >
                  <FiTrash2 /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT AREA */}
      <form onSubmit={sendComment} className="relative">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-sm font-medium text-slate-900"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
}
