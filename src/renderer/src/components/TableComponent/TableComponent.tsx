import React, { useEffect, useState } from 'react';
import {
  Search, Plus, Download, Edit, Trash2, MoreVertical, Users,
  Phone, MapPin, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SERVER_URL } from '@renderer/Api';
import './TableComponent.css'; // Import file CSS
import Button from '../Button/Button'

const departments = ['Tất cả', 'Phòng IT', 'Phòng Nhân sự', 'Phòng Kinh doanh', 'Phòng Kế toán', 'Phòng Sản xuất'];

const getDepartmentColor = (department: string) => {
  const colors: { [key: string]: string } = {
    'Phòng IT': '#3b82f6',
    'Phòng Nhân sự': '#10b981',
    'Phòng Kinh doanh': '#f59e0b',
    'Phòng Kế toán': '#8b5cf6',
    'Phòng Sản xuất': '#ef4444'
  };
  return colors[department] || '#6b7280';
};

function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const TableComponent = () => {
  const location = useLocation();
  const [list, setList] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Tất cả');
  const [page, setPage] = useState<number>(location.state?.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Person | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const navigate = useNavigate()

  const handleAddClick = () => {
    navigate(`/employee/add`);
  }

  useEffect(() => {
    window.db.getPersonList()
      .then((persons: Person[]) => {
        setList(persons);
        const maxPage = Math.max(0, Math.floor((persons.length - 1) / rowsPerPage));
        if (page > maxPage) {
          setPage(maxPage);
        }
      })
      .catch((error) => {
        console.error('Error fetching person list:', error);
      });
  }, []);

  const normalizedSearch = removeVietnameseTones(searchTerm.toLowerCase());

  const filteredEmployees = list.filter(emp => {
    const fullname = removeVietnameseTones(emp.fullname?.toLowerCase() || '');
    const code = emp.code?.toLowerCase() || '';
    const department = removeVietnameseTones(emp.department?.toLowerCase() || '');
    const phone = emp.phone || '';
    const matchesSearch =
      fullname.includes(normalizedSearch) ||
      code.includes(normalizedSearch) ||
      department.includes(normalizedSearch) ||
      phone.includes(normalizedSearch);
    const matchesDepartment =
      selectedDepartment === 'Tất cả' || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDetailClick = (person: Person) => {
    navigate(`/detail`, { state: { person, page } });
  }

  return (
    <div className="table-container">
      {/* Header */}
      <div className="table-header">
        <h1 className="table-title">Quản lý nhân viên</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card11">
          <div className="stat-content">
            <Users size={24} />
            <div>
              <h3 className="stat-number">{list.length}</h3>
              <p className="stat-label11">Tổng nhân viên</p>
            </div>
          </div>
        </div>
        <div className="stat-card12">
          <div className="stat-content">
            <Filter size={24} />
            <div>
              <h3 className="stat-number">{filteredEmployees.length}</h3>
              <p className="stat-label11">Đang hiển thị</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="card">
        <div className="card-content">
          <div className="search-container">
            <div className="search-input-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ borderColor: searchTerm ? '#667eea' : '#e2e8f0' }}
              />
            </div>
            <div className="dropdown">
              <button
                className="table-button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <Filter size={16} />
                {selectedDepartment}
              </button>
              {showFilterMenu && (
                <div className="dropdown-menu">
                  {departments.map((dept) => (
                    <div
                      key={dept}
                      className="dropdown-item"
                      style={{
                        backgroundColor: selectedDepartment === dept ? '#f1f5f9' : 'transparent'
                      }}
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setShowFilterMenu(false);
                        setPage(0);
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = selectedDepartment === dept ? '#f1f5f9' : 'transparent';
                      }}
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="table-button">
              <Download size={16} />
              Xuất Excel
            </button>
            <Button onClick={handleAddClick}>
              <Plus size={16} />
              Thêm nhân viên
            </Button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card">
        <table className="table-table">
          <thead className="table-header-row">
            <tr>
              <th className="table-th">Nhân viên</th>
              <th className="table-th">Mã NV</th>
              <th className="table-th">Phòng ban</th>
              <th className="table-th">Liên hệ</th>
              <th className="table-th">Địa chỉ</th>
              <th className="table-th" style={{ textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee, index) => (
              <tr
                key={employee.id}
                style={{
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td className="table-td">
                  <div className="employee-info">
                    <div className="employee-avatar" style={{ padding: 0 }}>
                      {employee.avatarPath ? (
                        <img
                          src={`${SERVER_URL}/avatar/${employee.avatarPath}`}
                          alt={`${employee.fullname}'s avatar`}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          {employee.fullname
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="employee-details">
                      <p className="employee-name">{employee.fullname}</p>
                      <p className="employee-position">{employee.position}</p>
                    </div>
                  </div>
                </td>
                <td className="table-td">
                  <span style={{ fontWeight: '500' }}>{employee.code}</span>
                </td>
                <td className="table-td">
                  <span
                    className="table-chip"
                    style={{
                      backgroundColor: getDepartmentColor(employee.department)
                    }}
                  >
                    {employee.department}
                  </span>
                </td>
                <td className="table-td">
                  <div className="contact-info">
                    <div className="contact-row">
                      <Phone size={14} color="#64748b" />
                      <span>{employee.phone}</span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                      {employee.email}
                    </div>
                  </div>
                </td>
                <td className="table-td">
                  <div className="contact-row">
                    <MapPin size={14} color="#64748b" />
                    <span>{employee.address}</span>
                  </div>
                </td>
                <td className="table-td" style={{ textAlign: 'center' }}>
                  <div className="dropdown">
                    <button
                      className="action-button"
                      style={{
                        backgroundColor: showActionMenu === employee.id ? '#f1f5f9' : 'transparent'
                      }}
                      onClick={() => setShowActionMenu(showActionMenu === employee.id ? null : employee.id)}
                      onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = showActionMenu === employee.id ? '#f1f5f9' : 'transparent')}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {showActionMenu === employee.id && (
                      <div className="dropdown-menu">
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            handleDetailClick(employee);
                            // Handle edit action
                          }}
                          onMouseEnter={(e) => ((e.target as HTMLDivElement).style.backgroundColor = '#f8fafc')}
                          onMouseLeave={(e) => ((e.target as HTMLDivElement).style.backgroundColor = 'transparent')}
                        >
                          <Edit size={16} />
                          Chi tiết
                        </div>
                        <div
                          className="dropdown-item"
                          style={{ color: '#ef4444' }}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowDeleteDialog(true);
                            setShowActionMenu(null);
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#fef2f2';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 size={16} />
                          Xóa
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Hiển thị {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredEmployees.length)} trên {filteredEmployees.length} nhân viên
          </div>
          <div className="pagination-controls">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value));
                setPage(0);
              }}
              style={{
                padding: '6px 8px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value={5}>5 / trang</option>
              <option value={10}>10 / trang</option>
              <option value={25}>25 / trang</option>
            </select>
            <button
              className="page-button"
              style={{
                opacity: page === 0 ? 0.5 : 1,
                cursor: page === 0 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              Trang {page + 1} / {totalPages}
            </span>
            <button
              className="page-button"
              style={{
                opacity: page >= totalPages - 1 ? 0.5 : 1,
                cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="modal" onClick={() => setShowDeleteDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Xác nhận xóa</h3>
            <p className="modal-text">
              Bạn có chắc chắn muốn xóa nhân viên{' '}
              <strong>{selectedEmployee?.fullname}</strong>?<br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteDialog(false)}
              >
                Hủy
              </button>
              <button
                className="delete-button"
              // onClick={() => handleDeleteEmployee(selectedEmployee.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <button
        className="fab"
        style={{
          display: window.innerWidth < 768 ? 'flex' : 'none'
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
      >
        <Plus size={24} />
      </button>

      {/* Click outside handler */}
      {(showActionMenu || showFilterMenu) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5
          }}
          onClick={() => {
            setShowActionMenu(null);
            setShowFilterMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default TableComponent;
