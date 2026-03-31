'use client';

import React from 'react';
import { RoughNotation } from 'react-rough-notation';

interface DoodleBoxProps {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  strokeWidth?: number;
  color?: string;
  padding?: number;
}

const DoodleBox: React.FC<DoodleBoxProps> = ({
  children,
  className = '',
  show = true,
  strokeWidth = 2,
  color = 'currentColor',
  padding = 0,
}) => {
  return (
    <div className={className}>
      <RoughNotation
        type="box"
        show={show}
        strokeWidth={strokeWidth}
        color={color}
        animate={false}
        multiline={true}
        padding={padding}
      >
        {children}
      </RoughNotation>
    </div>
  );
};

export default DoodleBox;
