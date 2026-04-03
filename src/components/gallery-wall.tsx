"use client";

import { useRef, useEffect, useCallback } from "react";

export interface GalleryItem {
  name: string;
  url: string;
  thumbUrl: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  { name: "Chase the Northern Lights", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80" },
  { name: "Sunset Sail in Santorini", url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&q=80" },
  { name: "Cherry Blossom Season in Tokyo", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80" },
  { name: "Safari at Sunrise in Kenya", url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&q=80" },
  { name: "Hike the Inca Trail", url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&q=80" },
  { name: "Cooking Class on Amalfi Coast", url: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=500&q=80" },
  { name: "Yoga Retreat in Bali", url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80" },
  { name: "Ski the Swiss Alps", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500&q=80" },
  { name: "Overwater Villa in Maldives", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80" },
  { name: "Trek Patagonia Glaciers", url: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=500&q=80", thumbUrl: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=500&q=80" },
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
    hoveredIndex: -1,
    mouseX: -9999,
    mouseInViewport: false,
    cardPositions: [] as number[],
    hoverAmounts: [] as number[], // 0 = not hovered, 1 = fully hovered (lerped)
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const cardWidth = isMobile ? 125 : 170;

  const animate = useCallback(() => {
    const s = stateRef.current;
    const vw = window.innerWidth;

    if (!s.isDragging) {
      s.targetScroll += s.velocity;
      s.velocity *= 0.95;
      if (s.hoveredIndex === -1) {
        s.targetScroll += 0.4; // auto-scroll (pause on hover)
      }
    }

    s.currentScroll += (s.targetScroll - s.currentScroll) * 0.08;

    const totalSetWidth = gallery.length * cardWidth;

    // Calculate card positions and find closest to mouse
    const centerX = vw / 2;
    s.cardPositions = [];

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      let virtualX = index * cardWidth - s.currentScroll;

      while (virtualX < -totalSetWidth / 2) virtualX += totalSetWidth;
      while (virtualX > totalSetWidth / 2) virtualX -= totalSetWidth;

      s.cardPositions[index] = centerX + virtualX;

      // Lerp hover amount (smooth transition)
      if (!s.hoverAmounts[index]) s.hoverAmounts[index] = 0;
      const targetHover = s.hoveredIndex === index ? 1 : 0;
      s.hoverAmounts[index] += (targetHover - s.hoverAmounts[index]) * 0.12;
      if (Math.abs(s.hoverAmounts[index] - targetHover) < 0.005) s.hoverAmounts[index] = targetHover;
      const h = s.hoverAmounts[index];

      if (Math.abs(virtualX) < vw) {
        card.style.display = "block";
        const progress = virtualX / (vw / 1.5);
        const z = -Math.pow(Math.abs(progress), 2) * 400;
        const rotateY = progress * 40;
        const baseOpacity = Math.max(0, 1 - Math.pow(Math.abs(progress), 2.5));

        const scale = 1 + h * 0.15;
        const lerpZ = z + h * 150;
        const lerpRotateY = rotateY * (1 - h);
        const lerpOpacity = baseOpacity + h * (1 - baseOpacity);

        card.style.transform = `translateX(${virtualX}px) translateZ(${lerpZ}px) rotateY(${lerpRotateY}deg) scale(${scale})`;
        card.style.opacity = String(lerpOpacity);
        card.style.zIndex = h > 0.1 ? "100" : "0";
      } else {
        card.style.display = "none";
      }
    });

    // Determine hovered card based on mouse proximity
    if (s.mouseInViewport && !s.isDragging) {
      const cw = vw < 768 ? 110 : 160;
      let closest = -1;
      let closestDist = cw * 0.6; // must be within ~60% of card width
      s.cardPositions.forEach((pos, i) => {
        const dist = Math.abs(s.mouseX - pos);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      s.hoveredIndex = closest;
    } else {
      s.hoveredIndex = -1;
    }

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

    const onViewportEnter = () => { s.mouseInViewport = true; };
    const onViewportLeave = () => { s.mouseInViewport = false; s.hoveredIndex = -1; };
    const onViewportMouseMove = (e: MouseEvent) => { s.mouseX = e.clientX; };

    viewport.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    viewport.addEventListener("mouseenter", onViewportEnter);
    viewport.addEventListener("mouseleave", onViewportLeave);
    viewport.addEventListener("mousemove", onViewportMouseMove);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    s.rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(s.rafId);
      viewport.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      viewport.removeEventListener("mouseenter", onViewportEnter);
      viewport.removeEventListener("mouseleave", onViewportLeave);
      viewport.removeEventListener("mousemove", onViewportMouseMove);
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
            className="absolute top-1/2 left-1/2 w-[110px] h-[145px] md:w-[160px] md:h-[200px] -ml-[55px] -mt-[72px] md:-ml-[80px] md:-mt-[100px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300"
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
