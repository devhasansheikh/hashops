"use client";

import { Button } from "./Button";
import { useBooking } from "@/components/providers/BookingProvider";
import { cn } from "@/lib/utils";

interface BookButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  withArrow?: boolean;
  className?: string;
}

export function BookButton({
  children = "Book your Ops Strategy Call",
  variant = "primary",
  size = "md",
  withArrow = true,
  className,
}: BookButtonProps) {
  const { open } = useBooking();
  return (
    <Button
      variant={variant}
      size={size}
      withArrow={withArrow}
      onClick={open}
      className={cn(className)}
    >
      {children}
    </Button>
  );
}
