import { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useI18n();

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
        <div className="nav-right">
          <button
            type="button"
            className="nav-lang"
            onClick={toggleLanguage}
            aria-label="Switch language"
          >
            <span className={language === "en" ? "on" : undefined}>EN</span>
            <span aria-hidden="true">/</span>
            <span className={language === "ko" ? "on" : undefined}>KO</span>
          </button>
          <a className="nav-contact" href="mailto:iannleee@cau.ac.kr">
            {t("nav.contact", "Contact")}
          </a>
        </div>
      </div>
    </header>
  );
}
