"use client";

import React, { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

interface RoughProgressProps {
  progress: number; // 0 to 1
  className?: string;
}

export default function RoughProgress({ progress, className }: RoughProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous drawing
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const { width, height } = dimensions;
    const y = height / 2;

    // Draw background line (sketchy grey)
    const bgLine = rc.line(2, y, width - 2, y, {
      stroke: 'rgba(255, 255, 255, 0.2)',
      strokeWidth: 2,
      roughness: 1.2,
      bowing: 1.5,
    });
    svg.appendChild(bgLine);

    // Draw progress line (sketchy blue)
    if (progress > 0) {
      const progressWidth = Math.max(2, (width - 4) * progress);
      const progressLine = rc.line(2, y, progressWidth, y, {
        stroke: '#3b82f6',
        strokeWidth: 3,
        roughness: 2,
        bowing: 2,
      });
      svg.appendChild(progressLine);

      // Draw a small dot at the end of progress
      const thumb = rc.circle(progressWidth, y, 4, {
        stroke: '#3b82f6',
        fill: '#3b82f6',
        fillStyle: 'solid',
        roughness: 1.5,
      });
      svg.appendChild(thumb);
    }
  }, [progress, dimensions]);

  return (
    <svg
      ref={svgRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
