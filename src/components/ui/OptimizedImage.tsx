import React, { useMemo } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width: number;
  height: number;
  className: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fill,
  width,
  height,
  className,
}) => {
  const { theme, systemTheme } = useTheme();

  const optimizedClassName = useMemo(() => {
    const isDark =
      theme === "system" ? systemTheme === "dark" : theme === "dark";
    return isDark ? "grayscale" : "";
  }, [theme]);

  return fill ? (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn(optimizedClassName, className)}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(optimizedClassName, className)}
    />
  );
};

export default OptimizedImage;
