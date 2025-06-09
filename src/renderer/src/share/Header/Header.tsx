import "./Header.css";
// import notification_icon from "../../assets/icon/notification-03-1.svg"
// import setting_icon from "../../assets/icon/setting-03-1.svg"
// import mail_icon from "../../assets/icon/envelope.png"

const Header = (/*{ userName, profileImage } : userProps */) => {
  return (
    <div className="header">
      <div className="header-left">
        Xin chào, 
      </div>
      <div className="header-right">
        {/* <img src={notification_icon} alt="notification_icon" className="icon"/> */}
        {/* <img src={mail_icon} alt="mail_icon" className="icon"/> */}
        {/* <img src={setting_icon} alt="setting_icon" className="icon"/> */}
        <div className="profile">
        </div>
      </div>
    </div>   
  );
};

export default Header;
