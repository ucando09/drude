import { useEffect } from "react";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import PhoneScene from "./sections/PhoneScene";
import Vision from "./sections/Vision";
import Founders from "./sections/Founders";
import Footer from "./sections/Footer";
import { useI18n } from "./lib/i18n";

export default function App() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = t("meta.title", "Drude — Vibe-Coding, for Hardware");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        t(
          "meta.description",
          "P-say-B by Drude turns a plain-English idea into a manufacturable PCB. Plan, schematic, layout, fab — one prompt away.",
        ),
      );
  }, [t]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PhoneScene />
        <Vision />
        <Founders />
      </main>
      <Footer />
    </>
  );
}
