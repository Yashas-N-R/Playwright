import { motion, AnimatePresence } from "framer-motion";

export type BITPhase =
  | "hidden"
  | "idle"
  | "expanding"
  | "expanded"
  | "merging";

interface Props {
  phase: BITPhase;
}

const EXTRA = {
  B: "uild",
  I: "t",
  T: "ogether",
} as const;

export default function BITText({ phase }: Props) {
  const expanded = phase === "expanding" || phase === "expanded";
  const wrapTogether =
    phase === "expanding" || phase === "expanded" || phase === "merging";
  const hidden = phase === "hidden";

  const letterTransition = {
    duration: 0.55,
    ease: [0.65, 0, 0.35, 1] as const,
  };

  const renderLetter = (letter: keyof typeof EXTRA, index: number) => {
    const extra = EXTRA[letter];
    const isTogether = letter === "T";

    const content = (
      <span className="inline-flex items-baseline">
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
            className={`inline-block ${expanded ? "hidden sm:inline-block" : ""}`}
          >
            {expanded ? "\u00A0" : ""}
          </motion.span>
        )}
      </span>
    );

    if (isTogether && wrapTogether) {
      return (
        <span
          key={letter}
          className="basis-full flex justify-center sm:basis-auto sm:inline-flex sm:items-baseline"
        >
          {content}
        </span>
      );
    }

    return (
      <span key={letter} className="inline-flex items-baseline">
        {content}
      </span>
    );
  };

  return (
    <motion.h1
      layout
      initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
      animate={{
        opacity: hidden ? 0 : 1,
        scale: hidden ? 0.92 : 1,
        filter: hidden ? "blur(10px)" : "blur(0px)",
      }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      className={`font-sans font-black tracking-tight text-white leading-none select-none ${
        wrapTogether
          ? "flex flex-wrap justify-center items-baseline"
          : "whitespace-nowrap"
      }`}
      style={{
        fontSize: "clamp(4.5rem, 14vw, 11rem)",
        letterSpacing: expanded ? "-0.04em" : "-0.05em",
      }}
    >
      {(["B", "I", "T"] as const).map((l, i) => renderLetter(l, i))}
    </motion.h1>
  );
}
