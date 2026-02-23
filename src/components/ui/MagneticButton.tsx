'use client';

import React, { useRef, useState } from 'react';
import { Button } from './Button';

interface MagneticButtonProps extends React.ComponentProps<typeof Button> {
  magneticStrength?: number;
  children: React.ReactNode;
}

export function MagneticButton({
  magneticStrength = 0.3,
  children,
  className = '',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-area ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0
          ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'none'
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
