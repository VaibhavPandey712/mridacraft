import { useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const track = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin(
      `${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative overflow-hidden rounded-sm bg-secondary/60"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={track}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]}
            src={images[active]}
            alt={`${name} — view ${active + 1}`}
            width={1008}
            height={1008}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ transformOrigin: origin, transform: zoom ? "scale(1.7)" : "scale(1)" }}
            className="aspect-square w-full cursor-zoom-in object-cover transition-transform duration-500"
          />
        </AnimatePresence>
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
          Hover to zoom
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show view ${index + 1}`}
            className={cn(
              "overflow-hidden rounded-sm border transition-colors",
              index === active ? "border-clay" : "border-border hover:border-clay/60",
            )}
          >
            <img
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              loading="lazy"
              width={252}
              height={252}
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}