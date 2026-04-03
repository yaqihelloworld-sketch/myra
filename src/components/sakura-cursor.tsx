"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function SakuraCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const lastMouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    // Only on desktop (no touch)
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window || window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const spawnPetal = () => {
      const m = mouseRef.current;
      const lm = lastMouseRef.current;
      const dx = m.x - lm.x;
      const dy = m.y - lm.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed < 2) return; // Only spawn when moving

      const petal: Petal = {
        x: m.x + (Math.random() - 0.5) * 10,
        y: m.y + (Math.random() - 0.5) * 10,
        size: 4 + Math.random() * 5,
        speedX: (Math.random() - 0.5) * 1.2 - dx * 0.02,
        speedY: 0.3 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        opacity: 0.7 + Math.random() * 0.3,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      };
      petalsRef.current.push(petal);
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity * (1 - p.life / p.maxLife);

      // Draw a sakura petal shape
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.8, -s * 0.8, s * 0.6, s * 0.2, 0, s * 0.5);
      ctx.bezierCurveTo(-s * 0.6, s * 0.2, -s * 0.8, -s * 0.8, 0, -s);
      ctx.fillStyle = `hsl(${340 + Math.random() * 10}, 60%, ${82 + Math.random() * 8}%)`;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current++;

      if (frameRef.current % 3 === 0) {
        spawnPetal();
      }

      petalsRef.current = petalsRef.current.filter((p) => {
        p.x += p.speedX + Math.sin(p.life * 0.05) * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.life++;
        p.speedX *= 0.99;

        if (p.life >= p.maxLife) return false;

        drawPetal(p);
        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      aria-hidden="true"
    />
  );
}
