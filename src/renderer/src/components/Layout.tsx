import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  Home,
  Users,
  Camera,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Shield,
  UserCheck
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAnyPermission?: boolean;
  children?: MenuItem[];
}

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, hasPermission, hasAnyPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      label: 'Trang chủ',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: 'Quản lý nhân viên',
      path: '/employees',
      icon: <Users className="h-5 w-5" />,
      permission: 'employees.view',
    },
    {
      label: 'Chấm công',
      path: '/timekeeping',
      icon: <Clock className="h-5 w-5" />,
      permissions: ['timekeeping.view', 'timekeeping.manage'],
      requireAnyPermission: true,
      children: [
        {
          label: 'Danh sách chấm công',
          path: '/timekeeping/list',
          icon: <Clock className="h-4 w-4" />,
          permission: 'timekeeping.view',
        },
        {
          label: 'Chấm công thủ công',
          path: '/timekeeping/manual',
          icon: <UserCheck className="h-4 w-4" />,
          permission: 'timekeeping.manage',
        },
      ],
    },
    {
      label: 'Camera an ninh',
      path: '/cameras',
      icon: <Camera className="h-5 w-5" />,
      permissions: ['security.view', 'security.manage'],
      requireAnyPermission: true,
    },
    {
      label: 'Báo cáo',
      path: '/reports',
      icon: <BarChart3 className="h-5 w-5" />,
      permissions: ['reports.view', 'timekeeping.view'],
      requireAnyPermission: true,
    },
    {
      label: 'Quản trị hệ thống',
      path: '/admin',
      icon: <Settings className="h-5 w-5" />,
      permission: 'system.admin',
      children: [
        {
          label: 'Quản lý người dùng',
          path: '/admin/users',
          icon: <User className="h-4 w-4" />,
          permission: 'system.admin',
        },
        {
          label: 'Quản lý vai trò',
          path: '/admin/roles',
          icon: <Shield className="h-4 w-4" />,
          permission: 'system.admin',
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasMenuPermission = (item: MenuItem): boolean => {
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    if (item.permissions && item.permissions.length > 0) {
      if (item.requireAnyPermission) {
        return hasAnyPermission(item.permissions);
      } else {
        return item.permissions.every(permission => hasPermission(permission));
      }
    }
    return true;
  };

  const isActiveRoute = (path: string): boolean => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!hasMenuPermission(item)) {
      return null;
    }

    const isActive = isActiveRoute(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = level === 0 ? 'pl-4' : 'pl-8';

    return (
      <div key={item.path}>
        <Link
          to={item.path}
          className={`flex items-center ${paddingLeft} pr-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive
              ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          {item.icon}
          <span className="ml-3 flex-1">{item.label}</span>
          {hasChildren && (
            <ChevronDown className={`h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
          )}
        </Link>
        
        {hasChildren && isActive && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Face Recognition</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {menuItems.map(item => renderMenuItem(item))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Face Recognition</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {menuItems.map(item => renderMenuItem(item))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {menuItems.find(item => isActiveRoute(item.path))?.label || 'Hệ thống quản lý'}
                  </h1>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* User menu */}
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="ml-3 text-gray-700 text-sm font-medium hidden md:block">
                      {user?.full_name || user?.username}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400 hidden md:block" />
                  </button>
                </div>
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user?.full_name || user?.username}</div>
                        <div className="text-xs text-gray-500">{user?.role_name}</div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Thông tin cá nhân
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Click outside handler for user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;