import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Dashboard, 
  People, 
  CalendarMonth, 
  Security,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Notifications,
  Settings,
  Mail,
  Logout,
  BarChart
} from '@mui/icons-material';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSubItemClick = (path: string) => {
    navigate(path);
  };

  const handleMenuClick = (menuId: string, path?: string) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setTimeout(() => {
        if (path) {
          navigate(path);
        } else {
          setActiveMenu(activeMenu === menuId ? null : menuId);
        }
      }, 300);
    } else {
      if (path) {
        navigate(path);
      } else {
        setActiveMenu(activeMenu === menuId ? null : menuId);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      icon: <Dashboard className="w-6 h-6" />,
      text: "Bảng điều khiển",
      path: "/dashboard",
      subItems: [],
    },
    {
      id: "employees",
      icon: <People className="w-6 h-6" />,
      text: "Nhân viên",
      subItems: [
        { id: "manage", title: "Quản lý nhân viên", path: "/employees/manage" },
        { id: "add", title: "Thêm nhân viên", path: "/employee/add" },
      ],
    },
    {
      id: "timekeeping",
      icon: <CalendarMonth className="w-6 h-6" />,
      text: "Chấm công",
      subItems: [
        { id: "history", title: "Lịch sử chấm công", path: "/timekeeping/manage" },
        { id: "statistic", title: "Thống kê", path: "/timekeeping/statistic" }
      ],
    },
    {
      id: "security",
      icon: <Security className="w-6 h-6" />,
      text: "An ninh",
      subItems: [
        { id: "monitor", title: "Xem Camera", path: "/security/monitor" },
        { id: "manage", title: "Quản lý Camera", path: "/security/manage" },
        { id: "history", title: "Lịch sử an ninh", path: "/security/history" },
        { id: "recognise", title: "Nhận diện", path: "/security/recognise" }
      ]
    },
    {
      id: "reports",
      icon: <BarChart className="w-6 h-6" />,
      text: "Báo cáo",
      path: "/reports",
      subItems: [],
    }
  ];

  // Check if current path matches menu item
  const isMenuActive = (item: any) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.subItems?.some((sub: any) => location.pathname.startsWith(sub.path))) return true;
    return false;
  };

  // Check if submenu should be open
  const isSubmenuOpen = (item: any) => {
    if (activeMenu === item.id) return true;
    return item.subItems?.some((sub: any) => location.pathname.startsWith(sub.path));
  };

  // Check if subitem is active
  const isSubItemActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen w-full grid grid-cols-[240px_1fr] grid-rows-[50px_1fr] bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`row-span-2 bg-gray-100 flex flex-col transition-all duration-500 ease-in-out fixed h-full z-50 ${
          isSidebarCollapsed ? 'w-20 px-1' : 'w-60 px-4'
        }`}
        style={{ backgroundColor: 'var(--sidebar-color, #f8fafc)' }}
      >
        {/* Logo Section */}
        <div className="py-4 px-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H41</span>
            </div>
            <div 
              className={`ml-3 transition-all duration-300 ${
                isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              <div className="text-lg font-bold text-gray-900">H41 Coding</div>
              <div className="text-sm font-semibold text-gray-600">MTA</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-2 space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <div
                className={`flex items-center h-15 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                  isMenuActive(item)
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-indigo-200'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                onClick={() => handleMenuClick(item.id, item.path)}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <div 
                  className={`ml-3 text-base font-medium transition-all duration-300 ${
                    isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}
                >
                  {item.text}
                </div>
                {!isSidebarCollapsed && item.subItems.length > 0 && (
                  <div className="ml-auto">
                    {isSubmenuOpen(item) ? 
                      <KeyboardArrowUp className="w-4 h-4" /> : 
                      <KeyboardArrowDown className="w-4 h-4" />
                    }
                  </div>
                )}
              </div>
              
              {/* Submenu */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isSubmenuOpen(item) && !isSidebarCollapsed 
                    ? 'max-h-96 opacity-100 mt-2' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                {isSubmenuOpen(item) && !isSidebarCollapsed &&
                  item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`flex items-center h-12 ml-6 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                        isSubItemActive(subItem.path)
                          ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                          : 'text-gray-600 hover:bg-indigo-100'
                      }`}
                      onClick={() => handleSubItemClick(subItem.path)}
                    >
                      {isSubItemActive(subItem.path) && (
                        <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
                      )}
                      <span className="text-sm font-medium">{subItem.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Menu */}
        {!isSidebarCollapsed && (
          <div className="border-t border-gray-200 py-4">
            <div className="flex items-center px-3 py-2 text-gray-700">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {user?.full_name || user?.username}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.role_name}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 mt-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
              <Logout className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="col-start-2 bg-white flex items-center justify-between px-6 border-b border-gray-200">
        <div className="text-lg text-gray-900">
          Xin chào, {user?.full_name || user?.username}!
        </div>
        <div className="flex items-center space-x-5">
          <Notifications className="w-6 h-6 text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity" />
          <Mail className="w-6 h-6 text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity" />
          <Settings 
            className="w-6 h-6 text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/profile')}
          />
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="col-start-2 p-6 overflow-auto bg-gray-50">
        <Outlet />
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="fixed top-12 left-52 z-50 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-all duration-300"
        style={{ 
          left: isSidebarCollapsed ? '68px' : '232px',
          transition: 'left 0.5s ease'
        }}
      >
        {isSidebarCollapsed ? '>' : '<'}
      </button>
    </div>
  );
};

export default Layout;