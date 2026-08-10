"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RotateCw, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [zoomed, setZoomed] = useState(false);
  const [mode, setMode] = useState<"gallery" | "360">("gallery");
  const dragState = useRef<{ startX: number; startIndex: number } | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (mode !== "360") return;
    dragState.current = { startX: e.clientX, startIndex: active };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (mode !== "360" || !dragState.current) return;
    const delta = e.clientX - dragState.current.startX;
    const step = Math.round(delta / 40);
    let next = (dragState.current.startIndex + step) % images.length;
    if (next < 0) next += images.length;
    setActive(next);
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleTapZoom(e: React.MouseEvent<HTMLDivElement>) {
    // Touch devices don't fire hover — use a tap to toggle zoom centered
    // on the tap point instead.
    if (mode !== "gallery" || !window.matchMedia("(hover: none)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
    setZoomed((z) => !z);
  }

  return (
    <div>
      <div
        onMouseEnter={() => mode === "gallery" && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={mode === "gallery" ? handleMouseMove : undefined}
        onClick={handleTapZoom}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
          "relative aspect-square overflow-hidden rounded-2xl bg-ivory shadow-soft",
          mode === "360" ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        )}
      >
        <Image
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          fill
          sizes="(min-width: 1024px) 45vw, 90vw"
          priority
          className="object-cover transition-transform duration-200 ease-out"
          style={
            zoomed
              ? { transform: "scale(1.9)", transformOrigin: zoomOrigin }
              : undefined
          }
        />

        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={() => setMode((m) => (m === "360" ? "gallery" : "360"))}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-soft backdrop-blur",
              mode === "360" ? "bg-maroon-600 text-ivory" : "bg-ivory/90 text-maroon-700"
            )}
          >
            <RotateCw size={13} /> 360°
          </button>
        </div>

        {mode === "gallery" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1.5 text-xs font-medium text-brown-700/70 shadow-soft">
            <ZoomIn size={13} />
            <span className="[@media(hover:none)]:hidden">Hover to zoom</span>
            <span className="hidden [@media(hover:none)]:inline">Tap to zoom</span>
          </div>
        )}
        {mode === "360" && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ivory/90 px-3 py-1.5 text-xs font-medium text-brown-700/70 shadow-soft">
            Drag to rotate
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);
              setMode("gallery");
            }}
            className={cn(
              "relative h-18 w-18 shrink-0 overflow-hidden rounded-xl ring-2 transition-all",
              active === i && mode === "gallery" ? "ring-maroon-600" : "ring-transparent hover:ring-sandalwood"
            )}
            style={{ width: 72, height: 72 }}
          >
            <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
