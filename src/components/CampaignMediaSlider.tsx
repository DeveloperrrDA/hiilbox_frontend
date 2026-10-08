"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface MediaItem {
  type: "video" | "image";
  url: string;
  thumbnail?: string;
}

export default function CampaignMediaSlider({ video, images, title, fallbackImage }: any) {
  const [activeIndex, setActiveIndex] = useState(0);

  const mediaList: MediaItem[] = [];

  // 1. Add Video First (if it exists)
  if (video?.id || video?.url) {
    const embedUrl = video.id
      ? `https://www.youtube.com/embed/${video.id}`
      : video.url.replace("watch?v=", "embed/");

    mediaList.push({
      type: "video",
      url: embedUrl,
    });
  }

  // 2. Add Images Next
  if (Array.isArray(images) && images.length > 0) {
    images.forEach((img: any) => {
      if (img?.url) {
        mediaList.push({
          type: "image",
          url: img.url,
          thumbnail: img.url,
        });
      }
    });
  }

  // 3. Fallback: If no images array exists but we have the extracted imageUrl
  if (mediaList.length === 0 && fallbackImage) {
    mediaList.push({
      type: "image",
      url: fallbackImage,
      thumbnail: fallbackImage,
    });
  }

  // Edge case: No media at all
  if (mediaList.length === 0) {
    return (
      <div className="relative mb-10 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[16px] bg-gray-100 text-sm text-gray-400">
        No media available
      </div>
    );
  }

  const activeMedia = mediaList[activeIndex];

  // --- Navigation Handlers ---
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-10">
      {/* Main Viewer */}
      <div className="group relative w-full aspect-[16/9] overflow-hidden rounded-[16px] bg-black">
        {activeMedia.type === "video" ? (
          <iframe
            src={activeMedia.url}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <img
            src={activeMedia.url}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Navigation Arrows (Only show if multiple items exist) */}
        {mediaList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-[#01A14B]"
              aria-label="Previous media"
            >
              <Icon icon="solar:alt-arrow-left-line-duotone" className="text-2xl" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-[#01A14B]"
              aria-label="Next media"
            >
              <Icon icon="solar:alt-arrow-right-line-duotone" className="text-2xl" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Slider */}
      {mediaList.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {mediaList.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-[60px] w-[90px] shrink-0 overflow-hidden rounded border-2 transition-all ${
                activeIndex === idx
                  ? "border-[#01A14B]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-[#e5e7eb]">
                  <Icon icon="solar:play-bold" className="text-3xl text-gray-700" />
                </div>
              ) : (
                <img
                  src={item.thumbnail}
                  alt={`Thumbnail ${idx}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}