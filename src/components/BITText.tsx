import { motion, AnimatePresence } from "framer-motion";

export type BITPhase = "idle" | "expanding" | "expanded" | "merging";

interface Props {
  phase: BITPhase;
}

const EXTRA = {
  B: "uild.",
  I: "t.",
  T: "ogether.",
} as const;

export default function BITText({ phase }: Props) {
  const expanded = phase === "expanding" || phase === "expanded";

  const letterTransition = {
    duration: 0.55,
    ease: [0.65, 0, 0.35, 1] as const,
  };

  const renderLetter = (letter: keyof typeof EXTRA, index: number) => {
    const extra = EXTRA[letter];

    return (
      <span key={letter} className="inline-flex items-baseline">
        <motion.span
          layout
          transition={letterTransition}
          className="inline-block"
        >
          {letter}
        </motion.span>
        <AnimatePresence>
          {expanded && (
            <motion.span
              key={`${letter}-extra`}
              initial={{ opacity: 0, width: 0, filter: "blur(8px)", y: 10 }}
              animate={{
                opacity: 1,
                width: "auto",
                filter: "blur(0px)",
                y: 0,
              }}
              exit={{
                opacity: 0,
                width: 0,
                filter: "blur(8px)",
                y: 10,
              }}
              transition={{
                ...letterTransition,
                delay: phase === "expanding" ? 0.05 + index * 0.06 : 0,
              }}
              className="inline-block overflow-hidden whitespace-nowrap"
            >
              {extra}
            </motion.span>
          )}
        </AnimatePresence>
        {index < 2 && (
          <motion.span
            layout
            transition={letterTransition}
            className="inline-block"
          >
            {expanded ? "\u00A0" : ""}
          </motion.span>
        )}
      </span>
    );
  };

  return (
    <motion.h1
      layout
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      className="font-sans font-black tracking-tight text-white leading-none whitespace-nowrap select-none drop-shadow-[0_0_60px_rgba(59,130,246,0.12)]"
      style={{
        fontSize: "clamp(4.5rem, 14vw, 11rem)",
        letterSpacing: expanded ? "-0.04em" : "-0.05em",
      }}
    >
      {(["B", "I", "T"] as const).map((l, i) => renderLetter(l, i))}
    </motion.h1>
  );
}
