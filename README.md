# TeamSync – Real-Time Collaborative Project Management Platform

TeamSync is a modern, real-time Kanban collaboration application designed to streamline project management. Inspired by industry leaders like Linear, Jira, and Trello, TeamSync leverages the power of the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO to deliver a seamless, live-updating experience. Whether you're moving tasks, editing descriptions, or just viewing a board, everything happens in real-time across all connected users.

---

## 🚀 Key Features

### 🟢 Real-Time Presence System
*   **Live Online Users:** Instantly see who is currently online on the board.
*   **Presence Avatars:** Online users are displayed with circular avatars in the board header, complete with status indicators.

### 👁️ Real-Time Task Viewing
*   **"User is viewing this task":** When a team member opens a task modal, their avatar appears in the modal for everyone else viewing the same task, similar to Google Docs or Figma.
*   **Live Updates:** Indicators appear and disappear instantly as users open and close tasks.

### 📋 Advanced Kanban Board
*   **Drag and Drop:** Smooth, intuitive drag-and-drop functionality for moving tasks between columns (Todo, In Progress, Done).
*   **Optimistic UI:** Changes are reflected instantly on the UI while syncing with the backend, ensuring a lag-free experience.
*   **Live Sync:** Moves made by one user are immediately reflected on everyone else's screen via Socket.IO.

### 📝 Comprehensive Issue Management
*   **Create, Edit, Delete:** Full control over task lifecycle.
*   **Rich Details:** Manage titles, descriptions, priority levels (Low, Medium, High), status, and assignees.
*   **Activity Timeline:** A detailed history of all changes made to a task (status changes, edits, comments).

### 🤖 AI-Powered Assistance
*   **Smart Suggestions:** Integrated AI assistant analyzes task titles and descriptions to suggest improvements, summaries, and appropriate priority levels.

### 💬 Interactive Comments
*   **Real-Time Discussion:** Add comments to tasks and see them appear instantly for other users.
*   **Timestamps:** Track when discussions happen.

### 🔐 Security & UI
*   **Secure Authentication:** Robust JWT (JSON Web Token) based authentication system.
*   **Modern UI:** Built with Tailwind CSS for a clean, responsive, and professional aesthetic.

---

## 🏗️ Architecture Overview

TeamSync follows a decoupled client-server architecture:

1.  **MERN Stack Separation:**
    *   **Client:** A React Single Page Application (SPA) handling the UI and user interactions.
    *   **Server:** A Node.js/Express REST API handling business logic and database operations.
    *   **Database:** MongoDB for persistent storage of Users, Boards, Issues, and Comments.

2.  **Real-Time Engine (Socket.IO):**
    *   **Presence Channel:** Tracks global user connectivity (`user_online`, `presence_update`).
    *   **Board Channel:** Broadcasts board-specific updates like task moves or creation (`join-board`, `issue-moved`).
    *   **Task Viewing Channel:** Manages the granular "who is viewing what" state (`task_viewing`, `task_viewer_joined`).

3.  **Data Flow:**
    *   REST API is used for initial data fetching and persistence (CRUD operations).
    *   Socket.IO is used for broadcasting events to connected clients to trigger state updates without reloading.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **Real-Time:** Socket.IO Client
*   **Drag & Drop:** @hello-pangea/dnd
*   **Icons:** React Icons

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Real-Time:** Socket.IO Server
*   **Authentication:** JSON Web Tokens (JWT)
*   **Validation:** Express Validator

---

## 📂 Project Folder Structure

```
teamsync/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (IssueModal, BoardColumn, etc.)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Application Pages (BoardPage, Login, Register)
│   │   ├── services/       # API and Socket services
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                 # Backend Node.js API
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Auth and validation middlewares
│   ├── models/             # Mongoose schemas (User, Issue, Board)
│   ├── routes/             # API route definitions
│   ├── app.js              # App configuration
│   ├── server.js           # Server entry point & Socket setup
│   └── package.json
│
└── README.md               # Project Documentation
```

---

## 📸 Screenshots

### Dashboard / Workspace
*(Placeholder for Dashboard Screenshot)*

### Board View
*(Placeholder for Kanban Board Screenshot)*

### Task Modal
*(Placeholder for Task Modal Screenshot)*

### Activity Timeline
*(Placeholder for Activity Timeline Screenshot)*

### Real-Time Presence Indicators
*(Placeholder for Presence Indicators Screenshot)*

---

## 🚀 How to Run Locally

Follow these steps to get TeamSync running on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/teamsync.git
cd teamsync
```

### 2. Install Dependencies
Install dependencies for both client and server:

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/teamsync
JWT_SECRET=your_super_secret_key_here
```

### 4. Start the Application
You need to run both the backend and frontend servers.

**Start Backend:**
```bash
cd server
npm run dev
```

**Start Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the App
Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 📡 API Endpoints (Overview)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user & get token |
| **Users** | | |
| GET | `/api/users/me` | Get current user profile |
| GET | `/api/users` | Get all users |
| **Boards** | | |
| GET | `/api/boards` | Get all boards |
| POST | `/api/boards` | Create a new board |
| **Issues** | | |
| GET | `/api/issues/board/:id` | Get issues for a board |
| POST | `/api/issues` | Create a new issue |
| PATCH | `/api/issues/:id` | Update an issue |
| DELETE | `/api/issues/:id` | Delete an issue |
| **Comments** | | |
| GET | `/api/comments/:issueId` | Get comments for an issue |
| POST | `/api/comments` | Add a comment |

---

## ⚡ Real-Time Events (Socket.IO)

TeamSync uses a robust event-driven architecture for real-time updates.

### Presence Events
*   `user_online`: Emitted by client when user logs in.
*   `presence_update`: Broadcasted by server with list of online users.

### Board Events
*   `issue-created`: Broadcasted when a new task is added.
*   `issue-updated`: Broadcasted when task details change.
*   `issue-deleted`: Broadcasted when a task is removed.
*   `issue-moved`: Broadcasted when a task is dragged to a new column.

### Task Viewing Events
*   `task_viewing`: Emitted when a user opens a task modal.
*   `task_stopped_viewing`: Emitted when a user closes the modal.
*   `task_viewer_joined`: Broadcasted to other viewers of the same task.
*   `task_viewer_left`: Broadcasted when a viewer leaves.

---

## 🔮 Future Enhancements

*   **Typing Indicators:** See when someone is writing a comment.
*   **Real-Time Cursor Tracking:** Visualize user cursors on the board.
*   **File Attachments:** Upload images and documents to tasks.
*   **Notifications System:** In-app and email notifications for mentions and assignments.
*   **AI-Powered Estimation:** AI analysis to estimate task complexity and time.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
