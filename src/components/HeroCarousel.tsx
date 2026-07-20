"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length, next]);

  return (
    <section
      className="relative h-[70vh] min-h-[500px] bg-ink overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-ink/30" />
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-6 font-medium">
            {slides[current].subtitle}
          </p>
          <h1 className="text-5xl md:text-7xl text-white leading-tight mb-6 font-bold font-serif">
            {slides[current].title.split("Meets")[0]}
            <br />
            <span className="text-terracotta">
              Meets {slides[current].title.split("Meets")[1]}
            </span>
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            {slides[current].description}
          </p>
          <div className="flex gap-4">
            <Link href={slides[current].cta.href} className="btn-primary">
              {slides[current].cta.text}
            </Link>
            {slides[current].secondaryCta && (
              <Link
                href={slides[current].secondaryCta.href}
                className="btn-outline border-white text-white hover:bg-white hover:text-ink"
              >
                {slides[current].secondaryCta.text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-white w-6" : "bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
