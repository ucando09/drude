import Reveal from "../components/Reveal";
import LiveDemo from "./LiveDemo";
import { useI18n } from "../lib/i18n";

export default function Vision() {
  const { t } = useI18n();

  return (
    <section className="vision">
      <div className="container">
        <Reveal>
          <span className="mono" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
            {t("vision.kicker", "What P-say-B does")}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="vision-statement">
            {t("vision.statement.prefix", "We're automating ")}
            <span className="accent">{t("vision.statement.accent", "all three steps.")}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="vision-lede">
            {t(
              "vision.lede.prefix",
              "P-say-B takes a plain-English description of a device and carries it through the whole line — ",
            )}
            <strong>
              {t("vision.lede.strong", "block plan, schematic, layout, fab-ready gerbers")}
            </strong>
            {t("vision.lede.suffix", ". What takes a hardware team weeks becomes a conversation.")}
          </p>
        </Reveal>

      </div>

      {/* sits outside .container so the screen can run wider than the text column */}
      <LiveDemo />

      <div className="container">
        <div className="vision-closer">
          <Reveal>
            <h2>
              {t("vision.closer.heading.line1", "Everyone will build their own devices,")}
              <br />
              <span className="serif-i">
                {t("vision.closer.heading.line2", "to their own taste.")}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p>
              {t(
                "vision.closer.body",
                "Not picked off a shelf. Not compromised to fit a market of millions. Designed for a market of one — you — the way software already is.",
              )}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
