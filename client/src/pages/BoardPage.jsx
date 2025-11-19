import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import api from '../services/api';
import BoardColumn from '../components/BoardColumn';
import IssueModal from '../components/IssueModal';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function BoardPage() {
  const { boardId } = useParams();
  const { user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineUserDetails, setOnlineUserDetails] = useState([]);

  // Fetch issues on board load
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get(`/api/issues/board/${boardId}`);
        setIssues(res.data);
      } catch (err) {
        console.error('Error fetching issues:', err);
      }
    };
    fetchIssues();
  }, [boardId]);

  // Join board room when component mounts
  useEffect(() => {
    if (!boardId) return;

    socket.emit("join-board", boardId);
    console.log('Joined board:', boardId);

    return () => {
      socket.emit("leave-board", boardId);
      console.log('Left board:', boardId);
    };
  }, [boardId]);

  // Listen for presence updates
  useEffect(() => {
    const handlePresenceUpdate = (users) => {
      console.log('Presence update received:', users);
      setOnlineUsers(users);
    };

    socket.on("presence_update", handlePresenceUpdate);

    // Request initial presence update
    socket.emit("get_online_users");

    return () => {
      socket.off("presence_update", handlePresenceUpdate);
    };
  }, []);

  // Fetch user details when onlineUsers changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      const details = [];
      for (const userId of onlineUsers) {
        // 1. Try to find in loaded issues (fastest, no API call needed)
        const foundInIssues = issues.find(i => i.assignee?._id === userId)?.assignee;

        if (foundInIssues) {
          details.push(foundInIssues);
        } else {
          // 2. Fallback to API
          try {
            const res = await api.get(`/api/users/${userId}`);
            details.push(res.data);
          } catch (err) {
            // If API fails (e.g. route missing), use placeholder
            // We use a consistent placeholder so it doesn't flicker
            details.push({ _id: userId, name: 'User', avatarUrl: '' });
          }
        }
      }

      // Deduplicate by ID
      const unique = Array.from(new Map(details.map(item => [item._id, item])).values());
      setOnlineUserDetails(unique);
    };

    if (onlineUsers.length > 0) {
      fetchUserDetails();
    } else {
      setOnlineUserDetails([]);
    }
  }, [onlineUsers, issues]);

  // Issue update listeners
  useEffect(() => {
    const handleIssueCreated = (newIssue) => {
      console.log('Issue created:', newIssue);
      if (newIssue.boardId === boardId) {
        setIssues(prev => [...prev, newIssue]);
      }
    };

    const handleIssueUpdated = (updated) => {
      console.log('Issue updated:', updated);
      if (updated.boardId === boardId) {
        setIssues(prev => prev.map(i => i._id === updated._id ? updated : i));
        if (selectedIssue && selectedIssue._id === updated._id) {
          setSelectedIssue(updated);
        }
      }
    };

    const handleIssueMoved = ({ issueId, issue }) => {
      console.log('Issue moved:', issue);
      if (issue.boardId !== boardId) return;
      setIssues(prev => [...prev.filter(i => i._id !== issueId), issue]);
    };

    const handleIssueDeleted = ({ issueId }) => {
      console.log('Issue deleted:', issueId);
      setIssues(prev => prev.filter(i => i._id !== issueId));
      if (selectedIssue && selectedIssue._id === issueId) {
        setIsModalOpen(false);
        setSelectedIssue(null);
      }
    };

    socket.on("issue-created", handleIssueCreated);
    socket.on("issue-updated", handleIssueUpdated);
    socket.on("issue-moved", handleIssueMoved);
    socket.on("issue-deleted", handleIssueDeleted);

    return () => {
      socket.off("issue-created", handleIssueCreated);
      socket.off("issue-updated", handleIssueUpdated);
      socket.off("issue-moved", handleIssueMoved);
      socket.off("issue-deleted", handleIssueDeleted);
    };
  }, [boardId, selectedIssue]);

  // Drag & Drop
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const newStatus = destination.droppableId;

    // Optimistic update
    setIssues(prev =>
      prev.map(i => (i._id === draggableId ? { ...i, status: newStatus } : i))
    );

    try {
      await api.post(`/api/issues/${draggableId}/move`, {
        toStatus: newStatus,
        toOrder: destination.index
      });
    } catch (err) {
      console.error("Move failed:", err);
      // Revert on error
      try {
        const res = await api.get(`/api/issues/board/${boardId}`);
        setIssues(res.data);
      } catch (fetchErr) {
        console.error("Failed to revert:", fetchErr);
      }
    }
  };

  const handleAddIssue = async (status, title) => {
    if (!title || !title.trim()) return;

    try {
      await api.post('/api/issues', {
        boardId,
        title: title.trim(),
        status,
        priority: 'medium'
      });
    } catch (err) {
      console.error('Error creating issue:', err);
      alert('Failed to create issue. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Project Board</h1>
        <div className="flex items-center gap-4">

          {/* Presence Avatars */}
          <div className="flex items-center -space-x-2">
            {onlineUserDetails.map((u) => (
              <div key={u._id} className="relative group transition-transform hover:z-10 hover:scale-110">
                {u.avatarUrl ? (
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-7 h-7 rounded-full border border-white shadow-sm object-cover"
                    title={u.name || 'User'}
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full border border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm"
                    title={u.name || 'User'}
                  >
                    {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
              </div>
            ))}
          </div>

          {/* Online users count */}
          <div className="text-sm text-slate-500 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${onlineUsers.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="font-medium">{onlineUsers.length} online</span>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden pb-2">
          {['todo', 'in-progress', 'done'].map(status => (
            <BoardColumn
              key={status}
              columnId={status}
              title={status.replace('-', ' ')}
              issues={issues.filter(i => i.status === status)}
              onIssueClick={(issue) => {
                setSelectedIssue(issue);
                setIsModalOpen(true);
              }}
              onAddIssue={(title) => handleAddIssue(status, title)}
              onlineUsers={onlineUsers}
            />
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          socket={socket}
          onClose={() => setIsModalOpen(false)}
          onUpdate={(updated) => {
            setIssues(prev => prev.map(i => i._id === updated._id ? updated : i));
          }}
          onDelete={(id) => {
            setIssues(prev => prev.filter(i => i._id !== id));
          }}
        />
      )}
    </div>
  );
}
