import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FiAlignLeft, FiCheckCircle, FiClock, FiAlertCircle, FiMessageCircle } from 'react-icons/fi';
import UserAvatar from './UserAvatar';

const PriorityIcon = ({ priority }) => {
  switch (priority) {
    case 'high': return <FiAlertCircle className="text-red-500" />;
    case 'medium': return <FiClock className="text-amber-500" />;
    case 'low': return <FiCheckCircle className="text-emerald-500" />;
    default: return null;
  }
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    high: 'bg-red-50 text-red-700 border-red-200 shadow-sm',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${colors[priority] || 'bg-slate-100 text-slate-600'}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

export default function IssueCard({ issue, index, onClick, onlineUsers = [] }) {
  // Check if assignee is online
  const isOnline = issue.assignee && onlineUsers.includes(issue.assignee._id);

  const priorityColors = {
    high: 'from-red-500 to-red-600',
    medium: 'from-amber-500 to-amber-600',
    low: 'from-emerald-500 to-emerald-600',
  };

  return (
    <Draggable draggableId={issue._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`
            group bg-white p-4 rounded-xl border border-slate-200 
            shadow-sm hover:shadow-lg transition-all duration-300 
            cursor-pointer relative overflow-hidden
            hover:scale-[1.02] hover:border-blue-200
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-400 rotate-2 scale-105' : ''}
          `}
        >
          {/* Priority Indicator Line with Gradient */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${priorityColors[issue.priority] || 'from-slate-400 to-slate-500'}`} />

          <div className="pl-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-slate-400 font-mono font-medium">#{issue._id.slice(-4)}</span>
              <PriorityBadge priority={issue.priority} />
            </div>

            <h4 className="text-slate-900 font-semibold text-sm mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
              {issue.title}
            </h4>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                {issue.description && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <FiAlignLeft className="text-sm" />
                  </div>
                )}
                {issue.comments && issue.comments.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                    <FiMessageCircle className="text-sm text-slate-500" />
                    <span className="text-xs font-bold text-slate-600">{issue.comments.length}</span>
                  </div>
                )}
              </div>

              {issue.assignee ? (
                <UserAvatar
                  user={issue.assignee}
                  isOnline={isOnline}
                  size="sm"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <span className="text-slate-400 text-xs font-bold">+</span>
                </div>
              )}
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      )}
    </Draggable>
  );
}
