import React from 'react';
import { cn } from '@/lib/utils';

interface BrandNameProps {
  className?: string;
  dotPlClassName?: string;
  variant?: 'handwriting' | 'classic';
}

const BrandName: React.FC<BrandNameProps> = ({ className }) => {
  return (
    <span className={cn("font-heading font-semibold tracking-tight", className)}>
      Paweł Polutek
    </span>
  );
};

export default BrandName;
