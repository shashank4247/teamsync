// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// replace or add these two files (create if missing)
import BoardsList from './pages/BoardsList';
import BoardPage from './pages/BoardPage';

import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import ErrorBoundary from './components/ErrorBoundary';
import WorkflowRules from './pages/WorkflowRules';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Boards list (protected) */}
            <Route
              path="/boards"
              element={
                <PrivateRoute>
                  <BoardsList />
                </PrivateRoute>
              }
            />

            {/* Single board page (protected) */}
            <Route
              path="/boards/:boardId"
              element={
                <PrivateRoute>
                  <BoardPage />
                </PrivateRoute>
              }
            />

            {/* Workflow Rules page (protected) */}
            <Route
              path="/workflows"
              element={
                <PrivateRoute>
                  <WorkflowRules />
                </PrivateRoute>
              }
            />

          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

