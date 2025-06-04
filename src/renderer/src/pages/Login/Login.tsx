import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/icon/Logo_MTA_new.png';
import './Login.css';
import Loading from '../Loading/Loading'; 
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const toggleRememberMe = () => {
  //   setRememberMe(!rememberMe);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await window.db.authenticateUser(account, password);
      if (response && response.length > 0) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response[0]));
        setIsLoading(true);
        setTimeout(() => {
          navigate('/security/monitor');
        }, 3000);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      setError('Failed to authenticate. Please try again.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="login-container">
      <div className="logo-section">
        <div className="logo-wrapper">
          <img src={Logo} alt="logo" className="logo-img" />
          <h1 className="logo-text">H41 DEV</h1>
        </div>
      </div>

      <div className="login-form-container">
        <h2 className="welcome-text">Welcome! </h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên tài khoản</label>
            <input
              type="text"
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Nhập tài khoản"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* <div className="form-footer">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={toggleRememberMe}
                className="checkbox-input"
              />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div> */}

          <button type="submit" className="login-button">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;