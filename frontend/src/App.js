import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import PollList from './pages/PollList';
import VotePage from './pages/VotePage';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/poll/:id" element={<VotePage />} />
          <Route path="/analytics/:id" element={<Analytics />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
