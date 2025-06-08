import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  MapPin,
  Edit3,
  X,
  Badge,
  UserCircle,
  Save,
  AlertCircle
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Profile.css';
import Button from '@renderer/components/Button/Button';
import { SERVER_URL } from '@renderer/Api';

const formatToDMY = (date: Date | string): string => {
  if (!date || date === 'Chưa cập nhật') return 'Chưa cập nhật';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return 'Chưa cập nhật';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const Profile: React.FC = () => {
  const location = useLocation();
  const { person } = (location.state as { person: Person }) || {};

  const [personData, setPersonData] = useState<Person>({
    id: person?.id || 0,
    fullname: person?.fullname || '',
    code: person?.code || '',
    birth: person?.birth ? new Date(person.birth) : new Date(),
    gender: person?.gender || '',
    phone: person?.phone || '',
    address: person?.address || '',
    createTime: person?.createTime || '',
    avatarPath: person?.avatarPath || '',
    email: person?.email || '',
    provine: person?.provine || '',
    position: person?.position || '',
    department: person?.department || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Person>({ ...personData });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (person) {
      const updatedData = {
        ...person,
        birth: person.birth ? new Date(person.birth) : new Date(),
      };
      setPersonData(updatedData);
      setEditedValues(updatedData);
    }
  }, [person]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedValues((prev) => ({
      ...prev,
      [name]: name === 'birth' ? new Date(value) : value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setEditedValues((prev) => ({
      ...prev,
      birth: date || new Date(),
    }));
  };

  const handleSaveClick = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Simulate API call - replace with actual implementation
      // await new Promise(resolve => setTimeout(resolve, 1000));
      await window.db.adjustPerson(
        editedValues.id,
        editedValues.fullname,
        editedValues.gender,
        editedValues.birth ? editedValues.birth.toISOString().slice(0, 10) : null,
        editedValues.phone,
        editedValues.address,
        editedValues.email,
        editedValues.position,
        editedValues.department // Thêm giá trị phòng ban
      )
      setPersonData({ ...editedValues });
      setIsEditing(false);
    } catch (error) {
      setError('Lỗi khi lưu thông tin! Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setEditedValues({ ...personData });
    setIsEditing(false);
    setError(null);
  };

  const displayValue = (value: string | undefined | null): string => {
    return value?.trim() ? value : 'Chưa cập nhật';
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Content Section */}
        <div className="profile-content">
          <div className="profile-section">
            <div className="section-title section-title-flex">
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserCircle size={30} />
                Thông tin cá nhân
              </span>

              {/* Action buttons */}
              <div className="profile-actions-row">
                {!isEditing ? (
                  <Button onClick={handleEditClick}>
                    <Edit3 size={18} />
                    <span>Chỉnh sửa</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveClick}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="spinner" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Lưu</span>
                        </>
                      )}
                    </Button>
                    <Button
                      className="cancel-btn"
                      onClick={handleCancelClick}
                      disabled={isSaving}
                    >
                      <X size={18} />
                      <span>Hủy</span>
                    </Button>
                  </>
                )}
              </div>
            </div>


            <div className="profile-grid">
              <div className="profile-field">
                <div className="field-header">
                  <User size={16} />
                  <label>Họ và tên</label>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={editedValues.fullname}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <div className="field-value">{displayValue(personData.fullname)}</div>
                )}
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <Badge size={16} />
                  <label>Giới tính</label>
                </div>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editedValues.gender}
                    onChange={handleInputChange}
                    className="field-select"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                ) : (
                  <div className="field-value">{displayValue(personData.gender)}</div>
                )}
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <Calendar size={16} />
                  <label>Ngày sinh</label>
                </div>
                {isEditing ? (
                  <DatePicker
                    selected={editedValues.birth}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="field-input date-picker"
                    placeholderText="dd/mm/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                ) : (
                  <div className="field-value">
                    {personData.birth ? formatToDMY(personData.birth) : 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <Phone size={16} />
                  <label>Số điện thoại</label>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedValues.phone}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div className="field-value phone-value">
                    {displayValue(personData.phone)}
                  </div>
                )}
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <Mail size={16} />
                  <label>Email</label>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedValues.email}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Nhập địa chỉ email"
                  />
                ) : (
                  <div className="field-value email-value">
                    {displayValue(personData.email)}
                  </div>
                )}
              </div>

              <div className="profile-field full-width">
                <div className="field-header">
                  <MapPin size={16} />
                  <label>Địa chỉ</label>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedValues.address}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <div className="field-value">{displayValue(personData.address)}</div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">
              <Building2 size={20} />
              Thông tin công việc
            </h3>

            <div className="profile-grid">
              <div className="profile-field">
                <div className="field-header">
                  <Badge size={16} />
                  <label>Chức vụ</label>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="position"
                    value={editedValues.position}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Nhập chức vụ"
                  />
                ) : (
                  <div className="field-value">{displayValue(personData.position)}</div>
                )}
              </div>

              <div className="profile-field">
                <div className="field-header">
                  <Building2 size={16} />
                  <label>Phòng ban</label>
                </div>
                {isEditing ? (
                  <select
                    name="department"
                    value={editedValues.department}
                    onChange={handleInputChange}
                    className="field-input"
                  >
                    <option value="">Chọn phòng ban</option>
                    <option value="3">Phòng IT</option>
                    <option value="1">Phòng Kế toán</option>
                    <option value="2">Phòng Nhân sự</option>
                    <option value="4">Phòng Kinh doanh</option>
                    <option value="5">Phòng Sản xuất</option>
                  </select>
                ) : (
                  <div className="field-value">{displayValue(personData.department)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;