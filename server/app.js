// server/app.js
/*require('dotenv').config({ path: ['.env.local', '.env'] });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// simple health
app.get('/', (req, res) => res.json({ ok: true, message: 'TeamSync API running' }));

// after authRoutes import
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// DB connect (keep here so app can be imported in tests)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/teamsync';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err.message));

module.exports = app;*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const boardRoutes = require('./routes/boards');
const issueRoutes = require('./routes/issues');
const commentRoutes = require('./routes/comments');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Socket connection handler is in server.js

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workflows', require('./routes/workflowRoutes'));

app.get('/', (req, res) => res.json({ ok: true, message: 'TeamSync API running' }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teamsync';
mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.error('MongoDB error:', err.message));

module.exports = { app, server, io };

