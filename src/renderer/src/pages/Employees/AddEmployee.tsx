import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddEmployee.css';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Button from '@renderer/components/Button/Button';

const AddEmployee = () => {
  // Form state
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Store the actual file
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [fullname, setFullname] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [gender, setGender] = useState<number>(1); // 1 for Nam, 0 for Nữ
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [rank, setRank] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [province, setProvince] = useState<string>('');

  const Base_URL = 'http://localhost:8000'; // Base URL for avatar upload
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the file for later upload
      setAvatarFile(file);
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setAvatar(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setBirthDate(date);
  };

  // This handler allows for manual text input in the date field
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only try to parse if we have a complete date pattern
    if (/\d{2}\/\d{2}\/\d{4}/.test(value)) {
      const [day, month, year] = value.split('/').map(Number);
      // JavaScript months are 0-indexed
      const parsedDate = new Date(year, month - 1, day);
      
      // Validate the date is real (e.g., not 31/02/2023)
      if (
        parsedDate.getDate() === day &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getFullYear() === year &&
        parsedDate <= new Date() // Ensure date is not in future
      ) {
        setBirthDate(parsedDate);
      }
    }
  };

  const validateForm = (): boolean => {
    // Add validation logic as needed
    if (!fullname.trim()) {
      alert('Vui lòng nhập họ tên');
      return false;
    }
    if (!code.trim()) {
      alert('Vui lòng nhập mã nhân viên');
      return false;
    }
    // Add more validation as needed
    return true;
  };

  const uploadAvatar = async (code: string): Promise<boolean> => {
    if (!avatarFile) return true; // Skip if no avatar
    
    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      
      const response = await fetch(`${Base_URL}/upload-avatar/${code}`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Avatar upload failed:', errorText);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return false;
    }
  };

  const handleAddClick = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Make sure gender is exactly 0 or 1 as a number
      const genderBit = gender === 1 ? 1 : 0;
      
      console.log('Sending data to database:', {
        code,
        fullname,
        birthDate: birthDate?.toISOString(),
        gender: genderBit,
        // Other fields...
      });
      
      // First add the employee to the database
      const result = await window.db.addPerson(
        code, 
        fullname,
        birthDate,
        genderBit, // Ensure it's exactly 0 or 1
        phone,
        address,
        email,
        position,
        rank,
        department,
        province
      );
      
      // If employee was added successfully, upload the avatar if exists
      if (result) {
        const avatarResult = await uploadAvatar(code);
        
        if (avatarResult) {
          alert('Thêm nhân viên thành công!');
          resetForm();
        } else {
          alert('Thêm nhân viên thành công nhưng không thể tải lên ảnh đại diện.');
        }
      } else {
        alert('Có lỗi xảy ra khi thêm nhân viên.');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      if (error instanceof Error) {
        alert(`Lỗi: ${error.message || 'Không thể thêm nhân viên'}`);
      } else {
        alert('Lỗi: Không thể thêm nhân viên');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFullname('');
    setCode('');
    setBirthDate(null);
    setGender(1);
    setPhone('');
    setEmail('');
    setPosition('');
    setRank('');
    setDepartment('');
    setAddress('');
    setProvince('');
    setAvatar(null);
    setAvatarFile(null);
  };
  
  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy? Tất cả thông tin sẽ bị mất.')) {
      resetForm();
      // Navigate back or close form as needed
    }
  };

  return (
    <div className="container-add">
      <div className="title-add">Thêm nhân viên mới</div>
      <div className='avatar-container' onClick={handleUploadAvatar}>
        {avatar ? (
          <div className='upload-avatar' style={{ overflow: 'hidden' }}>
            <img 
              src={avatar} 
              alt="Avatar" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
          </div>
        ) : (
          <div className='upload-avatar'>
            <CameraAltOutlinedIcon style={{ color: 'rgba(45, 45, 45, 0.7)' }} />
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      <div className='grid-container'>
        <div className="grid">
          <div className="grid-item">
            <label>Họ tên</label>
            <input 
              type="text" 
              name="fullname" 
              className="edit-input" 
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="grid-item">
            <label>Mã nhân viên</label>
            <input 
              type="text" 
              name="code" 
              className="edit-input" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="grid-item">
            <label>Ngày sinh</label>
            <DatePicker
              selected={birthDate}
              onChange={handleDateChange}
              onChangeRaw={(e) => handleDateInput(e as unknown as React.ChangeEvent<HTMLInputElement>)}
              dateFormat="dd/MM/yyyy"
              className="edit-input"
              placeholderText="dd/mm/yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              maxDate={new Date()}
              isClearable
              allowSameDay={true}
            />
          </div>
          <div className="grid-item">
            <label>Giới tính</label>
            <select 
              name="gender" 
              className="edit-input"
              value={gender}
              onChange={(e) => setGender(parseInt(e.target.value))}
            >
              <option value={1}>Nam</option>
              <option value={0}>Nữ</option>
            </select>
          </div>
          <div className="grid-item">
            <label>Số điện thoại</label>
            <input 
              type="text" 
              name="phone" 
              className="edit-input" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid-item">
            <label>Email</label>
            <input 
              type="text" 
              name="email" 
              className="edit-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid-item">
            <label>Chức vụ</label>
            <input 
              type="text" 
              name="position" 
              className="edit-input" 
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="grid-item">
            <label>Cấp bậc</label>
            <input 
              type="text" 
              name="rank" 
              className="edit-input" 
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            />
          </div>
          <div className="grid-item">
            <label>Phòng ban</label>
            <input 
              type="text" 
              name="department" 
              className="edit-input" 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="grid-item">
            <label>Địa chỉ</label>
            <input 
              type="text" 
              name="address" 
              className="edit-input" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='add-footer'>
        <Button 
          className='btn-add' 
          onClick={handleAddClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang thêm...' : 'Thêm'}
        </Button>
        <Button 
          className='btn-cancel'
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default AddEmployee;