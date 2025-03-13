import './Button.css';
import React from 'react';

interface ButtonProps {
  onClick?: () => void; // Hàm xử lý sự kiện nhấn
  className?: string; // Class tùy chỉnh
  style?: React.CSSProperties; // Style inline tùy chỉnh
  size?: number; // Kích thước chiều cao (width tự động dựa trên nội dung)
  tooltip?: string; // Tooltip hiển thị khi hover
  children?: React.ReactNode; // Nội dung bên trong nút (bắt buộc)
  disabled?: boolean; // Trạng thái vô hiệu hóa (tùy chọn)
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className = '',
  style = {},
  size = 40, // Chiều cao mặc định
  tooltip = '',
  children,
  disabled = false,
}) => {
  return (
    <button
      className={`primary-button ${className}`}
      onClick={disabled ? undefined : onClick} // Không gọi onClick nếu disabled
      style={{ height: size, ...style }}
      title={tooltip}
      disabled={disabled}
    >
      <span className='button-content'>{children}</span>
    </button>
  );
};

export default Button;