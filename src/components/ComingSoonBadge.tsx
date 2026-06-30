import { animate } from "framer-motion";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

type Phase = "waiting" | "moving" | "blowoff" | "done";

const TRAVEL_S = 2.8;
const BLOWOFF_S = 0.75;
const BIRTH_END = 0.06;
const TAIL_GROW_END = 0.2;
const TAIL_LENGTH = 54;
const PARTICLE_COUNT = 14;

const MINI_SPARKLE = "M0 -4 0.9 -0.9 4 0 0.9 0.9 0 4 -0.9 0.9 -4 0 -0.9 -0.9Z";
const MAIN_SPARKLE = "M0 -7.5 1.6 -1.6 7.5 0 1.6 1.6 0 7.5 -1.6 1.6 -7.5 0 -1.6 -1.6Z";

const TAIL_SPARKS = [
  { frac: 0.2, scale: 0.3, opacity: 0.38 },
  { frac: 0.4, scale: 0.36, opacity: 0.52 },
  { frac: 0.58, scale: 0.42, opacity: 0.68 },
  { frac: 0.76, scale: 0.48, opacity: 0.82 },
  { frac: 0.92, scale: 0.55, opacity: 0.95 },
];

function buildPillPath(w: number, h: number) {
  const inset = 0.5;
  const left = inset;
  const top = inset;
  const right = w - inset;
  const bottom = h - inset;
  const br = (h - inset * 2) / 2;
  const cx = w / 2;

  return [
    `M ${cx} ${top}`,
    `L ${right - br} ${top}`,
    `A ${br} ${br} 0 0 1 ${right} ${top + br}`,
    `L ${right} ${bottom - br}`,
    `A ${br} ${br} 0 0 1 ${right - br} ${bottom}`,
    `L ${left + br} ${bottom}`,
    `A ${br} ${br} 0 0 1 ${left} ${bottom - br}`,
    `L ${left} ${top + br}`,
    `A ${br} ${br} 0 0 1 ${left + br} ${top}`,
    `L ${cx} ${top}`,
  ].join(" ");
}

function pathAngle(path: SVGPathElement, atLen: number) {
  const len = path.getTotalLength();
  const back = path.getPointAtLength(Math.max(0, atLen - 2.5));
  const ahead = path.getPointAtLength(Math.min(len, atLen + 2.5));
  return Math.atan2(ahead.y - back.y, ahead.x - back.x);
}

type TailPoint = { x: number; y: number; angle: number };

function sampleTail(path: SVGPathElement, headLen: number, tailSpan: number): TailPoint[] {
  const start = Math.max(0, headLen - tailSpan);
  const span = headLen - start;
  if (span < 0.5) return [];

  const steps = Math.max(10, Math.ceil(span / 2.5));
  const points: TailPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const at = start + (i / steps) * span;
    const p = path.getPointAtLength(at);
    points.push({ x: p.x, y: p.y, angle: pathAngle(path, at) });
  }

  return points;
}

function tailPathD(points: TailPoint[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
}

function pointOnTail(points: TailPoint[], frac: number) {
  if (points.length === 0) return null;
  if (points.length === 1) return points[0];

  const idx = frac * (points.length - 1);
  const i = Math.floor(idx);
  const j = Math.min(i + 1, points.length - 1);
  const f = idx - i;
  const a = points[i];
  const b = points[j];

  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    angle: a.angle + (b.angle - a.angle) * f,
  };
}

function buildFrame(path: SVGPathElement, t: number) {
  const length = path.getTotalLength();

  let headLen: number;
  let sparkleScale: number;
  let tailGrow: number;

  if (t <= BIRTH_END) {
    const b = t / BIRTH_END;
    headLen = 0;
    sparkleScale = 0.2 + b * 0.8;
    tailGrow = 0;
  } else if (t <= TAIL_GROW_END) {
    const g = (t - BIRTH_END) / (TAIL_GROW_END - BIRTH_END);
    headLen = g * length * 0.04;
    sparkleScale = 1;
    tailGrow = g;
  } else {
    const travel = (t - TAIL_GROW_END) / (1 - TAIL_GROW_END);
    headLen = length * 0.04 + travel * (length * 0.96);
    sparkleScale = 1;
    tailGrow = 1;
  }

  const head = path.getPointAtLength(headLen);
  const angle = pathAngle(path, headLen);
  const tailSpan = TAIL_LENGTH * tailGrow;
  const tailPoints = sampleTail(path, headLen, tailSpan);

  return {
    head: { x: head.x, y: head.y },
    angle,
    sparkleScale,
    tailGrow,
    tailPoints,
  };
}

function SparkleComet({
  head,
  angle,
  tailPoints,
  scale = 1,
  tailGrow = 1,
  opacity = 1,
  glowId,
  softGlowId,
}: {
  head: { x: number; y: number };
  angle: number;
  tailPoints: TailPoint[];
  scale?: number;
  tailGrow?: number;
  opacity?: number;
  glowId: string;
  softGlowId: string;
}) {
  const deg = (angle * 180) / Math.PI;
  const tailD = tailPoints.length > 1 ? tailPathD(tailPoints) : "";

  return (
    <g opacity={opacity}>
      {tailGrow > 0.05 && tailD && (
        <>
          <path
            d={tailD}
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${softGlowId})`}
            opacity={0.45 * tailGrow}
          />
          <path
            d={tailD}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {TAIL_SPARKS.map((s, i) => {
            const pt = pointOnTail(tailPoints, s.frac);
            if (!pt) return null;
            const sdeg = (pt.angle * 180) / Math.PI;
            return (
              <g
                key={i}
                transform={`translate(${pt.x} ${pt.y}) rotate(${sdeg}) scale(${s.scale * tailGrow})`}
                opacity={s.opacity * tailGrow}
                filter={`url(#${glowId})`}
              >
                <path fill="white" d={MINI_SPARKLE} />
              </g>
            );
          })}
        </>
      )}

      <g
        transform={`translate(${head.x} ${head.y}) rotate(${deg}) scale(${scale})`}
        filter={`url(#${glowId})`}
      >
        <path fill="white" d={MAIN_SPARKLE} />
      </g>
    </g>
  );
}

type Particle = { angle: number; dist: number; opacity: number; scale: number };

type MotionFrame = {
  head: { x: number; y: number };
  angle: number;
  sparkleScale: number;
  tailGrow: number;
  tailPoints: TailPoint[];
};

const EMPTY_FRAME: MotionFrame = {
  head: { x: 0, y: 0 },
  angle: 0,
  sparkleScale: 0,
  tailGrow: 0,
  tailPoints: [],
};

export default function ComingSoonBadge() {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [phase, setPhase] = useState<Phase>("waiting");
  const [frame, setFrame] = useState<MotionFrame>(EMPTY_FRAME);
  const [burst, setBurst] = useState({ ring: 0, ringOpacity: 0, flash: 0, particles: [] as Particle[] });
  const phaseRef = useRef<Phase>("waiting");
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  phaseRef.current = phase;

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: width, h: height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion.current) {
      setPhase("done");
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (phaseRef.current === "waiting" || phaseRef.current === "done") {
            setBurst({ ring: 0, ringOpacity: 0, flash: 0, particles: [] });
            setPhase("moving");
          }
        } else if (phaseRef.current === "done") {
          setPhase("waiting");
        }
      },
      { threshold: 0.55, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "moving" || size.w <= 0 || !pathRef.current) return;

    const path = pathRef.current;
    setFrame(buildFrame(path, 0));

    const controls = animate(0, 1, {
      duration: TRAVEL_S,
      ease: "linear",
      onUpdate: (progress) => setFrame(buildFrame(path, progress)),
      onComplete: () => {
        setFrame(buildFrame(path, 1));
        setPhase("blowoff");
      },
    });

    return () => controls.stop();
  }, [phase, size]);

  useEffect(() => {
    if (phase !== "blowoff") return;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (i / PARTICLE_COUNT) * Math.PI * 2 + 0.15,
      dist: 0,
      opacity: 0,
      scale: 0.35,
    }));

    const controls = animate(0, 1, {
      duration: BLOWOFF_S,
      ease: [0.15, 0.85, 0.25, 1],
      onUpdate: (v) => {
        setBurst({
          ring: 4 + v * 24,
          ringOpacity: v < 0.25 ? v / 0.25 : 1 - (v - 0.25) / 0.75,
          flash: v < 0.2 ? v / 0.2 : Math.max(0, 1 - (v - 0.2) / 0.35),
          particles: particles.map((p, i) => {
            const stagger = i * 0.03;
            const t = Math.max(0, Math.min(1, (v - stagger) / (1 - stagger)));
            return {
              ...p,
              dist: t * (12 + (i % 4) * 6),
              opacity: t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88,
              scale: 0.3 + t * 1.1,
            };
          }),
        });
      },
      onComplete: () => {
        setBurst({ ring: 0, ringOpacity: 0, flash: 0, particles: [] });
        setPhase("done");
      },
    });

    return () => controls.stop();
  }, [phase]);

  const { w, h } = size;
  const pathD = w > 0 ? buildPillPath(w, h) : "";
  const showSparkle = phase === "moving";
  const showBlowoff = phase === "blowoff";
  const endPoint = frame.head.x > 0 ? frame.head : { x: w / 2, y: 0.5 };
  const glowId = `cs-glow-${uid}`;
  const softGlowId = `cs-soft-${uid}`;

  return (
    <div ref={wrapRef} className="relative mb-4 inline-block">
      {w > 0 && !reducedMotion.current && (
        <svg
          className="pointer-events-none absolute inset-0 z-20 overflow-visible"
          width={w}
          height={h}
          aria-hidden
        >
          <defs>
            <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={softGlowId} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke={phase === "done" ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.14)"}
            strokeWidth={1}
            className="transition-[stroke] duration-700"
          />

          {showSparkle && (
            <SparkleComet
              head={frame.head}
              angle={frame.angle}
              tailPoints={frame.tailPoints}
              scale={frame.sparkleScale}
              tailGrow={frame.tailGrow}
              glowId={glowId}
              softGlowId={softGlowId}
            />
          )}

          {showBlowoff && (
            <g>
              <circle
                cx={endPoint.x}
                cy={endPoint.y}
                r={burst.ring}
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={1.5}
                opacity={burst.ringOpacity * 0.7}
              />
              <circle
                cx={endPoint.x}
                cy={endPoint.y}
                r={8 * burst.flash}
                fill="rgba(255,255,255,0.45)"
                filter={`url(#${softGlowId})`}
                opacity={burst.flash}
              />
              <SparkleComet
                head={endPoint}
                angle={frame.angle}
                tailPoints={frame.tailPoints}
                scale={1 + burst.flash * 1.5}
                tailGrow={1 - burst.flash * 0.8}
                opacity={burst.flash}
                glowId={glowId}
                softGlowId={softGlowId}
              />
              {burst.particles.map((p, i) => (
                <g
                  key={i}
                  transform={`translate(${endPoint.x + Math.cos(p.angle) * p.dist} ${endPoint.y + Math.sin(p.angle) * p.dist}) scale(${p.scale})`}
                  opacity={p.opacity}
                  filter={`url(#${glowId})`}
                >
                  <path fill="white" d={MINI_SPARKLE} />
                </g>
              ))}
            </g>
          )}
        </svg>
      )}

      <span
        className={`relative z-10 inline-flex rounded-full bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 transition-colors duration-700 ${
          phase === "done" ? "border border-white/30 text-white/75 shadow-[0_0_18px_rgba(255,255,255,0.08)]" : "border border-white/15"
        }`}
      >
        Coming Soon
      </span>
    </div>
  );
}
