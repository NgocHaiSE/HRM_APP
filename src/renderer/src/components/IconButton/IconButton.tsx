import React from 'react';
import './iconbutton.css';

interface IconButtonProps {
  icon: string; // Truyền vào đường dẫn hình ảnh
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  tooltip?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  className = '',
  style = {},
  size = 35,
  tooltip = ''
}) => {
  return (
    <button
      className={`icon-button ${className}`}
      onClick={onClick}
      style={{ width: size, height: size, ...style }}
      title={tooltip}
    >
      <img src={icon} alt="icon" className="icon-image" />
    </button>
  );
};

export default IconButton;
