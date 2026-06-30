import { useCallback, useEffect, useRef, useState } from "react";
import WaterScene, { WaterSceneHandle } from "./water/WaterScene";
import BITText, { BITPhase } from "./BITText";

export default function Hero() {
  const sceneRef   = useRef<WaterSceneHandle>(null);
  const [phase, setPhase] = useState<BITPhase>("hidden");
  const timersRef  = useRef<number[]>([]);
  const autoStartedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const triggerSequence = useCallback(() => {
    clearTimers();
    setPhase("hidden");
    sceneRef.current?.dropDroplet();
  }, [clearTimers]);

  const handleSceneReady = useCallback(() => {
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    triggerSequence();
  }, [triggerSequence]);

  const onImpact = useCallback(() => {
    setPhase("expanding");
    timersRef.current.push(
      window.setTimeout(() => setPhase("expanded"), 700),
      window.setTimeout(() => setPhase("merging"), 2500),
      window.setTimeout(() => setPhase("idle"), 3300),
    );
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <section
      id="top"
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* 3D canvas fills the whole hero — water plane + droplet */}
      <div className="absolute inset-0">
        <WaterScene ref={sceneRef} onImpact={onImpact} onReady={handleSceneReady} />
      </div>

      {/* Vignette — keeps edges dark, no coloured tint */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 35%, rgba(0,0,0,0.62) 100%)",
        }}
      />

      {/* Text overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none">
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.4em] text-white/40 mb-8 uppercase">
         Why pay business's when you can build your product?
        </p>

        <button
          onClick={triggerSequence}
          className="pointer-events-auto cursor-pointer select-none focus:outline-none"
          aria-label="Trigger water ripple animation"
        >
          <BITText phase={phase} />
        </button>

        <p className="mt-10 text-white/70 text-sm sm:text-base tracking-wide italic font-light">
          Turn your prototype to production ready.
        </p>

        {/* <p className="mt-3 text-white/30 text-xs font-mono tracking-[0.25em] uppercase">
          Click <span className="text-white/70">BIT</span> to ripple again
        </p> */}
      </div>
    </section>
  );
}
