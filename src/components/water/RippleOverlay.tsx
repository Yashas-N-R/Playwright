import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

interface Ripple {
  cx: number;
  cy: number;
  born: number;
}

export interface RippleOverlayHandle {
  splash: () => void;
}

const RING_COUNT = 4;
const MAX_AGE_S = 5.5;
const RING_STAGGER_S = 0.22;
const SPEED_PX_S = 130; // px/s expansion per ring
const MAX_ALPHA = 0.22;  // visible but not harsh

const RippleOverlay = forwardRef<RippleOverlayHandle>(function RippleOverlay(
  _,
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef(0);
  const dprRef = useRef(1);

  const getSplashPoint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { cx: 0, cy: 0 };
    // droplet lands at horizontal center, roughly 56% down the screen
    return {
      cx: canvas.width / 2,
      cy: canvas.height * 0.56,
    };
  }, []);

  const splash = useCallback(() => {
    const { cx, cy } = getSplashPoint();
    ripplesRef.current.push({ cx, cy, born: performance.now() });
  }, [getSplashPoint]);

  useImperativeHandle(ref, () => ({ splash }), [splash]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dprRef.current;
      canvas.height = rect.height * dprRef.current;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const dpr = dprRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // prune old ripples
      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.born < MAX_AGE_S * 1000,
      );

      for (const ripple of ripplesRef.current) {
        const ageSec = (now - ripple.born) / 1000;

        for (let ring = 0; ring < RING_COUNT; ring++) {
          const ringAge = ageSec - ring * RING_STAGGER_S;
          if (ringAge <= 0) continue;

          const progress = ringAge / (MAX_AGE_S - ring * RING_STAGGER_S);
          if (progress >= 1) continue;

          const radius = ringAge * SPEED_PX_S * dpr;
          // Ease out: starts bright, fades as it expands
          const fadeIn = Math.min(ringAge / 0.12, 1);
          const fadeOut = 1 - progress;
          const alpha = MAX_ALPHA * fadeIn * fadeOut * fadeOut;

          if (alpha < 0.005 || radius < 1) continue;

          // Thin bright outer ring — the wave crest
          ctx.beginPath();
          ctx.arc(ripple.cx, ripple.cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180, 215, 255, ${alpha})`;
          ctx.lineWidth = 1.5 * dpr;
          ctx.stroke();

          // Slightly larger, very faint outer glow
          ctx.beginPath();
          ctx.arc(ripple.cx, ripple.cy, radius + 3 * dpr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(120, 180, 240, ${alpha * 0.35})`;
          ctx.lineWidth = 3 * dpr;
          ctx.stroke();

          // Inner trough: dark shadow ring just inside the crest
          if (radius > 8 * dpr) {
            ctx.beginPath();
            ctx.arc(ripple.cx, ripple.cy, radius - 5 * dpr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.45})`;
            ctx.lineWidth = 4 * dpr;
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
