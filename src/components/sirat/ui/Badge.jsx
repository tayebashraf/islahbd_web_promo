import React from 'react';
import './badge.css';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'brand' | 'verified' | 'success' | 'warning' | 'error' | 'outline'
  icon,
  className = '',
  ...props
}) => {
  return (
    <span className={`badge badge--${variant} ${className}`} {...props}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
