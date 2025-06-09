import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
// import expand from "../../assets/icon/angle-small-down.png";
// import minimize from "../../assets/icon/angle-small-up.png"
import h41 from "../../assets/icon/h41.png"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SecurityIcon from '@mui/icons-material/Security';

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSubItemClick = (title: string, path: string) => {
    setSelectedSubItem(title);
    navigate(path);
  };

  const handleMenuClick = (menuId: string, path?: string) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setTimeout(() => {
        if (path) {
          navigate(path);
          setActiveMenu(menuId);
        } else {
          setActiveMenu(activeMenu === menuId ? null : menuId);
        }
      }, 300); // Đợi sidebar mở xong
    } else {
      if (path) {
        navigate(path);
        setActiveMenu(menuId);
      } else {
        setActiveMenu(activeMenu === menuId ? null : menuId);
      }
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      icon: <DashboardIcon />,
      text: "Bảng điều khiển",
      path: "/",
      subItems: [],
    },
    {
      id: "employees",
      icon: <PeopleIcon />,
      text: "Nhân viên",
      subItems: [
        { id: "manage", title: "Quản lý nhân viên", path: "/employees/manage" },
      ],
    },
    {
      id: "timekeeping",
      icon: <CalendarMonthIcon />,
      text: "Chấm công",
      subItems: [
        { id: "manage", title: "Quản lý chấm công", path: "/timekeeping/manage" },
        { id: "statistic", title: "Thống kê", path: "/timekeeping/statistic" }
      ],
    },
    {
      id: "security",
      icon: <SecurityIcon />,
      text: "An ninh",
      subItems: [
        { id: "monitor", title: "Xem Cam", path: "/security/monitor" },
        { id: "manage", title: "Quản lý Cam", path: "/security/manage" },
        { id: "history", title: "Lịch sử an ninh", path: "/security/history" }
      ]
    }
  ];

  return (
    <>
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="top">
          <div className="image-text">
            <span className="image">
              <img src={h41} alt="logo" />
            </span>
            <div className="text header-text">
              <span className="name">H41 Coding</span>
              <span className="profession">MTA</span>
            </div>
          </div>
          {/* <div className="toggle" onClick={toggleSidebar}>
            {isSidebarCollapsed ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
          </div> */}
        </div>

        <div className="sidebar-list">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <div
                className={`item ${activeMenu === item.id ? "selected" : ""}`}
                onClick={() => handleMenuClick(item.id, item.path)}
              >
                <div className="item-icon">
                  {item.icon}
                </div>
                <div className="item-text">{item.text}</div>
                {!isSidebarCollapsed && item.subItems.length > 0 && (
                  <div className="item-expand">
                    {/* <img src={activeMenu === item.id ? minimize : expand} alt="expand" /> */}
                  </div>
                )}
              </div>
              <div className={`item-submenu ${activeMenu === item.id && !isSidebarCollapsed ? "open" : ""}`}>
                {activeMenu === item.id && !isSidebarCollapsed &&
                  item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`subitem ${selectedSubItem === subItem.title ? "selected" : ""}`}
                      onClick={() => handleSubItemClick(subItem.title, subItem.path)}
                    >
                      {selectedSubItem === subItem.title && (
                        <div className="item-icon"></div>
                      )}
                      {subItem.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;