'use client';

import React from 'react';
import { RoughNotation } from 'react-rough-notation';

interface DoodleDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  color?: string;
  strokeWidth?: number;
  padding?: number;
}

const DoodleDivider: React.FC<DoodleDividerProps> = ({
  orientation = 'horizontal',
  className = '',
  color = 'currentColor',
  strokeWidth = 1,
  padding = 0,
}) => {
  return (
    <div className={`${className} inline-flex items-center justify-center`}>
      <RoughNotation
        type={orientation === 'horizontal' ? 'strike-through' : 'bracket'}
        brackets={orientation === 'vertical' ? ['left'] : undefined}
        show={true}
        animate={false}
        color={color}
        strokeWidth={strokeWidth}
        padding={padding}
      >
        <div className={orientation === 'horizontal' ? 'w-full h-0' : 'h-full w-0'} />
      </RoughNotation>
    </div>
  );
};

export default DoodleDivider;
