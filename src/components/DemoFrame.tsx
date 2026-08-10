import { useEffect, useRef, useState } from "react";
import type { Language } from "../lib/i18n";

/**
 * The IDE's 3-pane grid needs ~1026px before it gets cramped and is drawn for
 * 1600×900, so the iframe is rendered at a fixed logical viewport and scaled to
 * fit. Its inner layout viewport stays 1600×900, which means the app always
 * lays out like a desktop no matter how small the frame gets.
 */
const LOGICAL_W = 1600;
const LOGICAL_H = 900;

/**
 * public/ files get no content hash — bump ?v= after `npm run sync:demo`.
 * index.ko.html is a hand-translated fork of index.html (chat text, sidebar,
 * workspace panel — see public/demo/index.ko.html's own header comment). It is
 * NOT touched by sync:demo, so re-syncing the English mock does not silently
 * revert the Korean copy; re-translating after a source change is a manual step.
 */
function demoSrcFor(language: Language) {
  const file = language === "ko" ? "index.ko.html" : "index.html";
  return `${import.meta.env.BASE_URL}demo/${file}?v=2`;
}

type Props = {
  live: boolean;
  language: Language;
  onLoaded: (iframe: HTMLIFrameElement) => void;
};

export default function DemoFrame({ live, language, onLoaded }: Props) {
  const windowRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [src, setSrc] = useState<string | null>(null);

  /* Fetch the 133 KB document only as the section comes up, and let it parse and
     settle well before it is scrolled to. */
  useEffect(() => {
    const el = windowRef.current;
    if (!el || src) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSrc(demoSrcFor(language));
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, language]);

  /* CSS owns the box, JS owns only the scalar. Changing --s only changes a
     transform, which does not affect layout — so this can never feed back into
     the ResizeObserver. */
  useEffect(() => {
    const fit = fitRef.current;
    if (!fit) return;

    let last = 0;
    const apply = () => {
      const raw = fit.clientWidth / LOGICAL_W;
      const next = Math.min(Math.round(raw * 1000) / 1000, 1.15);
      if (Math.abs(next - last) < 0.001) return;
      last = next;
      fit.style.setProperty("--s", String(next));
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(fit);
    return () => ro.disconnect();
  }, [src]);

  /* StrictMode runs this twice against the same DOM node, so the iframe does not
     reload and `load` may already have fired — check for the mock's own DOM
     rather than trusting the event. */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !src) return;

    let done = false;
    const settle = () => {
      if (done) return;
      const doc = iframe.contentDocument;
      if (!doc || doc.readyState !== "complete" || !doc.getElementById("btnSend")) return;
      done = true;
      onLoaded(iframe);
    };

    settle();
    iframe.addEventListener("load", settle);
    return () => iframe.removeEventListener("load", settle);
  }, [src, onLoaded]);

  return (
    <div className="demo-window" ref={windowRef}>
      <div className="demo-fit" ref={fitRef} inert={!live}>
        {src ? (
          <iframe
            ref={iframeRef}
            className="demo-iframe"
            src={src}
            title={
              language === "ko"
                ? "P-say-B — 라이브 인터랙티브 제품 데모"
                : "P-say-B — live interactive product demo"
            }
            loading="lazy"
            width={LOGICAL_W}
            height={LOGICAL_H}
          />
        ) : null}
      </div>
    </div>
  );
}
