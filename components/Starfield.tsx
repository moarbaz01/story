"use client";

import { useEffect, useRef } from "react";

type StarfieldProps = { intensity?: "soft" | "full"; interactive?: boolean; className?: string };

type Star = { x: number; y: number; r: number; a: number; v: number; phase: number };
type Heart = { x: number; y: number; vx: number; vy: number; life: number; size: number };

export function Starfield({ intensity = "full", interactive = true, className = "" }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const hearts: Heart[] = [];
    let lastHeart = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((width * height) / (touch ? 16000 : 10500) * (intensity === "soft" ? 0.65 : 1));
      stars = Array.from({ length: Math.min(count, 170) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.25 + 0.25,
        a: Math.random() * 0.65 + 0.2,
        v: Math.random() * 0.035 + 0.008,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const addHeart = (x: number, y: number) => {
      if (hearts.length > 18) hearts.shift();
      hearts.push({ x, y, vx: (Math.random() - 0.5) * 0.45, vy: -0.5 - Math.random() * 0.45, life: 1, size: 4 + Math.random() * 5 });
    };

    const pointerMove = (event: PointerEvent) => {
      if (!interactive || reduced || touch || performance.now() - lastHeart < 90) return;
      addHeart(event.clientX, event.clientY);
      lastHeart = performance.now();
    };
    const pointerDown = (event: PointerEvent) => {
      if (!interactive || reduced || !touch) return;
      for (let i = 0; i < 5; i += 1) addHeart(event.clientX, event.clientY);
    };

    const heartPath = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.3);
      ctx.bezierCurveTo(x - size, y - size * 0.25, x - size * 0.55, y - size, x, y - size * 0.38);
      ctx.bezierCurveTo(x + size * 0.55, y - size, x + size, y - size * 0.25, x, y + size * 0.3);
      ctx.fill();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const alpha = reduced ? star.a : star.a * (0.72 + Math.sin(time * star.v * 0.01 + star.phase) * 0.28);
        ctx.fillStyle = `rgba(241,235,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = hearts.length - 1; i >= 0; i -= 1) {
        const heart = hearts[i];
        heart.x += heart.vx;
        heart.y += heart.vy;
        heart.life -= 0.018;
        if (heart.life <= 0) { hearts.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(247,132,179,${heart.life * 0.75})`;
        heartPath(heart.x, heart.y, heart.size * heart.life);
      }
      if (!reduced || hearts.length) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerdown", pointerDown, { passive: true });
    draw(0);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerdown", pointerDown);
    };
  }, [interactive, intensity]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`starfield ${className}`} />;
}
