import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  hue: number;
}

interface StarfieldProps {
  className?: string;
  intensity?: "hero" | "ambient";
}

export function Starfield({ className, intensity = "hero" }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.innerWidth < 768;
    const baseCount =
      intensity === "ambient" ? (isMobile ? 220 : 500) : isMobile ? 700 : 1800;
    const stars: Star[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    let last = performance.now();

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      stars.length = 0;
      for (let i = 0; i < baseCount; i++) {
        const z = Math.random();
        const r = z * 1.4 + 0.2;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r,
          baseAlpha: 0.25 + z * 0.6,
          twinkleSpeed: 0.0005 + Math.random() * 0.0015,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.015 * (z + 0.1),
          vy: (Math.random() - 0.5) * 0.015 * (z + 0.1),
          // subtle color: white, faint violet, faint teal
          hue: Math.random() < 0.85 ? 0 : Math.random() < 0.5 ? 265 : 165,
        });
      }
    };

    const drawCore = () => {
      const cx = width * 0.5;
      const cy = height * (intensity === "hero" ? 0.55 : 0.5);
      const radius = Math.min(width, height) * (intensity === "hero" ? 0.5 : 0.35);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, "rgba(94, 79, 200, 0.22)");
      grad.addColorStop(0.35, "rgba(84, 224, 168, 0.08)");
      grad.addColorStop(1, "rgba(5, 6, 13, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;

      ctx.clearRect(0, 0, width, height);
      drawCore();

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!reducedMotion) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.twinklePhase += s.twinkleSpeed * dt;
          if (s.x < -2) s.x = width + 2;
          if (s.x > width + 2) s.x = -2;
          if (s.y < -2) s.y = height + 2;
          if (s.y > height + 2) s.y = -2;
        }
        const tw = reducedMotion ? 1 : 0.55 + Math.sin(s.twinklePhase) * 0.45;
        const alpha = Math.max(0, Math.min(1, s.baseAlpha * tw));

        if (s.hue === 0) {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        } else if (s.hue === 265) {
          ctx.fillStyle = `rgba(180,168,255,${alpha})`;
        } else {
          ctx.fillStyle = `rgba(150,240,210,${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        rafId = requestAnimationFrame(tick);
      }
    };

    resize();
    seed();
    last = performance.now();
    tick(last);
    if (reducedMotion) {
      // draw a single frame, no animation
    }

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
