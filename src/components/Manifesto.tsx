import ComingSoonBadge from "./ComingSoonBadge";

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative border-t border-white/[0.06] py-32">
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase mb-6">
          / Manifesto
        </p>
        <ComingSoonBadge />
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-balance">
          <span className="text-red-500">RED</span>
          <span className="text-blue-500">MOON</span>
          {" "}
          <span className="text-white">AI</span>
          <br />
          <span className="text-white/40">Vibe code with confidence.</span>
        </h1>
        <p className="mt-6 text-sm sm:text-base text-white/50 max-w-lg leading-relaxed">
          We&apos;re building something new. Until then,{" "}
          <a
            href="#docs"
            className="text-white/80 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white/60 transition-colors"
          >
            read our docs below
          </a>
          .
        </p>

        <div className="mt-16 grid sm:grid-cols-3 gap-px bg-white/[0.06]">
          {[
            {
              k: "01",
              h: "About RedMoon AI",
              p: "Code without quality is technical debt waiting to ship. We build with verification in the loop.",
            },
            {
              k: "02",
              h: "Together",
              p: "Developers and SDETs aren't separate species. Shift-left works when both speak the same language.",
            },
            {
              k: "03",
              h: "Prove It",
              p: "Green pipelines lie. We test the tests — mutation, assertions, real bug coverage.",
            },
          ].map((item) => (
            <div
              key={item.k}
              className="bg-black p-8 hover:bg-white/[0.02] transition-colors"
            >
              <p className="font-mono text-xs text-white/30 mb-4">{item.k}</p>
              <h3 className="text-xl font-bold mb-2">{item.h}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
