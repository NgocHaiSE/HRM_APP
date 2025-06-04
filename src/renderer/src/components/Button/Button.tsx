import './Button.css';
import React from 'react';

interface ButtonProps {
  onClick?: () => void; // Hàm xử lý sự kiện nhấn
  className?: string; // Class tùy chỉnh
  style?: React.CSSProperties; // Style inline tùy chỉnh
  radius?: number; // Bán kính bo góc (mặc định là 4px)
  size?: number; // Kích thước chiều cao (width tự động dựa trên nội dung)
  tooltip?: string; // Tooltip hiển thị khi hover
  children?: React.ReactNode; // Nội dung bên trong nút (bắt buộc)
  disabled?: boolean; // Trạng thái vô hiệu hóa (tùy chọn)
  backgroundColor?: string; // Màu nền của nút (tùy chọn, mặc định là #007bff)
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className = '',
  style = {},
  radius = 10,
  size = 40, // Chiều cao mặc định
  tooltip = '',
  children,
  disabled = false,
  // backgroundColor = '#534FEB', // Màu nền mặc định
}) => {
  return (
    <button
      className={`primary-button ${className}`}
      onClick={disabled ? undefined : onClick} // Không gọi onClick nếu disabled
      style={{ height: size, borderRadius: radius, ...style }}
      title={tooltip}
      disabled={disabled}
    >
      <span className='button-content'>{children}</span>
    </button>
  );
};

export default Button;