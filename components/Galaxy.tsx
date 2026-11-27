"use client";

import { useEffect, useRef } from "react";

// Funkelnde Galaxie als Hintergrund: Nebel aus Farbverläufen (CSS, siehe
// .galaxy in globals.css), darüber ein Canvas mit funkelnden Sternen, einem
// leicht gedrehten Milchstraßen-Band und ab und zu einer Sternschnuppe.

type Star = { x: number; y: number; r: number; phase: number; speed: number; hue: number; base: number };
type Shooter = { x: number; y: number; vx: number; vy: number; life: number };

export function Galaxy({ always = false }: { always?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let shooter: Shooter | null = null;
    let w = 0;
    let h = 0;
    let raf = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 1300);
      const band = Math.round(count * 0.8);
      stars = [];
      // verstreute Sterne
      for (let i = 0; i < count; i++) stars.push(makeStar(rand(0, w), rand(0, h)));
      // dichteres Band quer über den Bildschirm (Milchstraße)
      for (let i = 0; i < band; i++) {
        const t = Math.random();
        const x = t * w;
        const y = h * 0.62 - t * h * 0.34 + gauss() * h * 0.09;
        stars.push(makeStar(x, y, 0.8));
      }
    };

    function makeStar(x: number, y: number, scale = 1): Star {
      const big = Math.random() < 0.06;
      return {
        x,
        y,
        r: (big ? rand(1.3, 2.2) : rand(0.4, 1.2)) * scale,
        phase: rand(0, Math.PI * 2),
        speed: rand(0.6, 2.4),
        hue: [0, 220, 250, 280, 40][Math.floor(Math.random() * 5)],
        base: rand(0.5, 1),
      };
    }

    let last = 0;
    const draw = (time: number) => {
      if (!still && time - last < 33) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = time;
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = still ? 1 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const a = s.base * tw;
        ctx.fillStyle = s.hue === 0 ? `rgba(255,255,255,${a})` : `hsla(${s.hue},90%,85%,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        // große Sterne bekommen ein Funkel-Kreuz
        if (s.r > 1.2 && tw > 0.75) {
          const len = s.r * 5 * tw;
          ctx.strokeStyle = `rgba(255,255,255,${a * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      }
      if (!still) {
        if (!shooter && Math.random() < 0.004) {
          shooter = { x: rand(w * 0.2, w), y: rand(0, h * 0.4), vx: -rand(6, 10), vy: rand(2, 4), life: 1 };
        }
        if (shooter) {
          const s = shooter;
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
          g.addColorStop(0, `rgba(255,255,255,${s.life})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10);
          ctx.stroke();
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.015;
          if (s.life <= 0 || s.x < -100 || s.y > h + 100) shooter = null;
        }
        raf = requestAnimationFrame(draw);
      }
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const onVisible = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    setup();
    start();
    window.addEventListener("resize", setup);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setup);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div className={always ? "galaxy galaxy-always" : "galaxy"} aria-hidden>
      <canvas ref={ref} />
    </div>
  );
}
