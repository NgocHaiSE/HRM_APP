// import "../src/assets/css/base.css"
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import MainLayout from "./share/MainLayout/MainLayout";
// import Monitor from "./pages/Security/Monitor";
// import List from "./pages/Employees/Manage";
// import Detail from "./pages/Employees/Detail";
// import ManageCam from "./pages/Security/ManageCam";
// import Login from "./pages/Login/Login" 
// import AddEmployee from "./pages/Employees/AddEmployee";
// import RecogniseHistory from "./pages/Security/RecogniseHistory/RecogniseHistory";
// import TimekeepingHistory from "./pages/Employees/TimekeepingHistory";
// import Recognise from "./pages/Security/ManageRecognise/Recognise";
// import Statistic from "./pages/Timekeeping/statistic";


// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// // Trong App.tsx
// function App(): JSX.Element {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
        
//         <Route path="/" element={
//           localStorage.getItem('isAuthenticated') === 'true' ? 
//           <Navigate to="/security/monitor" replace /> : 
//           <Navigate to="/login" replace />
//         } />
        
//         <Route element={
//           <ProtectedRoute>
//             <MainLayout />
//           </ProtectedRoute>
//         }>
//           <Route path="/security/monitor" element={<Monitor />} />
//           <Route path="/employees/manage" element={<List />} />
//           <Route path="/employee/add" element={<AddEmployee/>} />
//           <Route path="/timekeeping/manage" element={<TimekeepingHistory />} />
//           <Route path="/timekeeping/statistic" element={<Statistic />} />
//           <Route path="/detail" element={<Detail />} />
//           <Route path="/security/manage" element={<ManageCam />} />
//           <Route path="/security/history" element={<RecogniseHistory />} />
//           <Route path="/security/recognise" element={<Recognise />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App


import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';


// Placeholder components for other pages
const EmployeesPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý nhân viên</h1>
    <p className="text-gray-600">Trang quản lý nhân viên sẽ được phát triển ở đây</p>
  </div>
);

const TimekeepingPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Chấm công</h1>
    <p className="text-gray-600">Trang chấm công sẽ được phát triển ở đây</p>
  </div>
);

const CamerasPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Camera an ninh</h1>
    <p className="text-gray-600">Trang quản lý camera sẽ được phát triển ở đây</p>
  </div>
);

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

const ProfilePage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Thông tin cá nhân</h1>
    <p className="text-gray-600">Trang thông tin cá nhân sẽ được phát triển ở đây</p>
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
              <Route path="employees/*" element={
                <ProtectedRoute requiredPermission="employees.view">
                  <EmployeesPage />
                </ProtectedRoute>
              } />
              
              {/* Timekeeping */}
              <Route path="timekeeping/*" element={
                <ProtectedRoute 
                  requiredPermissions={['timekeeping.view', 'timekeeping.manage']}
                  requireAnyPermission={true}
                >
                  <TimekeepingPage />
                </ProtectedRoute>
              } />
              
              {/* Cameras */}
              <Route path="cameras/*" element={
                <ProtectedRoute 
                  requiredPermissions={['security.view', 'security.manage']}
                  requireAnyPermission={true}
                >
                  <CamerasPage />
                </ProtectedRoute>
              } />
              
              {/* Reports */}
              <Route path="reports/*" element={
                <ProtectedRoute 
                  requiredPermissions={['reports.view', 'timekeeping.view']}
                  requireAnyPermission={true}
                >
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
              <Route path="profile" element={<ProfilePage />} />
              
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