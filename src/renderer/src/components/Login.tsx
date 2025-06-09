import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Camera,
  ArrowRight,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ username: username.trim(), password });
      
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username.trim());
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  React.useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
            backgroundSize: '400px 400px',
            animation: 'float 20s ease-in-out infinite'
          }} />
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-[60%] right-[15%] w-32 h-32 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 flex-col justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.5" fill="white" fill-opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" fill-opacity="0.1"/><circle cx="40" cy="80" r="1.2" fill="white" fill-opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(#grain)"/></svg>')}")`,
            }} />
          </div>

          <div className="relative z-10">
            {/* Brand Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                <Camera size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                Face Recognition
              </h1>
              <p className="text-lg text-white/90">Hệ thống quản lý thông minh</p>
            </div>

            {/* Features List */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Bảo mật cao</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Xác thực khuôn mặt tiên tiến với độ chính xác cao</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Quản lý nhân viên</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Theo dõi và quản lý thông tin nhân viên một cách hiệu quả</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Báo cáo thống kê</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Phân tích dữ liệu chấm công với biểu đồ trực quan</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <p className="text-white/90 italic text-base leading-relaxed mb-2">
                "Hệ thống giúp chúng tôi quản lý nhân sự hiệu quả hơn 300%"
              </p>
              <span className="text-white/70 text-sm font-medium">- CEO, TechCorp</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h2>
              <p className="text-gray-600">Đăng nhập để tiếp tục sử dụng hệ thống</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full h-12 pl-12 pr-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                    rememberMe 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
                </label>
                
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                disabled={loading || !username.trim() || !password.trim()}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản? 
                <button 
                  className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Liên hệ quản trị viên
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 text-xs text-white/70 z-10">
        <span>Version 1.0.0</span>
        <span>© 2024 Face Recognition System</span>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
      `}</style>
    </div>
  );
};

export default Login;