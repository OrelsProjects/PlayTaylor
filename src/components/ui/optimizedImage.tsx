import React, { useMemo } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  objectFit?: string;
  width?: number;
  height?: number;
  layout?: string;
  className: string;
  srcForOptimization?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fill,
  width,
  layout,
  height,
  objectFit,
  className,
  srcForOptimization,
}) => {
  const { resolvedTheme } = useTheme();

  const shouldOptimize = useMemo(
    () => resolvedTheme === "dark",
    [resolvedTheme],
  );

  const optimizedClassName = useMemo(
    () => (shouldOptimize ? "grayscale" : ""),
    [shouldOptimize],
  );

  const imageSrc = useMemo(
    () =>
      shouldOptimize ? (srcForOptimization ? srcForOptimization : src) : src,
    [shouldOptimize, src, srcForOptimization],
  );

  return fill ? (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      objectFit={objectFit}
      layout={layout}
      className={cn("!relative", optimizedClassName, className)}
    />
  ) : (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      objectFit={objectFit}
      layout={layout}
      className={cn(optimizedClassName, className)}
    />
  );
};

export default OptimizedImage;
