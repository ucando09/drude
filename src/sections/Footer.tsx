import { useI18n } from "../lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <span className="wordmark">Drude</span>
          <p className="footer-tag">
            {t("footer.tag", "P-say-B — vibe-coding, for hardware.")}
          </p>
        </div>
        <div className="footer-right">
          <a className="footer-mail" href="mailto:iannleee@cau.ac.kr">
            iannleee@cau.ac.kr
          </a>
          <span className="footer-copy">{t("footer.copy", "© 2026 Drude. Seoul, KR.")}</span>
        </div>
      </div>
    </footer>
  );
}
