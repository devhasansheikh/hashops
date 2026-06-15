"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  arrowIcon?: React.ReactNode;
}

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.9rem]",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-[54px] px-7 text-[1rem]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      withArrow,
      arrowIcon,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          variant === "primary" ? "btn-primary" : "btn-secondary",
          sizes[size],
          "select-none",
          className,
        )}
        {...props}
      >
        {children}
        {withArrow &&
          (arrowIcon ?? (
            <ArrowRight className="btn-arrow h-[1.05em] w-[1.05em] opacity-90" />
          ))}
      </button>
    );
  },
);
Button.displayName = "Button";
