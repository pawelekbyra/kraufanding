"use client";

import React, { useState, useEffect } from "react";
import { RoughNotation, RoughNotationProps } from "react-rough-notation";

interface DoodleWrapperProps extends Partial<RoughNotationProps> {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export default function DoodleWrapper({
  children,
  className,
  wrapperClassName,
  type = "box",
  show = true,
  animate = false,
  strokeWidth = 2,
  padding = 4,
  color = "#1a1a1a",
  ...props
}: DoodleWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={wrapperClassName}>{children}</div>;
  }

  return (
    <div className={wrapperClassName}>
      <RoughNotation
        type={type}
        show={show}
        animate={animate}
        strokeWidth={strokeWidth}
        padding={padding}
        color={color}
        {...props}
      >
        {children}
      </RoughNotation>
    </div>
  );
}
