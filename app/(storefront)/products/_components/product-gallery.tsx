'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface MediaImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

interface ProductGalleryProps {
  images: MediaImage[];
  productTitle: string;
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    checkScrollPosition();
    carousel.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      carousel.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, images]);

  // Empty state
  if (images.length === 0) {
    return <div className="aspect-[3/4] lg:aspect-[5/4] rounded-3xl bg-parchment" />;
  }

  const selectedImage = images[selectedIndex];

  // Single image - just show it
  if (images.length === 1) {
    return (
      <div className="relative aspect-[3/4] lg:aspect-[5/4] overflow-hidden rounded-3xl bg-parchment">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText ?? productTitle}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  // Multiple images - main image + carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 120; // thumbnail width + gap
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full space-y-4 overflow-hidden">
      {/* Main Image */}
      <div className="relative aspect-[3/4] lg:aspect-[5/4] overflow-hidden rounded-3xl bg-parchment">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText ?? productTitle}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scrollCarousel('left')}
          disabled={!canScrollLeft}
          className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full shadow-md transition-all ${
            canScrollLeft
              ? 'bg-white/90 hover:bg-white hover:shadow-lg'
              : 'cursor-default bg-white/50 shadow-none'
          }`}
          aria-label="Scroll images left"
        >
          <svg
            className={`h-5 w-5 transition-colors ${canScrollLeft ? 'text-ink' : 'text-black/20'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Thumbnails Container */}
        <div
          ref={carouselRef}
          className="scrollbar-hide mx-2 px-1 flex min-w-0 flex-1 gap-3 overflow-x-auto scroll-smooth"
        >
          {images.map((image, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative my-1 aspect-[3/4] w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all ${
                idx === selectedIndex
                  ? 'ring-2 ring-ink ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === selectedIndex ? 'true' : 'false'}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${productTitle} - Image ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scrollCarousel('right')}
          disabled={!canScrollRight}
          className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full shadow-md transition-all ${
            canScrollRight
              ? 'bg-white/90 hover:bg-white hover:shadow-lg'
              : 'cursor-default bg-white/50 shadow-none'
          }`}
          aria-label="Scroll images right"
        >
          <svg
            className={`h-5 w-5 transition-colors ${canScrollRight ? 'text-ink' : 'text-black/20'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

