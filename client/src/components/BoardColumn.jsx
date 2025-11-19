import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import IssueCard from './IssueCard';
import { FiPlus, FiX } from 'react-icons/fi';

export default function BoardColumn({ columnId, title, issues, onIssueClick, onAddIssue, onlineUsers }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setIsAdding(false);
      return;
    }
    onAddIssue(newTitle);
    setNewTitle("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm max-h-full">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-200/60 flex-shrink-0 bg-white/50 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{title}</h3>
          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {issues.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <FiPlus className="text-lg" />
        </button>
      </div>

      {/* Task List */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
              flex-1 p-4 overflow-y-auto min-h-[150px] transition-all duration-200
              ${snapshot.isDraggingOver ? 'bg-blue-50/50 ring-2 ring-blue-200 ring-inset' : ''}
            `}
          >
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  index={index}
                  onClick={() => onIssueClick(issue)}
                  onlineUsers={onlineUsers}
                />
              ))}
            </div>
            {provided.placeholder}

            {/* Inline Add Task Form */}
            {isAdding ? (
              <form onSubmit={handleSubmit} className="mt-3 animate-slideUp">
                <div className="bg-white p-4 rounded-xl border-2 border-blue-300 shadow-lg ring-2 ring-blue-100">
                  <input
                    autoFocus
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 placeholder-slate-400 border-none focus:ring-0 p-0 mb-3 bg-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsAdding(false);
                    }}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    >
                      Add Card
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Quick Add Button at bottom */
              <button
                onClick={() => setIsAdding(true)}
                className="w-full py-3 mt-2 text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border-2 border-transparent hover:border-blue-200 border-dashed transition-all flex items-center justify-center gap-2 font-medium group"
              >
                <FiPlus className="group-hover:scale-110 transition-transform" />
                <span>Add Task</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
