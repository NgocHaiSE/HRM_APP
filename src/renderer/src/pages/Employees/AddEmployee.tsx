import React, { useState, useRef } from 'react';
import { Camera, User, Mail, Phone, MapPin, Calendar, Users, Award, Building, ChevronRight, ChevronLeft } from 'lucide-react';
import './AddEmployee.css';
import { SERVER_URL } from '@renderer/Api';

export const FormField = ({ icon: Icon, label, children, required = false }) => (
  <div className="form-field">
    <label className="form-label">
      <Icon size={16} className="form-label-icon" />
      {label}
      {required && <span className="form-required">*</span>}
    </label>
    {children}
  </div>
);

export const Input = ({ type = "text", value, onChange, placeholder }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="form-input"
  />
);

const Select = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    className="form-input"
  >
    {children}
  </select>
);

const Button = ({ variant = "primary", onClick, disabled, children, style = {} }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn ${variant}`}
    style={style}
  >
    {children}
  </button>
);



const AddEmployee = () => {
  // Form state
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [fullname, setFullname] = useState('');
  const [code, setCode] = useState('');
  const [gender, setGender] = useState(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [rank, setRank] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const departmentsList = [
    { id: 1, name: 'Phòng IT' },
    { id: 2, name: 'Phòng Kế toán' },
    { id: 3, name: 'Phòng Nhân sự' },
    { id: 4, name: 'Phòng Kinh doanh' },
    { id: 5, name: 'Phòng Sản xuất' }
  ];

  // State
  const [departmentId, setDepartmentId] = useState<number | ''>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setAvatar(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return fullname.trim() && code.trim();
      case 2:
        return phone.trim() || email.trim();
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const uploadAvatar = async (): Promise<boolean> => {
    if (!avatarFile) return true; // Skip if no avatar

    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('code', code);

      const response = await fetch(`${SERVER_URL}/api/person/avatar/upload`, {
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
    try {
      setIsSubmitting(true);
      const genderBit = gender === 1 ? 1 : 0;
      // First add the employee to the database
      const result = await window.db.addPerson(
        code,
        fullname,
        genderBit,
        birthDate,
        phone,
        address,
        email,
        position,
        departmentId
        // avatarFile?.name || ''
      );

      if (result) {
        const avatarResult = await uploadAvatar();

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
    setBirthDate('');
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
    setCurrentStep(1);
  };





  const StepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`step-circle${currentStep >= step ? ' active' : ''}`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`step-line${currentStep > step ? ' active' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="step-header">
              <h3 className="step-title">Thông tin cơ bản</h3>
              <p className="step-desc">Nhập thông tin cá nhân của nhân viên</p>
            </div>
            <div className="avatar-section">
              <div className="avatar-container" onClick={handleUploadAvatar}>
                {avatar ? (
                  <img
                    src={typeof avatar === 'string' ? avatar : undefined}
                    alt="Avatar"
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <Camera size={32} color="#6B7280" />
                    <p className="avatar-text">Tải ảnh lên</p>
                  </div>
                )}
                <div className="avatar-overlay">
                  <Camera size={20} color="white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="form-grid">
              <FormField icon={User} label="Họ tên" required>
                <Input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </FormField>
              <FormField icon={Award} label="Mã nhân viên" required>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã nhân viên"
                />
              </FormField>
              <FormField icon={Calendar} label="Ngày sinh">
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)} placeholder={undefined} />
              </FormField>
              <FormField icon={User} label="Giới tính">
                <Select
                  value={gender}
                  onChange={(e) => setGender(parseInt(e.target.value))}
                >
                  <option value={1}>Nam</option>
                  <option value={0}>Nữ</option>
                </Select>
              </FormField>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="step-header">
              <h3 className="step-title">Thông tin liên hệ</h3>
              <p className="step-desc">Nhập thông tin liên lạc của nhân viên</p>
            </div>
            <div className="form-grid">
              <FormField icon={Phone} label="Số điện thoại" required>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </FormField>
              <FormField icon={Mail} label="Email" required>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email"
                />
              </FormField>
              <FormField icon={MapPin} label="Địa chỉ">
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ"
                />
              </FormField>
              <FormField icon={MapPin} label="Tỉnh/Thành phố">
                <Input
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Nhập tỉnh/thành phố"
                />
              </FormField>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="step-header">
              <h3 className="step-title">Thông tin công việc</h3>
              <p className="step-desc">Nhập thông tin về vị trí và phòng ban</p>
            </div>
            <div className="form-grid">
              <FormField icon={Award} label="Chức vụ">
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Nhập chức vụ"
                />
              </FormField>
              <FormField icon={Users} label="Cấp bậc">
                <Input
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="Nhập cấp bậc"
                />
              </FormField>
              <FormField icon={Building} label="Phòng ban">
                <Select
                  value={departmentId}
                  onChange={e => setDepartmentId(Number(e.target.value))}
                >
                  <option value="">Chọn phòng ban</option>
                  {departmentsList.map(dep => (
                    <option key={dep.id} value={dep.id}>{dep.name}</option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="add-employee-container">
      <div className="add-employee-header">
        <h1 className="add-employee-title">Thêm nhân viên mới</h1>
        <p className="add-employee-subtitle">Điền thông tin để thêm nhân viên vào hệ thống</p>
      </div>
      <StepIndicator />
      <div style={{ minHeight: '400px' }}>
        {renderStep()}
      </div>
      <div className="add-employee-navigation">
        <div>
          {currentStep > 1 && (
            <Button onClick={handlePrev} disabled={undefined}>
              <ChevronLeft size={16} />
              Quay lại
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={resetForm} disabled={undefined}>
            Hủy bỏ
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={undefined}>
              Tiếp theo
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleAddClick} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
