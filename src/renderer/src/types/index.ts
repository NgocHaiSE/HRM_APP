// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User and Authentication types
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
  updated_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Employee/Person types
export interface Person {
  id: number;
  code: string;
  fullname: string;
  gender: number;
  birth?: string;
  phone?: string;
  address?: string;
  email?: string;
  position?: string;
  department_id?: number;
  department_name?: string;
  avatar_url?: string;
  status: number;
  created_at: string;
  updated_at?: string;
}

export interface CreatePersonRequest {
  code: string;
  fullname: string;
  gender: number;
  birth?: string;
  phone?: string;
  address?: string;
  email?: string;
  position?: string;
  department_id?: number;
}

export interface UpdatePersonRequest extends Partial<CreatePersonRequest> {}

export interface Department {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Camera types
export interface Camera {
  id: number;
  name: string;
  link: string;
  type: number; // 0: Webcam, 1: IP Camera
  ip?: string;
  username?: string;
  password?: string;
  location: string;
  status: number; // 0: Disabled, 1: Enabled
  created_at: string;
  updated_at?: string;
}

export interface CreateCameraRequest {
  name: string;
  link: string;
  type: number;
  ip?: string;
  username?: string;
  password?: string;
  location: string;
}

export interface UpdateCameraRequest extends Partial<CreateCameraRequest> {}

export interface CameraStatus {
  camera_id: string;
  is_running: boolean;
  status: string;
}

// Timekeeping types
export interface TimekeepingRecord {
  id: number;
  person_id: number;
  person_code: string;
  fullname: string;
  check_in?: string;
  check_out?: string;
  date: string;
  status: string;
  image_url?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
}

export interface CheckinRequest {
  file: string; // Base64 encoded image
}

export interface CheckoutRequest {
  file: string; // Base64 encoded image
}

export interface ManualTimekeepingRequest {
  person_id: number;
  check_time?: string;
}

export interface AttendanceStats {
  total_employees: number;
  present_today: number;
  absent_today: number;
  currently_checked_in: number;
  average_work_hours: number;
}

export interface PersonalAttendanceStats {
  person_id: number;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  early_leave_days: number;
  total_work_hours: number;
  average_work_hours: number;
}

// Recognition types
export interface RecognitionHistory {
  id: number;
  personcode: string;
  fullname: string;
  location: string;
  time: string;
  image: string;
  confidence?: number;
  created_at: string;
}

export interface FaceUploadRequest {
  file: File;
  personid: string;
  code: string;
}

export interface AvatarUploadRequest {
  file: File;
  code: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormErrors {
  [key: string]: string;
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  };
  actions?: {
    view?: (record: T) => void;
    edit?: (record: T) => void;
    delete?: (record: T) => void;
  };
}

// Filter types
export interface DateRangeFilter {
  start: string;
  end: string;
}

export interface SearchFilter {
  term: string;
  fields: string[];
}

export interface StatusFilter {
  value: 'all' | 'active' | 'inactive';
}

// Modal types
export interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export interface ConfirmModalProps extends ModalProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  description: string;
  confirmText?: string;
  cancelText?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

// Loading states
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface AsyncState<T = any> extends LoadingState {
  data: T | null;
}

// Theme types
export interface Theme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface SelectProps extends BaseComponentProps {
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  options: { value: string | number; label: string; disabled?: boolean }[];
  onChange?: (value: string | number) => void;
}

// Route types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAnyPermission?: boolean;
  requiredRole?: string;
  children?: RouteConfig[];
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

// Export all types as default
export default {
  // Re-export all types for convenience
};