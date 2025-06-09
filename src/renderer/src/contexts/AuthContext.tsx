import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { apiService } from '../services/api';

// Types
export interface User {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  role_name: string;
  role_description?: string;
  status: string;
  permissions: string[];
  created_at: string;
  avatar_url?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<void>;
  connectionError: boolean;
  retryConnection: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setConnectionError(false);
      if (apiService.isAuthenticated()) {
        const userData = await apiService.getProfile();
        setUser(userData);
      }
    } catch (error: any) {
      console.error('Failed to initialize auth:', error);
      
      if (isConnectionError(error)) {
        setConnectionError(true);
        showNotification('error', 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        apiService.removeToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setConnectionError(false);
      const response = await apiService.login(credentials);
      setUser(response.user);
      
      showNotification('success', 'Đăng nhập thành công!');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (isConnectionError(error)) {
        setConnectionError(true);
        showNotification('error', 'Không thể kết nối đến server. Vui lòng thử lại sau.');
      } else {
        const errorMessage = apiService.handleError(error);
        showNotification('error', errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiService.logout();
      setUser(null);
      
      showNotification('success', 'Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setConnectionError(false);
      if (apiService.isAuthenticated()) {
        const userData = await apiService.getProfile();
        setUser(userData);
      }
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      
      if (isConnectionError(error)) {
        setConnectionError(true);
      } else {
        setUser(null);
        apiService.removeToken();
      }
    }
  };

  const retryConnection = () => {
    setConnectionError(false);
    initializeAuth();
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role_name === role;
  };

  // Helper function to detect connection errors
  const isConnectionError = (error: any): boolean => {
    return (
      error.code === 'ERR_NETWORK' ||
      error.message?.includes('CORS') ||
      error.message?.includes('Network Error') ||
      error.message?.includes('fetch') ||
      !error.response // If there's no response, it's likely a network issue
    );
  };

  // Enhanced notification system
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `
      fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
      ${type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 
        'bg-blue-500'} 
      text-white font-medium animate-fade-in cursor-pointer
    `;
    
    // Add icon and message
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${icon}</span>
        <span>${message}</span>
      </div>
    `;
    
    // Add click to dismiss
    notification.onclick = () => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    };
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove
    const duration = type === 'error' ? 7000 : 4000;
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'fade-out 0.3s ease-out forwards';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, duration);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    hasPermission,
    hasAnyPermission,
    hasRole,
    refreshUser,
    connectionError,
    retryConnection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Connection Error Overlay */}
      {connectionError && !loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">❌</div>
              <h3 className="text-lg font-semibold mb-2">Lỗi kết nối</h3>
              <p className="text-gray-600 mb-4">
                Không thể kết nối đến server. Vui lòng kiểm tra:
              </p>
              <ul className="text-left text-sm text-gray-600 mb-4">
                <li>• Server có đang chạy tại localhost:5000?</li>
                <li>• Kết nối mạng của bạn</li>
                <li>• Tường lửa hoặc proxy</li>
              </ul>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={retryConnection}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => setConnectionError(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);