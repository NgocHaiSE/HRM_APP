import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../components/Button/Button';
import EditIcon from '@mui/icons-material/Edit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Profile.css';

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
  const { person } = location.state as { person: Person } || {};
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Person>({
    id: person.id,
    fullname: person?.fullname || '',
    code: person?.code || '',
    birth: person?.birth || new Date(),
    gender: person?.gender || '',
    phone: person?.phone || '',
    address: person?.address || '',
    createTime: person?.createTime || '',
    avatarPath: person?.avatarPath || '',
    email: person?.email || ' ',
    provine: person?.provine || ' ',
    position: person?.position || '',
    rank: person?.rank || '',
    department: person?.department || ''
  });

  useEffect(() => {
    if (!person) {
      console.warn('No person data found in location.state');
    }
  }, [person]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedValues((prev) => ({
      ...prev,
      [name]:
        name === 'birth'
          ? new Date(value)
          : value,
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
      const genderValue =
        editedValues.gender === 'Nam'
          ? 1
          : editedValues.gender === 'Nữ'
            ? 0
            : null;

      const birthValue = editedValues.birth
        ? editedValues.birth.toLocaleDateString('en-CA')
        : null;

      // Kiểm tra phone: phải là 10 chữ số
      const phoneValue = editedValues.phone || null;
      if (phoneValue && !/^\d{10}$/.test(phoneValue)) {
        throw new Error('Số điện thoại phải có đúng 10 chữ số');
      }

      // Kiểm tra id
      if (!editedValues.id || editedValues.id <= 0) {
        throw new Error('ID nhân viên không hợp lệ');
      }

      // Log tham số trước khi gọi
      console.log('Params for adjustPerson:', {
        id: editedValues.id,
        fullname: editedValues.fullname || null,
        birth: birthValue,
        gender: genderValue,
        phone: phoneValue,
        address: editedValues.address || null,
        email: editedValues.email || null,
      });

      await window.db.adjustPerson(
        person.id,
        editedValues.fullname || null,
        birthValue,
        genderValue,
        phoneValue,
        editedValues.address || null,
        editedValues.email || null
      );

      console.log('Saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Lỗi khi cập nhật thông tin: ' + error);
    }
  };

  const handleCancelClick = () => {
    setEditedValues({
      id: person?.id || 0,
      fullname: person?.fullname || '',
      code: person?.code || '',
      birth: person?.birth || new Date(),
      gender: person?.gender || '',
      phone: person?.phone || '',
      address: person?.address || '',
      createTime: person?.createTime || '',
      avatarPath: person?.avatarPath || '',
      email: person?.email || ' ',
      provine: person?.provine || ' ',
      position: person?.position || '',
      rank: person?.rank || '',
      department: person?.department || ''
    });
    setIsEditing(false);
  };

  if (!person) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div className="profile-container">
        <h2 className="profile-title">Thông tin cá nhân</h2>
        <div className="profile-grid">
          <div className="profile-item">
            <label>Họ tên</label>
            {isEditing ? (
              <input
                type="text"
                name="fullname"
                value={editedValues.fullname}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.fullname || 'Chưa cập nhật'}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Mã nhân viên</label>
            {isEditing ? (
              <input
                type="text"
                name="code"
                value={editedValues.code}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.code || 'Chưa cập nhật'}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Giới tính</label>
            {isEditing ? (
              <select
                name="gender"
                value={editedValues.gender}
                onChange={handleInputChange}
                className="edit-input"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            ) : (
              <span>{person.gender || 'Chưa cập nhật'}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Ngày sinh</label>
            {isEditing ? (
              <DatePicker
                selected={editedValues.birth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="edit-input"
                placeholderText="dd/mm/yyyy"
              />
            ) : (
              <span>{person.birth ? formatToDMY(person.birth) : 'Chưa cập nhật'}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Số điện thoại</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editedValues.phone}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.phone || 'Chưa cập nhật'}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Email</label>
            {isEditing ? (
              <input
                type="text"
                name="email"
                value={editedValues.email || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.email == " " ? 'Chưa cập nhật' : person.email}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Chức vụ</label>
            {isEditing ? (
              <input
                type="text"
                name="position"
                value={editedValues.position || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.position == "" ? 'Chưa cập nhật' : person.position}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Cấp bậc</label>
            {isEditing ? (
              <input
                type="text"
                name="rank"
                value={editedValues.rank || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.rank == "" ? 'Chưa cập nhật' : person.rank}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Phòng ban</label>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={editedValues.department || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.department == "" ? 'Chưa cập nhật' : person.department}</span>
            )}
          </div>
          <div className="profile-item">
            <label>Địa chỉ</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editedValues.address}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>{person.address || 'Chưa cập nhật'}</span>
            )}
          </div>
        </div>
      </div>
      {isEditing ? (
        <div className="button-group">
          <Button style={{ width: '80px' }} onClick={handleSaveClick}>
            Lưu
          </Button>
          <Button className="cancel-button" onClick={handleCancelClick}>
            Hủy
          </Button>
        </div>
      ) : (
        <Button className="edit-button" onClick={handleEditClick}>
          <EditIcon fontSize="small" />
          Chỉnh sửa
        </Button>
      )}
    </>
  );
};

export default Profile; 