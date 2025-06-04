import { useState } from "react";
import './Sidebar.css';


interface SidebarProps {
  children: React.ReactNode;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({children, width = '250px'}) => {
  const [isOPen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOPen);
  };

  return (
    <div className="sidebar-container">
      <div 
        className={`sidebar ${isOPen ? 'open' : 'closed'}`}
        style={{ width: isOPen ? width : '0px' }}
      >
        <div className="sidebar-content">
          {children}
        </div>
      </div>
      <button
        className={`toggle-button ${isOPen ? 'open' : 'closed'}`}
        onClick={toggleSidebar}
      >
        {isOPen ? '>' : '<'}
      </button>
    </div>
  )
}

export default Sidebar;