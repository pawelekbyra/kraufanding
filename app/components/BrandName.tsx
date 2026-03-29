import React from 'react';
import { cn } from '@/lib/utils';

interface BrandNameProps {
  className?: string;
  dotPlClassName?: string;
  variant?: 'handwriting' | 'classic';
}

const BrandName: React.FC<BrandNameProps> = ({ className, dotPlClassName, variant = 'handwriting' }) => {
  const isClassic = variant === 'classic';
  return (
    <span className={cn(
      isClassic ? "font-sans font-black tracking-tighter uppercase" : "font-handwriting font-bold uppercase",
      className
    )}>
      POLUTEK<span className={cn("text-[#086f7a]", dotPlClassName)}>.PL</span>
    </span>
  );
};

export default BrandName;
