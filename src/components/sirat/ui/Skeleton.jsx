import React from 'react';
import './skeleton.css';

export const Skeleton = ({
  variant = 'rect', // 'rect' | 'text' | 'title' | 'circle'
  width,
  height,
  className = '',
  style = {},
  ...props
}) => {
  const customStyles = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={customStyles}
      aria-hidden="true"
      {...props}
    />
  );
};

export const ArticleCardSkeleton = () => {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton variant="text" width="90px" height="18px" />
      <Skeleton variant="title" width="85%" height="28px" />
      <Skeleton variant="text" width="100%" height="16px" />
      <Skeleton variant="text" width="70%" height="16px" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <Skeleton variant="circle" width="32px" height="32px" />
        <Skeleton variant="text" width="120px" height="14px" />
      </div>
    </div>
  );
};

export default Skeleton;
