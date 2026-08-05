import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <div className="nav-brand">
          <span className="wordmark">Drude</span>
          <span className="nav-chip">P-say-B · alpha</span>
        </div>
        <a className="nav-contact" href="mailto:iannleee@naver.com">
          Contact
        </a>
      </div>
    </header>
  );
}
