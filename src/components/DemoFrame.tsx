import { useEffect, useRef, useState } from "react";
import { layoutModeFor, type LayoutMode } from "../lib/demoBridge";

/**
 * The mock is drawn for 1600×900, so on a wide screen the iframe is rendered at
 * that fixed logical viewport and scaled down to fit — its inner layout viewport
 * stays 1600×900 and the app lays out exactly as designed.
 *
 * Scaling stops paying off once the text goes under ~8.5px, and below that the
 * frame switches strategy: instead of shrinking a desktop IDE further, it hands
 * the iframe a *smaller* logical viewport and lets the app lay itself out for
 * the space available, at close to native text size. The mock can do this
 * because its panes collapse — see layoutModeFor(), which is what tells the
 * bridge how many of them fit.
 */
const DRAWN_W = 1600;
const DRAWN_H = 900;

/** 1600px of layout below this is roughly 8.5px text. */
const MIN_DRAWN_SCALE = 0.72;

/** The narrowest the mock can lay out: 46px collapsed sidebar + 360px chat, plus slack. */
const MIN_LOGICAL_W = 430;

/** public/ files get no content hash — bump ?v= after `npm run sync:demo`. */
const DEMO_SRC = `${import.meta.env.BASE_URL}demo/index.html?v=2`;

type Props = {
  live: boolean;
  onLoaded: (iframe: HTMLIFrameElement) => void;
  onLayout: (mode: LayoutMode) => void;
};

export default function DemoFrame({ live, onLoaded, onLayout }: Props) {
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
          setSrc(DEMO_SRC);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  /* CSS owns the box; JS owns only what goes inside it. --lw/--lh size the
     iframe and --s scales it, and none of the three can feed back into the
     measurement: the box is width:100% with its height set by CSS, so it is
     never sized by its contents. */
  useEffect(() => {
    const fit = fitRef.current;
    if (!fit) return;

    let lastScale = 0;
    let lastMode: LayoutMode | null = null;

    const apply = () => {
      const boxW = fit.clientWidth;
      const boxH = fit.clientHeight;
      if (!boxW || !boxH) return;

      const drawn = boxW / DRAWN_W;
      const raw =
        drawn >= MIN_DRAWN_SCALE ? Math.min(drawn, 1.15) : Math.min(1, boxW / MIN_LOGICAL_W);
      const scale = Math.round(raw * 1000) / 1000;

      /* The logical viewport is whatever the box measures at that scale, so the
         app always fills the frame — no letterboxing. Rounded up rather than to
         nearest so the scaled result can never land a fraction of a pixel short
         of the edge, which is also what keeps the scaled branch at exactly the
         1600×900 the mock is drawn for. */
      const logicalW = Math.ceil(boxW / scale);
      const logicalH = Math.ceil(boxH / scale);

      if (Math.abs(scale - lastScale) >= 0.001) {
        lastScale = scale;
        fit.style.setProperty("--s", String(scale));
      }
      fit.style.setProperty("--lw", String(logicalW));
      fit.style.setProperty("--lh", String(logicalH));

      const mode = layoutModeFor(logicalW);
      if (mode !== lastMode) {
        lastMode = mode;
        onLayout(mode);
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(fit);
    return () => ro.disconnect();
  }, [src, onLayout]);

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
            title="P-say-B — live interactive product demo"
            loading="lazy"
            width={DRAWN_W}
            height={DRAWN_H}
          />
        ) : null}
      </div>
    </div>
  );
}
