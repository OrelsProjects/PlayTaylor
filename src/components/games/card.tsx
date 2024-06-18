import React from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={cn(
      "card justify-center items-center",
      className,
    )}
  >
    {children}
  </div>
);

export default Card;
