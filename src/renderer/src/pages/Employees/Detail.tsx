import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Detail.css';
import Button from "../../components/Button/Button"
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined';
import PersonIcon from '@mui/icons-material/Person'
import { LocalLibraryOutlined, CalendarMonthOutlined, CollectionsOutlined, ArrowBackOutlined } from '@mui/icons-material';
import Profile from "../../components/Profile/Profile";
import ImageGallery from '@renderer/components/ImageGallery/ImageGallery';
import Attendance from '../../components/Attendance/Attendance';

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { person, page } = location.state || { person: null, page: 0 };
  const [activeTab, setActiveTab] = useState('profile');

  if (!person) {
    return <div>No data available</div>;
  }

  const handleNavClick = (tab: string) => {
    if (tab === 'back') {
      navigate('/employees/manage', { state: { page } });
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className='container'>
      <div className='header-top'>
        <div className='info-top'>
          {person.avatarPath ? (
            <img
              src={`http://localhost:8000/avatar/${person.avatarPath}`}
              alt={`${person.fullname}'s avatar`}
              className="avatar-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              {person.fullname.charAt(0)}
            </div>
          )}
          <div className='info'>
            <div style={{ fontSize: '20px', fontWeight: 'bolder', paddingBottom: '10px' }}>
              {person.fullname}
            </div>
            <div style={{ alignItems: 'center', display: 'flex', gap: '8px', fontSize: '16px' }}>
              <ContactEmergencyOutlinedIcon />
              {person.code}
            </div>
            <div style={{ alignItems: 'center', display: 'flex', gap: '8px', fontSize: '16px' }}>
              <PhoneOutlinedIcon />
              {person.phone}
            </div>
          </div>
        </div>
        <Button style={{ backgroundColor: '#534FEB', borderRadius: '10px' }}>
          Liên hệ
        </Button>
      </div>

      <div className="detail-container">
        <div className="side-nav">
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleNavClick('profile')}>
            <PersonIcon /> Thông tin cá nhân
          </button>
          <button className={`nav-item ${activeTab === 'images' ? 'active' : ''}`} onClick={() => handleNavClick('images')}>
            <CollectionsOutlined /> Ảnh nhận diện
          </button>
          <button className={`nav-item ${activeTab === 'education' ? 'active' : ''}`} onClick={() => handleNavClick('education')}>
            <LocalLibraryOutlined /> Hồ sơ học vấn
          </button>
          <button className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => handleNavClick('attendance')}>
            <CalendarMonthOutlined /> Hồ sơ chấm công
          </button>
          <button className={`nav-item ${activeTab === 'back' ? 'active' : ''}`} onClick={() => handleNavClick('back')}>
            <ArrowBackOutlined /> Quay lại danh sách
          </button>
        </div>

        {/* Main Content */}
        <div className='profile-content'>
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'images' && <ImageGallery personId={person.id} code={person.code}/>}
          {activeTab === 'education' && <h2>Chức năng đang được phát triển</h2>}
          {activeTab === 'attendance' && <Attendance />}
        </div>
      </div>
    </div>
  );
};

export default Detail;
