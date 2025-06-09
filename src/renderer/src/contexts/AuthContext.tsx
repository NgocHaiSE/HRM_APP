import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

// API Service interface
interface ApiService {
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  getProfile: () => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  setToken: (token: string) => void;
  removeToken: () => void;
}

// Mock API Service - replace with your actual API service
const mockApiService: ApiService = {
  login: async (credentials: LoginRequest) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const mockUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        full_name: 'Administrator',
        role_name: 'Admin',
        role_description: 'System Administrator',
        status: 'active',
        permissions: [
          'employees.view',
          'employees.create',
          'employees.edit',
          'employees.delete',
          'timekeeping.view',
          'timekeeping.manage',
          'security.view',
          'security.manage',
          'reports.view',
          'system.admin'
        ],
        created_at: new Date().toISOString(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', token);
      
      return {
        token,
        user: mockUser
      };
    } else if (credentials.username === 'user' && credentials.password === 'user') {
      const mockUser: User = {
        id: 2,
        username: 'user',
        email: 'user@example.com',
        full_name: 'Regular User',
        role_name: 'Employee',
        role_description: 'Regular Employee',
        status: 'active',
        permissions: [
          'employees.view',
          'timekeeping.view'
        ],
        created_at: new Date().toISOString(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', token);
      
      return {
        token,
        user: mockUser
      };
    }
    
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
  },
  
  getProfile: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock user based on token
    if (token.includes('admin')) {
      return {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        full_name: 'Administrator',
        role_name: 'Admin',
        role_description: 'System Administrator',
        status: 'active',
        permissions: [
          'employees.view',
          'employees.create',
          'employees.edit',
          'employees.delete',
          'timekeeping.view',
          'timekeeping.manage',
          'security.view',
          'security.manage',
          'reports.view',
          'system.admin'
        ],
        created_at: new Date().toISOString(),
      };
    }
    
    return {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      full_name: 'Regular User',
      role_name: 'Employee',
      role_description: 'Regular Employee',
      status: 'active',
      permissions: [
        'employees.view',
        'timekeeping.view'
      ],
      created_at: new Date().toISOString(),
    };
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('authToken');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },
  
  removeToken: () => {
    localStorage.removeItem('authToken');
  }
};

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (mockApiService.isAuthenticated()) {
        const userData = await mockApiService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      mockApiService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await mockApiService.login(credentials);
      setUser(response.user);
      
      // Show success notification
      showNotification('success', 'Đăng nhập thành công!');
    } catch (error: any) {
      // Show error notification
      showNotification('error', error.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await mockApiService.logout();
      setUser(null);
      
      // Show success notification
      showNotification('success', 'Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (mockApiService.isAuthenticated()) {
        const userData = await mockApiService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      mockApiService.removeToken();
    }
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

  // Simple notification system
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `
      fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
      ${type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 
        'bg-blue-500'} 
      text-white font-medium animate-fade-in
    `;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fade-out 0.3s ease-out forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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

// Add fade-out animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
`;
document.head.appendChild(style);