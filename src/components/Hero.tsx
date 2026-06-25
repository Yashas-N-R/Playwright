import { useCallback, useEffect, useRef, useState } from "react";
import WaterScene, { WaterSceneHandle } from "./water/WaterScene";
import RippleOverlay, { RippleOverlayHandle } from "./water/RippleOverlay";
import BITText, { BITPhase } from "./BITText";

export default function Hero() {
  const sceneRef = useRef<WaterSceneHandle>(null);
  const rippleRef = useRef<RippleOverlayHandle>(null);
  const [phase, setPhase] = useState<BITPhase>("idle");
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const triggerSequence = useCallback(() => {
    clearTimers();
    setPhase("idle");
    sceneRef.current?.dropDroplet();
  }, [clearTimers]);

  const onImpact = useCallback(() => {
    rippleRef.current?.splash();
    setPhase("expanding");
    timersRef.current.push(
      window.setTimeout(() => setPhase("expanded"), 900),
      window.setTimeout(() => setPhase("merging"), 3200),
      window.setTimeout(() => setPhase("idle"), 4100),
    );
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => triggerSequence(), 700);
    return () => {
      window.clearTimeout(initial);
      clearTimers();
    };
  }, [triggerSequence, clearTimers]);

  return (
    <section
      id="top"
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <WaterScene ref={sceneRef} onImpact={onImpact} />
      </div>

      <RippleOverlay ref={rippleRef} />

      {/* subtle vignette only — no colored glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none">
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.4em] text-white/40 mb-8 uppercase">
          Build It Together
        </p>

        <button
          onClick={triggerSequence}
          className="pointer-events-auto group cursor-pointer select-none focus:outline-none"
          aria-label="Trigger water ripple animation"
        >
          <BITText phase={phase} />
        </button>

        <p className="mt-10 text-white/70 text-sm sm:text-base tracking-wide italic font-light">
          QA by profession, developer by passion.
        </p>

        <p className="mt-3 text-white/30 text-xs font-mono tracking-[0.25em] uppercase">
          Click <span className="text-white/70">BIT</span> to ripple again
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-10 pointer-events-none">
        <span className="text-[10px] font-mono tracking-[0.3em]">SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
