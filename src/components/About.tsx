export default function About() {
  return (
    <section id="about" className="relative border-t border-white/[0.06] py-32">
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase mb-6">
          / About
        </p>

        <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-10">
          One engineer.
          <br />
          <span className="text-white/40">Two perspectives.</span>
        </h2>

        <div className="grid md:grid-cols-[1fr_280px] gap-12 items-start">
          <div className="space-y-5 text-white/70 leading-relaxed">
            <p>
              <span className="text-white font-medium">BIT</span> is a knowledge
              hub built for engineers who write code <em>and</em> care about
              quality. It exists because the line between developer and SDET is
              getting thinner every year — and because AI-generated tests
              without business context will silently rot your suite.
            </p>
            <p>
              Whether you're picking up Playwright for the first time or
              levelling up your framework patterns, the goal is the same: build
              tests that protect real business logic, not just happy paths.
            </p>
            <p className="text-white/40 text-sm italic">
              Shift-left is here. AI can generate tests in minutes. The hard
              part isn't writing tests — it's knowing whether they actually
              work.
            </p>
          </div>

          <div className="border border-white/[0.08] p-6 bg-white/[0.01]">
            <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center font-mono text-sm font-bold mb-4">
              YN
            </div>
            <h3 className="text-base font-bold">Yashas Narayanaswamy</h3>
            <p className="text-xs text-white/50 mt-1 italic">
              QA by profession, developer by passion.
            </p>
            <a
              href="mailto:yashas07022002@gmail.com"
              className="block mt-4 text-xs font-mono text-white/70 hover:text-white break-all"
            >
              yashas07022002@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
