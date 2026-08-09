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

/** How many times a frame that has lost its document is given a fresh iframe. */
const MAX_RELOADS = 3;

type Props = {
  live: boolean;
  onLoaded: (iframe: HTMLIFrameElement) => void;
  onLayout: (mode: LayoutMode) => void;
};

export default function DemoFrame({ live, onLoaded, onLayout }: Props) {
  const windowRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bootedRef = useRef(false);

  const [src, setSrc] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

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
     never sized by its contents.

     The split between the two is what keeps a window drag cheap. --s is a
     transform, so changing it never re-lays-out the document inside the frame
     and it can safely run on every resize frame. --lw/--lh are that document's
     layout viewport: changing them re-lays-out 133 KB of IDE, so they wait for
     the drag to stop. Doing that work continuously is enough to take the frame's
     renderer down with it, and a dead subframe never comes back on its own. */
  useEffect(() => {
    const fit = fitRef.current;
    if (!fit) return;

    let logicalW = DRAWN_W;
    let logicalH = DRAWN_H;
    let lastMode: LayoutMode | null = null;
    let settle = 0;

    /** Keeps the frame tracking the box during a drag. Transform only. */
    const rescale = () => {
      const boxW = fit.clientWidth;
      if (!boxW) return;
      fit.style.setProperty("--s", String(Math.round((boxW / logicalW) * 1000) / 1000));
    };

    /** Hands the app a viewport for the space it now has. Runs once, after. */
    const relayout = () => {
      const boxW = fit.clientWidth;
      const boxH = fit.clientHeight;

      /* Narrower than any real phone means the box is mid-layout, not small.
         Sizing off it would divide the height by a near-zero scale and hand the
         frame a viewport tens of thousands of pixels tall, so the last good
         viewport is kept until the box means something. */
      if (boxW < 200 || boxH < 120) return;

      const drawn = boxW / DRAWN_W;
      const raw =
        drawn >= MIN_DRAWN_SCALE ? Math.min(drawn, 1.15) : Math.min(1, boxW / MIN_LOGICAL_W);
      const scale = Math.round(raw * 1000) / 1000;

      /* The logical viewport is whatever the box measures at that scale, so the
         app always fills the frame — no letterboxing. Rounded up rather than to
         nearest so the scaled result can never land a fraction of a pixel short
         of the edge, which is also what keeps the scaled branch at exactly the
         1600×900 the mock is drawn for. */
      logicalW = Math.ceil(boxW / scale);
      logicalH = Math.ceil(boxH / scale);

      fit.style.setProperty("--lw", String(logicalW));
      fit.style.setProperty("--lh", String(logicalH));
      fit.style.setProperty("--s", String(scale));

      const mode = layoutModeFor(logicalW);
      if (mode !== lastMode) {
        lastMode = mode;
        onLayout(mode);
      }
    };

    relayout();
    const ro = new ResizeObserver(() => {
      rescale();
      clearTimeout(settle);
      settle = window.setTimeout(relayout, 200);
    });
    ro.observe(fit);
    return () => {
      clearTimeout(settle);
      ro.disconnect();
    };
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
      bootedRef.current = true;
      onLoaded(iframe);
    };

    settle();
    iframe.addEventListener("load", settle);
    return () => iframe.removeEventListener("load", settle);
  }, [src, onLoaded, attempt]);

  /* If the frame's renderer dies it keeps its box but loses its document, and
     the browser paints its own placeholder there — a grey panel that stays put
     at every window size, because nothing reloads a crashed subframe on its
     own. So once the mock has booted, its absence means exactly that, and the
     only way back is a fresh iframe. Bounded, so a mock that genuinely cannot
     boot is not reloaded forever. */
  useEffect(() => {
    if (!src || attempt >= MAX_RELOADS) return;
    const id = window.setInterval(() => {
      const iframe = iframeRef.current;
      if (!bootedRef.current || !iframe) return;
      const doc = iframe.contentDocument;
      if (doc && doc.getElementById("btnSend")) return;
      bootedRef.current = false;
      setAttempt((n) => n + 1);
    }, 2000);
    return () => clearInterval(id);
  }, [src, attempt]);

  return (
    <div className="demo-window" ref={windowRef}>
      <div className="demo-fit" ref={fitRef} inert={!live}>
        {src ? (
          <iframe
            key={attempt}
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
