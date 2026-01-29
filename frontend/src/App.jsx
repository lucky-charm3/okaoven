import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import Account from './pages/Account';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POSTerminal from './pages/POSTerminal';
import Reports from './pages/Reports';
import StaffManagement from './pages/StaffManagement';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fef08a',
            border: '1px solid rgba(254, 240, 138, 0.2)',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase'
          }
        }}
      />
      <Routes>
        {/* LOGIN ROUTE: Only accessible if not logged in */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        
        {/* PROTECTED ROUTES: Only accessible if logged in */}
        {user ? (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POSTerminal />} />
            
            {/* INVENTOROR & MANAGER ONLY */}
            <Route 
              path="/inventory" 
              element={user.role === 'MANAGER' || user.role === 'INVENTOROR' ? <Inventory /> : <Navigate to="/dashboard" replace />} 
            />

            <Route path="/account" element={<Account />} />
            
            {/* MANAGER ONLY ROUTES */}
            <Route 
              path="/reports" 
              element={user.role === 'MANAGER' ? <Reports /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/staff" 
              element={user.role === 'MANAGER' ? <StaffManagement /> : <Navigate to="/dashboard" replace />} 
            />
          </Route>
        ) : (
          /* If trying to access anything else while not logged in, force to login */
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
        
        {/* Default landing redirect */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;