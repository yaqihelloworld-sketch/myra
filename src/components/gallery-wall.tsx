"use client";

import { useRef, useEffect, useCallback } from "react";

export interface GalleryItem {
  name: string;
  url: string;
  thumbUrl: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  { name: "Northern Lights, Iceland", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&q=60" },
  { name: "Santorini, Greece", url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&q=60" },
  { name: "Cherry Blossoms, Tokyo", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&q=60" },
  { name: "Safari, Kenya", url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&q=60" },
  { name: "Machu Picchu, Peru", url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=300&q=60" },
  { name: "Amalfi Coast, Italy", url: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=300&q=60" },
  { name: "Bali Temples", url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=60" },
  { name: "Swiss Alps", url: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=300&q=60" },
  { name: "Maldives Overwater", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&q=60" },
  { name: "Patagonia, Argentina", url: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=300&q=60" },
];

interface GalleryWallProps {
  items?: GalleryItem[];
}

export default function GalleryWall({ items }: GalleryWallProps) {
  const gallery = items && items.length > 0 ? items : DEFAULT_GALLERY;
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const stateRef = useRef({
    currentScroll: 0,
    targetScroll: 0,
    isDragging: false,
    lastX: 0,
    velocity: 0,
    rafId: 0,
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const cardWidth = isMobile ? 125 : 170;

  const animate = useCallback(() => {
    const s = stateRef.current;
    const vw = window.innerWidth;

    if (!s.isDragging) {
      s.targetScroll += s.velocity;
      s.velocity *= 0.95;
      s.targetScroll += 0.4; // auto-scroll
    }

    s.currentScroll += (s.targetScroll - s.currentScroll) * 0.08;

    const totalSetWidth = gallery.length * cardWidth;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      let virtualX = index * cardWidth - s.currentScroll;

      while (virtualX < -totalSetWidth / 2) virtualX += totalSetWidth;
      while (virtualX > totalSetWidth / 2) virtualX -= totalSetWidth;

      if (Math.abs(virtualX) < vw) {
        card.style.display = "block";
        const progress = virtualX / (vw / 1.5);
        const z = -Math.pow(Math.abs(progress), 2) * 400;
        const rotateY = progress * 40;
        const opacity = Math.max(0, 1 - Math.pow(Math.abs(progress), 2.5));

        card.style.transform = `translateX(${virtualX}px) translateZ(${z}px) rotateY(${rotateY}deg)`;
        card.style.opacity = String(opacity);
      } else {
        card.style.display = "none";
      }
    });

    s.rafId = requestAnimationFrame(animate);
  }, [gallery.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const s = stateRef.current;

    const onMouseDown = (e: MouseEvent) => {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.velocity = 0;
      viewport.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      s.isDragging = false;
      viewport.style.cursor = "grab";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!s.isDragging) return;
      const delta = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.targetScroll -= delta * 1.5;
      s.velocity = -delta * 0.5;
    };
    const onTouchStart = (e: TouchEvent) => {
      s.isDragging = true;
      s.lastX = e.touches[0].clientX;
      s.velocity = 0;
    };
    const onTouchEnd = () => {
      s.isDragging = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!s.isDragging) return;
      const x = e.touches[0].clientX;
      const delta = x - s.lastX;
      s.lastX = x;
      s.targetScroll -= delta * 1.5;
      s.velocity = -delta * 0.5;
    };

    viewport.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    s.rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(s.rafId);
      viewport.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      viewport.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [animate]);

  return (
    <div
      ref={viewportRef}
      className="relative w-full h-[22vh] md:h-[28vh] cursor-grab active:cursor-grabbing overflow-visible"
      style={{ perspective: "1200px" }}
    >
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {gallery.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            ref={(el) => { if (el) cardsRef.current[i] = el; }}
            className="absolute top-1/2 left-1/2 w-[110px] h-[145px] md:w-[160px] md:h-[200px] -ml-[55px] -mt-[72px] md:-ml-[80px] md:-mt-[100px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-shadow duration-300"
            style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover block"
              style={{ filter: "grayscale(15%) contrast(95%)" }}
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2.5">
              <p className="text-white text-[10px] md:text-xs tracking-wide font-medium truncate">
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
