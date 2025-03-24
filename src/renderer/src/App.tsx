import "../src/assets/css/base.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./share/MainLayout/MainLayout";
import Monitor from "./pages/Security/Monitor";
import List from "./pages/Employees/Manage";
import Detail from "./pages/Employees/Detail";
import ManageCam from "./pages/Security/ManageCam";
import Login from "./pages/Login/Login" 
import AddEmployee from "./pages/Employees/AddEmployee";
import RecogniseHistory from "./pages/Security/RecogniseHistory/RecogniseHistory";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Trong App.tsx
function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          localStorage.getItem('isAuthenticated') === 'true' ? 
          <Navigate to="/security/monitor" replace /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/security/monitor" element={<Monitor />} />
          <Route path="/employees/manage" element={<List />} />
          <Route path="/employee/add" element={<AddEmployee/>} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/security/manage" element={<ManageCam />} />
          <Route path="/security/history" element={<RecogniseHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
