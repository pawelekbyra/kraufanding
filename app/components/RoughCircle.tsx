"use client";

import React, { useEffect, useRef } from 'react';
import { annotate } from 'rough-notation';

interface RoughCircleProps {
  children: React.ReactNode;
  show?: boolean;
  color?: string;
  strokeWidth?: number;
  padding?: number;
  className?: string;
}

export default function RoughCircle({
  children,
  show = true,
  color = "white",
  strokeWidth = 3,
  padding = 10,
  className
}: RoughCircleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const annotationRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    annotationRef.current = annotate(containerRef.current, {
      type: 'circle',
      color,
      strokeWidth,
      padding,
      iterations: 2,
    });

    if (show) {
      annotationRef.current.show();
    }

    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove();
      }
    };
  }, [color, strokeWidth, padding, show]);

  useEffect(() => {
    if (annotationRef.current) {
      if (show) {
        annotationRef.current.show();
      } else {
        annotationRef.current.hide();
      }
    }
  }, [show]);

  return (
    <div ref={containerRef} className={className} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}
