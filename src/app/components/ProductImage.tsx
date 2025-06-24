import { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  fallbackId?: string | number;
  className?: string;
  width?: number;
  height?: number;
}

export default function ProductImage({ 
  src, 
  alt, 
  fallbackId = 1, 
  className = "w-full h-48 object-cover",
  width = 400,
  height = 300
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // URL de fallback usando Picsum Photos
  const fallbackUrl = `https://picsum.photos/${width}/${height}?random=${fallbackId}`;
  
  // URL final: usar la imagen original si existe y no hay error, sino usar fallback
  const finalSrc = (src && !imageError) ? src : fallbackUrl;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={`${className} ${imageLoading ? 'hidden' : ''}`}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
} 