'use client';

import React from 'react';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  speed?: 'slow' | 'medium' | 'fast';
  delay?: number;
}

export function FloatingElement({
  children,
  className = '',
  speed = 'medium',
  delay = 0
}: FloatingElementProps) {
  const speedClass = {
    slow: 'animate-float-slow',
    medium: 'animate-float-medium',
    fast: 'animate-float-fast'
  }[speed];

  return (
    <div
      className={`${speedClass} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
