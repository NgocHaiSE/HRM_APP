import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Import actual components
import Manage from './pages/Employees/Manage';
import AddEmployee from './pages/Employees/AddEmployee';
import Detail from './pages/Employees/Detail';
import TimekeepingHistory from './pages/Employees/TimekeepingHistory';
import Monitor from './pages/Security/Monitor';
import ManageCam from './pages/Security/ManageCam';
import RecogniseHistory from './pages/Security/RecogniseHistory/RecogniseHistory';
import Recognise from './pages/Security/ManageRecognise/Recognise';
import Statistic from './pages/Timekeeping/statistic';
import Profile from './components/Profile/Profile';

// Placeholder components for future development
const ReportsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Báo cáo</h1>
    <p className="text-gray-600">Trang báo cáo sẽ được phát triển ở đây</p>
  </div>
);

const AdminPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản trị hệ thống</h1>
    <p className="text-gray-600">Trang quản trị sẽ được phát triển ở đây</p>
  </div>
);

const NotFoundPage = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🔍</div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Trang không tồn tại</h1>
    <p className="text-gray-600">Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Default redirect to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard - accessible to all authenticated users */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Employee Management */}
              <Route path="employees">
                <Route path="manage" element={
                  <ProtectedRoute requiredPermission="employees.view">
                    <Manage />
                  </ProtectedRoute>
                } />
              </Route>
              
              <Route path="employee">
                <Route path="add" element={
                  <ProtectedRoute requiredPermission="employees.create">
                    <AddEmployee />
                  </ProtectedRoute>
                } />
              </Route>
              
              <Route path="detail" element={
                <ProtectedRoute requiredPermission="employees.view">
                  <Detail />
                </ProtectedRoute>
              } />
              
              {/* Timekeeping */}
              <Route path="timekeeping">
                <Route path="manage" element={
                  <ProtectedRoute requiredPermission="timekeeping.view">
                    <TimekeepingHistory />
                  </ProtectedRoute>
                } />
                <Route path="statistic" element={
                  <ProtectedRoute requiredPermission="timekeeping.view">
                    <Statistic />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Security */}
              <Route path="security">
                <Route path="monitor" element={
                  <ProtectedRoute requiredPermission="security.view">
                    <Monitor />
                  </ProtectedRoute>
                } />
                <Route path="manage" element={
                  <ProtectedRoute requiredPermission="security.manage">
                    <ManageCam />
                  </ProtectedRoute>
                } />
                <Route path="history" element={
                  <ProtectedRoute requiredPermission="security.view">
                    <RecogniseHistory />
                  </ProtectedRoute>
                } />
                <Route path="recognise" element={
                  <ProtectedRoute requiredPermission="security.view">
                    <Recognise />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Reports */}
              <Route path="reports" element={
                <ProtectedRoute requiredPermission="reports.view">
                  <ReportsPage />
                </ProtectedRoute>
              } />
              
              {/* Admin */}
              <Route path="admin/*" element={
                <ProtectedRoute requiredPermission="system.admin">
                  <AdminPage />
                </ProtectedRoute>
              } />
              
              {/* Profile */}
              <Route path="profile" element={<Profile />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Catch all other routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;