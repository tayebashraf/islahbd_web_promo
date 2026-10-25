'use client';

import React, { useState } from 'react';
import './avatar.css';

export const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  ...props
}) => {
  const [imgError, setImgError] = useState(false);

  const getInitial = () => {
    if (!name) return 'স';
    return name.trim().charAt(0);
  };

  return (
    <div
      className={`avatar avatar--${size} ${className}`}
      aria-label={alt || name}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || name}
          className="avatar__img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span>{getInitial()}</span>
      )}
    </div>
  );
};

export default Avatar;
