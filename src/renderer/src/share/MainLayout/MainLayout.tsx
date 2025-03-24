// import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./MainLayout.css"

const MainLayout = () => {
  return (
    <>
      <div className="layout">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="header">
          <Header />
        </div>
        <div className="content"> <Outlet /></div> 
      </div>
    </>
  );
};

export default MainLayout
