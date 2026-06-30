const DOCS = [
  
  {
    tag: "DEV Series",
    title: "Will U Wait Until Production Code Breaks?",
    desc: "How to know your automation actually catches bugs — mutation testing, assertion audits, and AI pitfalls.",
    href: "https://app.notion.com/p/38a5ebfce0ef8186a1fef0203fcbcfdc",
  },
  {
    tag: "SDET Series",
    title: "Want to add automation to your product? Here's how playwright works.",
    desc: "Locators, actions, assertions, tables, date pickers, frames, parallelism, fixtures, and full framework design.",
    href: "https://app.notion.com/p/2cb5ebfce0ef80c1b95cd22750e4244b",
  },
  {
    tag: "Coming Soon",
    title: "Context Engineering",
    desc: "How to optimize tokens for less billing and more accuracy.",
    href: null,
  },
];

export default function Docs() {
  return (
    <section id="docs" className="relative border-t border-white/[0.06] py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase mb-6">
              / Documentation
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Our help begins here.
            </h2>
          </div>
          <p className="text-white/50 max-w-sm text-sm">
           These will be the guides that will help you build whatever you are looking for.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
          {DOCS.map((doc) => {
            const isLive = !!doc.href;
            const Card = isLive ? "a" : "div";
            return (
              <Card
                key={doc.title}
                {...(isLive
                  ? {
                      href: doc.href!,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {})}
                className={`group bg-black p-8 flex flex-col min-h-[260px] transition-colors ${
                  isLive ? "hover:bg-white/[0.03] cursor-pointer" : "opacity-50"
                }`}
              >
                <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase mb-6">
                  {doc.tag}
                </p>
                <h3 className="text-xl font-bold mb-3 leading-tight">
                  {doc.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed flex-1">
                  {doc.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs tracking-widest">
                  {isLive ? (
                    <>
                      <span className="group-hover:text-white text-white/70">
                        READ
                      </span>
                      <span className="text-white/70 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </>
                  ) : (
                    <span className="text-white/30">ON THE WAY</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
