import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Person } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  Camera,
  User,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Person[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Person | null>(null);

  const { hasPermission } = useAuth();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filterStatus]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getAllPersons();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone?.includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(emp =>
        filterStatus === 'active' ? emp.status === 1 : emp.status === 0
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployees(prev =>
      prev.includes(id)
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleDeleteEmployee = async (employee: Person) => {
    try {
      await apiService.deletePerson(employee.id);
      await loadEmployees();
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Không thể xóa nhân viên');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Không hoạt động
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Quản lý nhân viên
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin nhân viên và phân quyền truy cập
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={loadEmployees}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </button>
          {hasPermission('employees.create') && (
            <Link
              to="/employees/create"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhân viên
            </Link>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div className="sm:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã NV, email, hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {filteredEmployees.length} trong số {employees.length} nhân viên
          </div>
          {selectedEmployees.length > 0 && (
            <div className="text-sm text-gray-700">
              Đã chọn {selectedEmployees.length} nhân viên
            </div>
          )}
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có nhân viên</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Không tìm thấy nhân viên phù hợp với bộ lọc'
                : 'Chưa có nhân viên nào trong hệ thống'}
            </p>
            {hasPermission('employees.create') && !searchTerm && filterStatus === 'all' && (
              <div className="mt-6">
                <Link
                  to="/employees/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm nhân viên đầu tiên
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === filteredEmployees.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Chọn tất cả
                </span>
              </div>
            </div>

            {/* Employee Items */}
            <ul className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <li key={employee.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleSelectEmployee(employee.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    
                    {/* Avatar */}
                    <div className="ml-4 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {employee.avatar_url ? (
                          <img
                            src={`/avatar/${employee.avatar_url}`}
                            alt={employee.fullname}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="ml-4 flex-1">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
                        <div className="sm:col-span-2">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {employee.fullname}
                            </p>
                            {getStatusBadge(employee.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Mã NV: {employee.code}
                          </p>
                          {employee.position && (
                            <p className="text-sm text-gray-500">
                              {employee.position}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          {employee.email && (
                            <p className="text-sm text-gray-900">{employee.email}</p>
                          )}
                          {employee.phone && (
                            <p className="text-sm text-gray-500">{employee.phone}</p>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <p>Tạo: {formatDate(employee.created_at)}</p>
                          {employee.birth && (
                            <p>Sinh: {formatDate(employee.birth)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      <Link
                        to={`/employees/${employee.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      {hasPermission('employees.update') && (
                        <>
                          <Link
                            to={`/employees/${employee.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          
                          <Link
                            to={`/employees/${employee.id}/face`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Quản lý khuôn mặt"
                          >
                            <Camera className="h-4 w-4" />
                          </Link>
                          
                          <Link
                            to={`/employees/${employee.id}/avatar`}
                            className="text-purple-600 hover:text-purple-900"
                            title="Tải lên avatar"
                          >
                            <Upload className="h-4 w-4" />
                          </Link>
                        </>
                      )}
                      
                      {hasPermission('employees.delete') && (
                        <button
                          onClick={() => {
                            setEmployeeToDelete(employee);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Xóa nhân viên
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa nhân viên{' '}
                  <span className="font-medium">{employeeToDelete.fullname}</span>?
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteEmployee(employeeToDelete)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700"
                >
                  Xóa
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEmployeeToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;