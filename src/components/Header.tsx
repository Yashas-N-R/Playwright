import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-black/70 border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
        <a href="#top" className="font-mono text-sm tracking-[0.2em] text-white">
          BIT
        </a>
        <nav className="flex items-center gap-6 text-xs font-mono tracking-widest text-white/60">
          <a href="#manifesto" className="hover:text-white transition-colors">
            MANIFESTO
          </a>
          <a href="#docs" className="hover:text-white transition-colors">
            DOCS
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            ABOUT
          </a>
          <a
            href="mailto:yashas.narayanaswamy@buildittogether.com"
            className="px-3 py-1.5 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all rounded-full"
          >
            CONTACT
          </a>
        </nav>
      </div>
    </header>
  );
}
