import React, { useState, useEffect } from 'react';
import { apiService, Camera } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Camera as CameraIcon,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Monitor,
  Wifi,
  WifiOff
} from 'lucide-react';

interface CameraStatus {
  id: number;
  is_running: boolean;
}

const CameraManagement: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [cameraStatuses, setCameraStatuses] = useState<Map<number, boolean>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<Map<number, string>>(new Map());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<Camera | null>(null);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    link: '',
    type: 1,
    location: '',
    ip: '',
    username: '',
    password: ''
  });

  const { hasPermission } = useAuth();

  useEffect(() => {
    loadCameras();
  }, []);

  useEffect(() => {
    if (cameras.length > 0) {
      checkAllCameraStatuses();
    }
  }, [cameras]);

  const loadCameras = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getAllCameras();
      setCameras(data);
    } catch (err) {
      console.error('Error loading cameras:', err);
      setError('Không thể tải danh sách camera');
    } finally {
      setLoading(false);
    }
  };

  const checkAllCameraStatuses = async () => {
    const statusPromises = cameras.map(async (camera) => {
      try {
        const status = await apiService.checkCameraStatus(camera.id);
        return { id: camera.id, is_running: status.is_running };
      } catch (error) {
        return { id: camera.id, is_running: false };
      }
    });

    try {
      const statuses = await Promise.all(statusPromises);
      const statusMap = new Map();
      statuses.forEach(status => {
        statusMap.set(status.id, status.is_running);
      });
      setCameraStatuses(statusMap);
    } catch (error) {
      console.error('Error checking camera statuses:', error);
    }
  };

  const handleCameraAction = async (cameraId: number, action: 'start' | 'stop') => {
    try {
      setActionLoading(prev => new Map(prev.set(cameraId, action)));
      
      if (action === 'start') {
        await apiService.startCamera(cameraId);
      } else {
        await apiService.stopCamera(cameraId);
      }

      // Update status immediately
      setCameraStatuses(prev => new Map(prev.set(cameraId, action === 'start')));
      
      // Refresh status after a delay
      setTimeout(() => {
        checkCameraStatus(cameraId);
      }, 2000);

    } catch (err) {
      console.error(`Error ${action}ing camera:`, err);
      setError(`Không thể ${action === 'start' ? 'khởi động' : 'dừng'} camera`);
    } finally {
      setActionLoading(prev => {
        const newMap = new Map(prev);
        newMap.delete(cameraId);
        return newMap;
      });
    }
  };

  const checkCameraStatus = async (cameraId: number) => {
    try {
      const status = await apiService.checkCameraStatus(cameraId);
      setCameraStatuses(prev => new Map(prev.set(cameraId, status.is_running)));
    } catch (error) {
      setCameraStatuses(prev => new Map(prev.set(cameraId, false)));
    }
  };

  const handleCreateCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiService.createPerson(createFormData as any); // This should be createCamera
      setShowCreateModal(false);
      setCreateFormData({
        name: '',
        link: '',
        type: 1,
        location: '',
        ip: '',
        username: '',
        password: ''
      });
      await loadCameras();
    } catch (err) {
      console.error('Error creating camera:', err);
      setError('Không thể tạo camera mới');
    }
  };

  const handleDeleteCamera = async (camera: Camera) => {
    try {
      await apiService.deletePerson(camera.id); // This should be deleteCamera
      setShowDeleteModal(false);
      setCameraToDelete(null);
      await loadCameras();
    } catch (err) {
      console.error('Error deleting camera:', err);
      setError('Không thể xóa camera');
    }
  };

  const getCameraTypeLabel = (type: number) => {
    return type === 0 ? 'Webcam' : 'IP Camera';
  };

  const getStatusBadge = (camera: Camera) => {
    const isRunning = cameraStatuses.get(camera.id);
    const isActive = camera.status === 1;

    if (!isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          Tắt
        </span>
      );
    }

    if (isRunning) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đang chạy
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Dừng
        </span>
      );
    }
  };

  const getNetworkIcon = (camera: Camera) => {
    const isRunning = cameraStatuses.get(camera.id);
    return isRunning ? (
      <Wifi className="h-5 w-5 text-green-500" />
    ) : (
      <WifiOff className="h-5 w-5 text-red-500" />
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
            Quản lý Camera
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý và điều khiển hệ thống camera an ninh
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
          <button
            onClick={loadCameras}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </button>
          <button
            onClick={checkAllCameraStatuses}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Kiểm tra trạng thái
          </button>
          {hasPermission('security.manage') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm camera
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CameraIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng camera
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cameras.length}
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
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang chạy
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Array.from(cameraStatuses.values()).filter(Boolean).length}
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
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Dừng hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cameras.filter(c => c.status === 1).length - Array.from(cameraStatuses.values()).filter(Boolean).length}
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
                <Monitor className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cameras.filter(c => c.status === 1).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cameras.map((camera) => (
          <div key={camera.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CameraIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {camera.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getCameraTypeLabel(camera.type)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getNetworkIcon(camera)}
                  {getStatusBadge(camera)}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Vị trí:</span>
                  <span className="font-medium">{camera.location}</span>
                </div>
                {camera.ip && (
                  <div className="flex justify-between">
                    <span>IP:</span>
                    <span className="font-medium">{camera.ip}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className={`font-medium ${camera.status === 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {camera.status === 1 ? 'Bật' : 'Tắt'}
                  </span>
                </div>
              </div>

              {/* Camera Actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                {hasPermission('security.manage') && camera.status === 1 && (
                  <>
                    <button
                      onClick={() => handleCameraAction(camera.id, cameraStatuses.get(camera.id) ? 'stop' : 'start')}
                      disabled={actionLoading.has(camera.id)}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded ${
                        cameraStatuses.get(camera.id)
                          ? 'text-red-700 bg-red-100 hover:bg-red-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      {actionLoading.get(camera.id) === 'start' || actionLoading.get(camera.id) === 'stop' ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                      ) : cameraStatuses.get(camera.id) ? (
                        <Pause className="h-3 w-3 mr-1" />
                      ) : (
                        <Play className="h-3 w-3 mr-1" />
                      )}
                      {cameraStatuses.get(camera.id) ? 'Dừng' : 'Khởi động'}
                    </button>

                    <button
                      onClick={() => checkCameraStatus(camera.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Kiểm tra
                    </button>
                  </>
                )}

                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  title="Xem chi tiết"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Chi tiết
                </button>

                {hasPermission('security.manage') && (
                  <>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      title="Cấu hình"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Cấu hình
                    </button>

                    <button
                      onClick={() => {
                        setCameraToDelete(camera);
                        setShowDeleteModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                      title="Xóa"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Xóa
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cameras.length === 0 && (
        <div className="text-center py-12">
          <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có camera</h3>
          <p className="mt-1 text-sm text-gray-500">
            Bắt đầu bằng cách thêm camera đầu tiên vào hệ thống
          </p>
          {hasPermission('security.manage') && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm camera
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Camera Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thêm camera mới
              </h3>
              <form onSubmit={handleCreateCamera} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên camera *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập tên camera"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đường dẫn *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.link}
                    onChange={(e) => setCreateFormData({...createFormData, link: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="rtsp:// hoặc số webcam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại camera
                  </label>
                  <select
                    value={createFormData.type}
                    onChange={(e) => setCreateFormData({...createFormData, type: parseInt(e.target.value)})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={0}>Webcam</option>
                    <option value={1}>IP Camera</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.location}
                    onChange={(e) => setCreateFormData({...createFormData, location: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Vị trí camera"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Tạo camera
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && cameraToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Xóa camera
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa camera{' '}
                  <span className="font-medium">{cameraToDelete.name}</span>?
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteCamera(cameraToDelete)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700"
                >
                  Xóa
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCameraToDelete(null);
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

export default CameraManagement;