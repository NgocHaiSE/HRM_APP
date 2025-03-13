import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./MainLayout.css"

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <div className="layout">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="header">
          <Header />
        </div>
        <div className="content">{children}</div> 
      </div>
    </>
  );
};

export default MainLayout
