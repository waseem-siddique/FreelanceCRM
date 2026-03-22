import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ProjectList from './pages/ProjectList';
import Invoice from './pages/Invoice';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import ProjectDetails from './pages/ProjectDetails';
import ClientDetails from './pages/ClientDetails';
import Revenue from './pages/Revenue';


function App() {
  const location = useLocation();

  // Auth pages and landing page have no navbar (they manage their own layout)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage || location.pathname === '/') {
    return (
      <>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
      </>
    );
  }

  // Protected pages – each includes its own TopBar component
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
        <Route path="/client/:clientId" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
        <Route path="/invoice/:projectId" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/revenue" element={<ProtectedRoute><Revenue /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
