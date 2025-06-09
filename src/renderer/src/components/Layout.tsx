import React, { useState } from 'react';
import { 
  Dashboard, 
  People, 
  CalendarMonth, 
  Security,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Notifications,
  Settings,
  Mail
} from '@mui/icons-material';

const Layout = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSubItemClick = (title: string, path: string) => {
    setSelectedSubItem(title);
    console.log(`Navigate to: ${path}`);
  };

  const handleMenuClick = (menuId: string, path?: string) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setTimeout(() => {
        if (path) {
          console.log(`Navigate to: ${path}`);
          setActiveMenu(menuId);
        } else {
          setActiveMenu(activeMenu === menuId ? null : menuId);
        }
      }, 300);
    } else {
      if (path) {
        console.log(`Navigate to: ${path}`);
        setActiveMenu(menuId);
      } else {
        setActiveMenu(activeMenu === menuId ? null : menuId);
      }
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      icon: <Dashboard className="w-6 h-6" />,
      text: "Bảng điều khiển",
      path: "/",
      subItems: [],
    },
    {
      id: "employees",
      icon: <People className="w-6 h-6" />,
      text: "Nhân viên",
      subItems: [
        { id: "manage", title: "Quản lý nhân viên", path: "/employees/manage" },
      ],
    },
    {
      id: "timekeeping",
      icon: <CalendarMonth className="w-6 h-6" />,
      text: "Chấm công",
      subItems: [
        { id: "manage", title: "Quản lý chấm công", path: "/timekeeping/manage" },
        { id: "statistic", title: "Thống kê", path: "/timekeeping/statistic" }
      ],
    },
    {
      id: "security",
      icon: <Security className="w-6 h-6" />,
      text: "An ninh",
      subItems: [
        { id: "monitor", title: "Xem Cam", path: "/security/monitor" },
        { id: "manage", title: "Quản lý Cam", path: "/security/manage" },
        { id: "history", title: "Lịch sử an ninh", path: "/security/history" }
      ]
    }
  ];

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
                  activeMenu === item.id 
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
                    {activeMenu === item.id ? 
                      <KeyboardArrowUp className="w-4 h-4" /> : 
                      <KeyboardArrowDown className="w-4 h-4" />
                    }
                  </div>
                )}
              </div>
              
              {/* Submenu */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  activeMenu === item.id && !isSidebarCollapsed 
                    ? 'max-h-96 opacity-100 mt-2' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                {activeMenu === item.id && !isSidebarCollapsed &&
                  item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`flex items-center h-12 ml-6 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                        selectedSubItem === subItem.title 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-gray-600 hover:bg-indigo-100'
                      }`}
                      onClick={() => handleSubItemClick(subItem.title, subItem.path)}
                    >
                      {selectedSubItem === subItem.title && (
                        <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
                      )}
                      <span className="text-sm font-medium">{subItem.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="col-start-2 bg-white flex items-center justify-between px-6 border-b border-gray-200">
        <div className="text-lg text-gray-900">
          Xin chào,
        </div>
        <div className="flex items-center space-x-5">
          <Notifications className="w-6 h-6 text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity" />
          <Mail className="w-6 h-6 text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity" />
          <Settings className="w-6 h-6 text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity" />
          <div className="flex items-center cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="col-start-2 p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nội dung chính</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Thống kê 1</h3>
              <p className="text-3xl font-bold">1,234</p>
              <p className="text-sm opacity-90">Tổng nhân viên</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Thống kê 2</h3>
              <p className="text-3xl font-bold">567</p>
              <p className="text-sm opacity-90">Đang hoạt động</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Thống kê 3</h3>
              <p className="text-3xl font-bold">89</p>
              <p className="text-sm opacity-90">Cần xử lý</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">{item}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900 font-medium">Hoạt động {item}</p>
                    <p className="text-gray-600 text-sm">Mô tả chi tiết hoạt động số {item}</p>
                  </div>
                  <div className="ml-auto text-gray-500 text-sm">
                    {item} phút trước
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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