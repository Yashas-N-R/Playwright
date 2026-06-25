import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

interface Ripple {
  x: number;
  y: number;
  born: number;
}

export interface RippleOverlayHandle {
  splash: () => void;
}

const MAX_AGE = 4.0;

const RippleOverlay = forwardRef<RippleOverlayHandle>(function RippleOverlay(
  _,
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef(0);

  const splash = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.56;
    const now = performance.now();

    ripplesRef.current.push({ x: cx, y: cy, born: now });
    // soft trailing echo — same center, delayed start
    ripplesRef.current.push({ x: cx, y: cy, born: now + 220 });
  }, []);

  useImperativeHandle(ref, () => ({ splash }), [splash]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.born < MAX_AGE * 1000,
      );

      for (const ripple of ripplesRef.current) {
        const age = (now - ripple.born) / 1000;
        const speed = 95 * dpr;

        // 2 faint rings per splash — disturbance on black, not bright white
        for (let ring = 0; ring < 2; ring++) {
          const ringAge = Math.max(0, age - ring * 0.28);
          const radius = ringAge * speed;
          const fade = Math.max(0, 1 - ringAge / 2.6);
          const alpha = fade * fade * 0.038;

          if (alpha < 0.003 || radius < 2) continue;

          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.8 * dpr;
          ctx.stroke();

          // inner shadow ring — darker band just behind the wave front
          if (ringAge > 0.08) {
            const innerR = radius - 6 * dpr;
            const innerAlpha = alpha * 0.35;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, innerR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,0,0,${innerAlpha})`;
            ctx.lineWidth = 2 * dpr;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      aria-hidden="true"
    />
  );
});

export default RippleOverlay;
