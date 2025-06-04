import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Detail.css';
import {
  Phone,
  IdCard,
  User,
  BookOpen,
  Calendar,
  Images,
  ArrowLeft,
  UserRound
} from 'lucide-react';
import Profile from "../../components/Profile/Profile";
import ImageGallery from '@renderer/components/ImageGallery/ImageGallery';
import PersonalTimekeepingHistory from '../../components/PersonalTimekeeping/PersonalTimekeepingHistory';
import LeaveManagement from '@renderer/components/LeaveManagement/LeaveManagement';
import { SERVER_URL } from '@renderer/Api';
import Leave from '@renderer/components/Leave/Leave';
import PersonalStas from '@renderer/components/PersonalStas/PersonalStas';

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
              src={`${SERVER_URL}/avatar/${person.avatarPath}`}
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
            <div className="person-name">
              {person.fullname}
            </div>
            <div className="person-detail">
              <IdCard size={18} />
              {person.code}
            </div>
            <div className="person-detail">
              <UserRound size={18} />
              {person.position}
            </div>
          </div>
        </div>
        {/* <Button>
          Liên hệ
        </Button> */}
      </div>

      <div className="detail-container">
        <div className="side-nav">
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <User size={20} />
            <span>Thông tin cá nhân</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => handleNavClick('images')}
          >
            <Images size={20} />
            <span>Ảnh nhận diện</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => handleNavClick('education')}
          >
            <BookOpen size={20} />
            <span>Hồ sơ học vấn</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => handleNavClick('attendance')}
          >
            <Calendar size={20} />
            <span>Hồ sơ chấm công</span>
          </button>
          {/* <button
            className={`nav-item ${activeTab === 'leave' ? 'active' : ''}`}
            onClick={() => handleNavClick('leave')}
          >
            <Calendar size={20} />
            <span>Quản lý ngày nghỉ</span>
          </button> */}
          <button
            className={`nav-item ${activeTab === 'stas' ? 'active' : ''}`}
            onClick={() => handleNavClick('stas')}
          >
            <BookOpen size={20} />
            <span>Thống kê chấm công</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'back' ? 'active' : ''}`}
            onClick={() => handleNavClick('back')}
          >
            <ArrowLeft size={20} />
            <span>Quay lại danh sách</span>
          </button>
        </div>

        {/* Main Content */}
        <div className='profile-content'>
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'images' && <ImageGallery personId={person.id} code={person.code} />}
          {activeTab === 'education' && <h2>Chức năng đang được phát triển</h2>}
          {activeTab === 'attendance' && <PersonalTimekeepingHistory personId={person.id} />}
          {/* {activeTab === 'leave' && <LeaveManagement personId={person.id} />} */}
          {activeTab === 'stas' && <PersonalStas personId={person.id} />}

        </div>
      </div>
    </div>
  );
};

export default Detail;