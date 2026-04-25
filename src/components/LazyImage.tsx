import { useState } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspect?: string; // e.g. "4/5"
  containerClassName?: string;
  eager?: boolean;
}

/**
 * LazyImage renders a fixed-aspect container with a soft skeleton placeholder
 * so the layout never jumps and users always see something while images load.
 */
const LazyImage = ({
  aspect = "4/5",
  containerClassName,
  eager = false,
  className,
  onLoad,
  alt,
  ...rest
}: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", containerClassName)}
      style={{ aspectRatio: aspect }}
    >
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/70 to-muted"
        />
      )}
      <img
        {...rest}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        fetchPriority={eager ? "high" : "auto"}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
};

export default LazyImage;
