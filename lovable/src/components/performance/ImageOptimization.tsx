import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from './LazyLoadWrapper';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc = '/placeholder-property.jpg',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isIntersecting, hasIntersected } = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px',
  });

  const shouldLoad = priority || hasIntersected;

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallbackSrc);
    onError?.();
  };

  // Generate responsive image URLs (in a real app, you'd use a service like Cloudinary)
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc || hasError) return '';
    
    // For demo purposes, assuming we have different sizes
    // In production, you'd integrate with an image optimization service
    const sizes = [480, 768, 1024, 1280, 1600];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  };

  const imageClasses = cn(
    'transition-opacity duration-300',
    isLoaded ? 'opacity-100' : 'opacity-0',
    className
  );

  const containerClasses = cn(
    'relative overflow-hidden',
    !isLoaded && placeholder === 'blur' && 'bg-muted'
  );

  return (
    <div className={containerClasses} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder === 'blur' && blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-110"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      )}

      {/* Main Image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={imageSrc}
          srcSet={generateSrcSet(imageSrc)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Loading overlay */}
      {shouldLoad && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}

// Component for property image galleries with progressive loading
export function PropertyImageGallery({ 
  images, 
  alt, 
  className = '' 
}: { 
  images: string[]; 
  alt: string; 
  className?: string; 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn('aspect-video bg-muted flex items-center justify-center', className)}>
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">🏠</div>
          <p>Ingen bild tillgänglig</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Main Image */}
      <OptimizedImage
        src={images[currentIndex]}
        alt={`${alt} - Bild ${currentIndex + 1}`}
        className="aspect-video w-full object-cover rounded-lg"
        priority={currentIndex === 0}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            aria-label="Föregående bild"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            aria-label="Nästa bild"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors',
                index === currentIndex ? 'border-primary' : 'border-transparent'
              )}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} - Miniatyr ${index + 1}`}
                className="w-full h-full object-cover"
                width={80}
                height={64}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}