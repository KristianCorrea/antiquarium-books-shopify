"use client";

import { useRef } from "react";
import { CollectionCard } from '@/components/collection-card';

interface CollectionCarouselProps {
  collections: any[];
}

export default function CollectionCarousel({ collections }: CollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollGroups = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const viewportWidth = scrollRef.current.clientWidth; // one “group” = width of visible area
    scrollRef.current.scrollBy({
      left: direction === "left" ? -viewportWidth : viewportWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={() => scrollGroups("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full px-3 py-2 text-xl"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scrollGroups("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full px-3 py-2 text-xl"
      >
        ›
      </button>

      {/* Carousel Container */}
      <div ref={scrollRef} className="overflow-x-auto scroll-smooth no-scrollbar">
        <div className="flex gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="
                shrink-0
                w-[85%]       /* mobile: 1 at a time */
                sm:w-[45%]    /* tablet: 2 at a time */
                lg:w-[30%]    /* desktop: 3 at a time */
              "
            >
              <CollectionCard collection={collection} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
