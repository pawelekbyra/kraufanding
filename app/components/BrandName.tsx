import React from 'react';
import { cn } from '@/lib/utils';

interface BrandNameProps {
  className?: string;
  dotPlClassName?: string;
  variant?: 'handwriting' | 'classic';
}

const BrandName: React.FC<BrandNameProps> = ({ className, dotPlClassName, variant = 'classic' }) => {
  const isClassic = variant === 'classic';
  return (
    <span className={cn(
      isClassic ? "font-brand font-black tracking-[-0.05em] uppercase" : "font-handwriting font-bold uppercase tracking-wider",
      className
    )}>
      POLUTEK<span className={cn("text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]", dotPlClassName)}>.PL</span>
    </span>
  );
};

export default BrandName;
