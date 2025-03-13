import React from 'react';
import './Select.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ options, value, style, onChange }) => {
  return (
    <div className="select-container" style={style}>
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}  
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="select-arrow" />
    </div>
  );
};

export default Select;
