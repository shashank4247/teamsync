// server/server.js
/*const app = require('./app');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});*/
const { app, server, io } = require('./app');

const PORT = process.env.PORT || 4000;

// const server = http.createServer(app); // Removed: using server from app.js
// const io = new Server(server, ...); // Removed: using io from app.js

// Socket logic
/*io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join-board', (boardId) => {
    socket.join(`board:${boardId}`);
  });

  socket.on('leave-board', (boardId) => {
    socket.leave(`board:${boardId}`);
  });

  socket.on('disconnect', () => {
    // handle presence if needed
  });
});*/
// Global online users map: { userId: socketId }
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // === PRESENCE SYSTEM ===
  socket.on("user_online", (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId; // Attach userId to socket for disconnect handling
      io.emit("presence_update", Array.from(onlineUsers.keys()));
      console.log(`User ${userId} is online. Total online: ${onlineUsers.size}`);
    }
  });

  socket.on("user_offline", (userId) => {
    if (userId) {
      onlineUsers.delete(userId);
      io.emit("presence_update", Array.from(onlineUsers.keys()));
      console.log(`User ${userId} went offline. Total online: ${onlineUsers.size}`);
    }
  });

  // Send current online users when requested
  socket.on("get_online_users", () => {
    socket.emit("presence_update", Array.from(onlineUsers.keys()));
    console.log(`Sent online users list to ${socket.id}. Total: ${onlineUsers.size}`);
  });

  // === BOARD EVENTS ===
  socket.on('join-board', (boardId) => {
    socket.join(`board:${boardId}`);
    console.log(`Socket ${socket.id} joined board: ${boardId}`);
  });

  socket.on('leave-board', (boardId) => {
    socket.leave(`board:${boardId}`);
    console.log(`Socket ${socket.id} left board: ${boardId}`);
  });

  // === ISSUE/COMMENTS EVENTS ===
  socket.on('join-issue', (issueId) => {
    socket.join(`issue:${issueId}`);
  });

  socket.on('leave-issue', (issueId) => {
    socket.leave(`issue:${issueId}`);
  });

  socket.on('comment-added', (issueId) => {
    io.to(`issue:${issueId}`).emit('refresh-comments');
  });

  // === TASK VIEWING PRESENCE ===
  socket.on("task_viewing", ({ taskId, user }) => {
    socket.join(`task-${taskId}`);
    socket.to(`task-${taskId}`).emit("task_viewer_joined", user);
    console.log(`User ${user.name} viewing task ${taskId}`);
  });

  socket.on("task_stopped_viewing", ({ taskId, userId }) => {
    socket.leave(`task-${taskId}`);
    socket.to(`task-${taskId}`).emit("task_viewer_left", userId);
    console.log(`User ${userId} stopped viewing task ${taskId}`);
  });

  // === DISCONNECT ===
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("presence_update", Array.from(onlineUsers.keys()));
      console.log(`User ${socket.userId} disconnected. Total online: ${onlineUsers.size}`);
    }
  });
});


// Make io available via app for controllers if needed
app.set('io', io);

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

