import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import dashBoard from "../../assets/icon/dashboard.svg";
import groupPeople from "../../assets/icon/user-group-2.svg";
import evaluation from "../../assets/icon/chart-evaluation.svg";
import calendar from "../../assets/icon/calendar.svg";
import expand from "../../assets/icon/angle-small-down.png";
import minimize from "../../assets/icon/angle-small-up.png"
import camera from "../../assets/icon/camera-cctv.png"
import logo from "../../assets/icon/h41dev.png"

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  const handleSubItemClick = (title: string, path: string) => {
    setSelectedSubItem(title);
    navigate(path);
  };

  const handleMenuClick = (menuId: string, path?: string) => {
    if (path) {
      navigate(path);
      setActiveMenu(menuId);
    } else {
      setActiveMenu(activeMenu === menuId ? null : menuId);
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      icon: dashBoard,
      text: "Bảng điều khiển",
      path: "/dashboard",
      subItems: [],
    },
    {
      id: "employees",
      icon: groupPeople,
      text: "Nhân viên",
      subItems: [
        { id: "manage", title: "Quản lý nhân viên", path: "/employees/manage" },
        { id: "add", title: "Thêm nhân viên", path: "/employees/add" }
      ],
    },
    {
      id: "timekeeping",
      icon: calendar,
      text: "Chấm công",
      subItems: [
        { id: "manage", title: "Quản lý chấm công", path: "/timekeeping/manage" }
      ],
    },
    {
      id: "evaluation",
      icon: evaluation,
      text: "Tài chính",
      path: "/evaluation",
      subItems: [],
    },
    {
      id: "security",
      icon: camera,
      text: "An ninh",
      subItems: [
        { id: "monitor", title: "Xem Cam", path: "/security/monitor" },
        { id: "manage", title: "Quản lý Cam", path: "/security/manage" }
      ]
    }
  ];

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} />
        </div>

        <div className="sidebar-list">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <div
                className={`item && ${activeMenu ===item.id ? "selected" : ""}`}
                onClick={() => handleMenuClick(item.id, item.path)}
              >
                <div className="item-icon">
                  <img src={item.icon} alt={item.text} />
                </div>
                <div className="item-text">{item.text}</div>
                {item.subItems.length > 0 && (
                  <div className="item-expand">
                    <img src={activeMenu === item.id ? minimize : expand} />

                  </div>
                )}
              </div>
              <div className={`item-submenu ${activeMenu === item.id ? "open" : ""}`}>
                {activeMenu === item.id &&
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