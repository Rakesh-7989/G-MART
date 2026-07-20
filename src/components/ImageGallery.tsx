"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const hasMultiple = images.length > 1;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[3/4] bg-[#efefef] overflow-hidden cursor-crosshair"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[selected]}
          alt={name}
          fill
          className={`object-cover transition-transform duration-200 ${zoomed ? "scale-150" : "scale-100"}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          style={
            zoomed
              ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
              : undefined
          }
        />
      </div>

      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-20 h-20 flex-shrink-0 border transition-colors ${
                i === selected
                  ? "border-ink"
                  : "border-transparent hover:border-terracotta/50"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
