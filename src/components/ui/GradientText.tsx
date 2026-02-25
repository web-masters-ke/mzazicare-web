'use client';

import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  colors?: string[];
}

export function GradientText({
  children,
  className = '',
  animated = false,
  colors = ['var(--color-primary-500)', 'var(--color-accent-500)']
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
  };

  return (
    <span
      className={`${animated ? 'text-gradient-animated' : 'text-gradient'} ${className}`}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
