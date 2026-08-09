import { motion } from "framer-motion";
import { useI18n } from "../lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

function MaskedLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="line-mask">
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { language, t } = useI18n();

  return (
    <section className="hero">
      <div className="hero-inner">
        <motion.p
          className="hero-kicker mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {t("hero.kicker", "Drude introduces P-say-B")} <span className="cursor" />
        </motion.p>

        <h1>
          <MaskedLine delay={0.25}>{t("hero.title.line1", "Vibe-coding,")}</MaskedLine>
          <MaskedLine delay={0.38}>
            {t("hero.title.line2.prefix", "for ")}
            <span className="serif-i">{t("hero.title.line2.em", "hardware.")}</span>
          </MaskedLine>
        </h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        >
          {language === "ko" ? (
            t("hero.sub", "")
          ) : (
            <>
              Describe the device you want. <strong>P-say-B</strong> plans the board, draws
              the schematic, routes the layout, and hands it to the fab.{" "}
              <strong>English in, hardware out.</strong>
            </>
          )}
        </motion.p>
      </div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <span className="mono">{t("hero.scroll", "Scroll")}</span>
        <span className="track" />
      </motion.div>
    </section>
  );
}
