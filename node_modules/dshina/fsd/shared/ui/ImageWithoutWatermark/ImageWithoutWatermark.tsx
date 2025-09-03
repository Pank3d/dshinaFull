"use client";

import React from "react";
import Image from "next/image";

interface ImageWithoutWatermarkProps {
  imgBigMy?: string;
  imgBigPish?: string;
  imgSmall?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  useSmallImage?: boolean;
}

export const ImageWithoutWatermark: React.FC<ImageWithoutWatermarkProps> = ({
  imgBigMy,
  imgBigPish,
  imgSmall,
  alt,
  width,
  height,
  className,
  priority = false,
  useSmallImage = false,
}) => {
  // Определяем приоритет изображений: сначала без водяных знаков, потом с водяными знаками
  const getImageSrc = () => {
    if (useSmallImage && imgSmall) {
      return imgSmall;
    }
    
    // Приоритет: img_big_my (без водяных знаков) -> img_big_pish (с водяными знаками)
    return imgBigMy || imgBigPish || imgSmall || "";
  };

  const imageSrc = getImageSrc();

  if (!imageSrc) {
    return (
      <div 
        className={className}
        style={{ 
          width, 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          color: '#6c757d'
        }}
      >
        <span>Нет изображения</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
};