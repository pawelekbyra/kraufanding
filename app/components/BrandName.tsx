import React from 'react';
import { cn } from '@/lib/utils';

interface BrandNameProps {
  className?: string;
  dotPlClassName?: string;
}

const BrandName: React.FC<BrandNameProps> = ({ className, dotPlClassName }) => {
  return (
    <span className={cn("font-black tracking-tighter uppercase", className)}>
      POLUTEK<span className={cn("text-[#1f7b88]", dotPlClassName)}>.PL</span>
    </span>
  );
};

export default BrandName;
