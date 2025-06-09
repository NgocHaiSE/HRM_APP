import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Clock,
  Camera,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  UserCheck,
  Shield,
  Calendar,
  Bell
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with real data from API
  const stats = {
    totalEmployees: 150,
    totalEmployeesChange: 5,
    presentToday: 142,
    presentTodayChange: -3,
    totalCameras: 8,
    activeCameras: 7,
    avgWorkHours: 8.2,
    avgWorkHoursChange: 0.3
  };

  const recentActivities = [
    { id: 1, type: 'checkin', user: 'Nguyễn Văn A', time: '08:30', status: 'success' },
    { id: 2, type: 'checkout', user: 'Trần Thị B', time: '17:45', status: 'success' },
    { id: 3, type: 'late', user: 'Lê Văn C', time: '09:15', status: 'warning' },
    { id: 4, type: 'camera', user: 'Camera 3', time: '10:00', status: 'error' },
    { id: 5, type: 'checkin', user: 'Phạm Thị D', time: '08:45', status: 'success' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Họp tuần', time: '14:00', date: 'Hôm nay' },
    { id: 2, title: 'Báo cáo tháng', time: '09:00', date: 'Ngày mai' },
    { id: 3, title: 'Đào tạo an ninh', time: '13:30', date: '25/06' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp size={16} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}
              </span>
              <span className="text-xs text-gray-500 ml-1">so với hôm qua</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityItem: React.FC<{
    activity: typeof recentActivities[0];
  }> = ({ activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'checkin':
          return <UserCheck size={16} className="text-green-600" />;
        case 'checkout':
          return <Clock size={16} className="text-blue-600" />;
        case 'late':
          return <Activity size={16} className="text-orange-600" />;
        case 'camera':
          return <Camera size={16} className="text-red-600" />;
        default:
          return <Activity size={16} className="text-gray-600" />;
      }
    };

    const getActivityText = () => {
      switch (activity.type) {
        case 'checkin':
          return `${activity.user} đã check-in`;
        case 'checkout':
          return `${activity.user} đã check-out`;
        case 'late':
          return `${activity.user} đi muộn`;
        case 'camera':
          return `${activity.user} ngừng hoạt động`;
        default:
          return activity.user;
      }
    };

    const getStatusColor = () => {
      switch (activity.status) {
        case 'success':
          return 'bg-green-100';
        case 'warning':
          return 'bg-orange-100';
        case 'error':
          return 'bg-red-100';
        default:
          return 'bg-gray-100';
      }
    };

    return (
      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
        <div className={`p-2 rounded-lg ${getStatusColor()}`}>
          {getActivityIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{getActivityText()}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user?.full_name || user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-600">{new Date().toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</p>
            <p className="text-sm text-gray-500">Giờ hiện tại</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng nhân viên"
          value={stats.totalEmployees}
          change={stats.totalEmployeesChange}
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Có mặt hôm nay"
          value={stats.presentToday}
          change={stats.presentTodayChange}
          icon={<UserCheck size={24} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Camera hoạt động"
          value={`${stats.activeCameras}/${stats.totalCameras}`}
          icon={<Camera size={24} className="text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Giờ làm trung bình"
          value={`${stats.avgWorkHours}h`}
          change={stats.avgWorkHoursChange}
          icon={<Clock size={24} className="text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-1">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sự kiện sắp tới</h3>
            <Bell size={20} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
            <Calendar size={16} className="inline mr-2" />
            Xem lịch đầy đủ
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
            <Users size={24} className="text-gray-400 group-hover:text-indigo-600" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Thêm nhân viên</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
            <Eye size={24} className="text-gray-400 group-hover:text-indigo-600" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Xem camera</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
            <BarChart3 size={24} className="text-gray-400 group-hover:text-indigo-600" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Xem báo cáo</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
            <Shield size={24} className="text-gray-400 group-hover:text-indigo-600" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Cài đặt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;