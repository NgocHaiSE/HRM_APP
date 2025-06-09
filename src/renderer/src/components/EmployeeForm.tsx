import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService, Person } from '../services/api';
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Building
} from 'lucide-react';

interface Department {
  id: number;
  name: string;
}

interface EmployeeFormData {
  code: string;
  fullname: string;
  gender: number;
  birth: string;
  phone: string;
  address: string;
  email: string;
  position: string;
  department_id: number | null;
}

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<EmployeeFormData>({
    code: '',
    fullname: '',
    gender: 1,
    birth: '',
    phone: '',
    address: '',
    email: '',
    position: '',
    department_id: null,
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadDepartments();
    if (isEdit) {
      loadEmployee();
    }
  }, [id, isEdit]);

  const loadDepartments = async () => {
    try {
      const data = await apiService.getAllPersons(); // This should be a separate department API
      // For now, we'll use a mock list since the API doesn't have departments endpoint
      setDepartments([
        { id: 1, name: 'Phòng IT' },
        { id: 2, name: 'Phòng Nhân sự' },
        { id: 3, name: 'Phòng Kế toán' },
        { id: 4, name: 'Phòng Kinh doanh' },
        { id: 5, name: 'Phòng Marketing' },
      ]);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadEmployee = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const employee = await apiService.getPerson(parseInt(id));
      setFormData({
        code: employee.code,
        fullname: employee.fullname,
        gender: employee.gender,
        birth: employee.birth || '',
        phone: employee.phone || '',
        address: employee.address || '',
        email: employee.email || '',
        position: employee.position || '',
        department_id: employee.department_id || null,
      });
    } catch (error) {
      console.error('Error loading employee:', error);
      setSubmitError('Không thể tải thông tin nhân viên');
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Mã nhân viên là bắt buộc';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Mã nhân viên phải có ít nhất 3 ký tự';
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Họ tên là bắt buộc';
    } else if (formData.fullname.length < 2) {
      newErrors.fullname = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (formData.birth) {
      const birthDate = new Date(formData.birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 70) {
        newErrors.birth = 'Tuổi phải từ 16 đến 70';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');

      // Prepare data for submission
      const submitData = {
        ...formData,
        department_id: formData.department_id || undefined,
      };

      if (isEdit && id) {
        await apiService.updatePerson(parseInt(id), submitData);
      } else {
        await apiService.createPerson(submitData);
      }

      navigate('/employees');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(apiService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EmployeeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/employees')}
            className="mr-3 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h1>
        </div>
        <p className="text-gray-600">
          {isEdit
            ? 'Cập nhật thông tin nhân viên trong hệ thống'
            : 'Tạo hồ sơ nhân viên mới trong hệ thống'}
        </p>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">{submitError}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Thông tin cơ bản
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Employee Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Mã nhân viên *
              </label>
              <input
                type="text"
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                disabled={isEdit} // Don't allow changing employee code in edit mode
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.code
                    ? 'border-red-300 text-red-900 placeholder-red-300'
                    : 'border-gray-300'
                } ${isEdit ? 'bg-gray-50 text-gray-500' : ''}`}
                placeholder="Nhập mã nhân viên"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.fullname
                    ? 'border-red-300 text-red-900 placeholder-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Nhập họ và tên"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={1}>Nam</option>
                <option value={0}>Nữ</option>
              </select>
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birth" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Ngày sinh
              </label>
              <input
                type="date"
                id="birth"
                value={formData.birth}
                onChange={(e) => handleInputChange('birth', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.birth
                    ? 'border-red-300 text-red-900'
                    : 'border-gray-300'
                }`}
              />
              {errors.birth && (
                <p className="mt-1 text-sm text-red-600">{errors.birth}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.email
                    ? 'border-red-300 text-red-900 placeholder-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Nhập địa chỉ email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.phone
                    ? 'border-red-300 text-red-900 placeholder-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Địa chỉ
            </label>
            <textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Thông tin công việc
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Chức vụ
              </label>
              <input
                type="text"
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập chức vụ"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline h-4 w-4 mr-1" />
                Phòng ban
              </label>
              <select
                id="department_id"
                value={formData.department_id || ''}
                onChange={(e) => handleInputChange('department_id', e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Chọn phòng ban</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;