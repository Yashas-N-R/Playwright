export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-6 grid sm:grid-cols-3 gap-10">
        <div>
          <p className="font-mono text-sm tracking-[0.2em] text-white mb-2">
            BIT
          </p>
          <p className="text-white/40 text-xs leading-relaxed max-w-xs">
            Build It Together — Turn your prototype to production ready.
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">
            Navigate
          </p>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <a href="#manifesto" className="hover:text-white transition-colors">
                Manifesto
              </a>
            </li>
            <li>
              <a href="#docs" className="hover:text-white transition-colors">
                Docs
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition-colors">
                About
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">
            Contact
          </p>
          <a
            href="mailto:yashas.narayanaswamy@buildittogether.com"
            className="text-sm text-white/70 hover:text-white transition-colors break-all"
          >
            yashas.narayanaswamy@buildittogether.com
          </a>
          <p className="text-xs text-white/30 mt-2 italic">
            Yashas Narayanaswamy
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-12 pt-6 border-t border-white/[0.06] flex flex-wrap justify-between gap-3 text-[10px] font-mono tracking-widest text-white/30 uppercase">
        <span>&copy; 2026 BIT</span>
        <span>Built by Yashas Narayanaswamy</span>
      </div>
    </footer>
  );
}
