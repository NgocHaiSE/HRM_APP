import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, TimekeepingRecord, Camera } from '../services/api';
import { 
  Users, 
  Camera as CameraIcon, 
  Clock, 
  UserCheck, 
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  activeCameras: number;
  todayAttendance: number;
  currentlyCheckedIn: number;
}

const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeCameras: 0,
    todayAttendance: 0,
    currentlyCheckedIn: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState<TimekeepingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const today = new Date().toISOString().split('T')[0];
      
      // Load data based on permissions
      const promises: Promise<any>[] = [];
      
      if (hasPermission('employees.view')) {
        promises.push(apiService.getAllPersons());
      }
      
      if (hasPermission('security.view')) {
        promises.push(apiService.getAllCameras());
      }
      
      if (hasPermission('timekeeping.view')) {
        promises.push(apiService.getAttendanceByDate(today));
        promises.push(apiService.getRealtimeAttendance());
      }

      const results = await Promise.allSettled(promises);
      
      let totalEmployees = 0;
      let activeCameras = 0;
      let todayAttendance = 0;
      let currentlyCheckedIn = 0;
      let attendanceRecords: TimekeepingRecord[] = [];

      let resultIndex = 0;
      
      if (hasPermission('employees.view')) {
        const employeesResult = results[resultIndex++];
        if (employeesResult.status === 'fulfilled') {
          totalEmployees = employeesResult.value.length;
        }
      }
      
      if (hasPermission('security.view')) {
        const camerasResult = results[resultIndex++];
        if (camerasResult.status === 'fulfilled') {
          activeCameras = (camerasResult.value as Camera[]).filter(c => c.status === 1).length;
        }
      }
      
      if (hasPermission('timekeeping.view')) {
        const attendanceResult = results[resultIndex++];
        if (attendanceResult.status === 'fulfilled') {
          attendanceRecords = attendanceResult.value;
          todayAttendance = attendanceRecords.length;
        }
        
        const realtimeResult = results[resultIndex++];
        if (realtimeResult.status === 'fulfilled') {
          currentlyCheckedIn = realtimeResult.value.length;
        }
      }

      setStats({
        totalEmployees,
        activeCameras,
        todayAttendance,
        currentlyCheckedIn,
      });

      setRecentAttendance(attendanceRecords.slice(0, 10));

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chào mừng, {user?.full_name || user?.username}!
          </h1>
          <p className="text-gray-600">
            Vai trò: <span className="font-medium text-indigo-600">{user?.role_name}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Hôm nay là {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {hasPermission('employees.view') && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng nhân viên
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalEmployees}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasPermission('security.view') && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CameraIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Camera hoạt động
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeCameras}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasPermission('timekeeping.view') && (
          <>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Chấm công hôm nay
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.todayAttendance}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Đang có mặt
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.currentlyCheckedIn}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Attendance */}
      {hasPermission('timekeeping.view') && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Chấm công gần đây
            </h3>
            {recentAttendance.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Chưa có dữ liệu chấm công hôm nay
              </p>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nhân viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã NV
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giờ vào
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giờ ra
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentAttendance.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.fullname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.person_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(record.check_in || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(record.check_out || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.check_out ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Hoàn thành
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Đang làm việc
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hasPermission('employees.create') && (
              <button
                onClick={() => window.location.href = '/employees/create'}
                className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg p-4 text-left transition-colors duration-200"
              >
                <Users className="h-6 w-6 text-indigo-600 mb-2" />
                <h4 className="text-sm font-medium text-indigo-900">
                  Thêm nhân viên mới
                </h4>
                <p className="text-xs text-indigo-700">
                  Tạo hồ sơ nhân viên mới
                </p>
              </button>
            )}

            {hasPermission('timekeeping.manage') && (
              <button
                onClick={() => window.location.href = '/timekeeping/manual'}
                className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors duration-200"
              >
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="text-sm font-medium text-green-900">
                  Chấm công thủ công
                </h4>
                <p className="text-xs text-green-700">
                  Chấm công cho nhân viên
                </p>
              </button>
            )}

            {hasPermission('security.manage') && (
              <button
                onClick={() => window.location.href = '/cameras'}
                className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors duration-200"
              >
                <CameraIcon className="h-6 w-6 text-purple-600 mb-2" />
                <h4 className="text-sm font-medium text-purple-900">
                  Quản lý camera
                </h4>
                <p className="text-xs text-purple-700">
                  Cấu hình hệ thống camera
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;