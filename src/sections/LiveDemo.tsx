import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import DemoFrame from "../components/DemoFrame";
import DemoStory from "./DemoStory";
import useMediaQuery from "../hooks/useMediaQuery";
import { useI18n } from "../lib/i18n";
import {
  CHAPTERS,
  createBridge,
  createDriver,
  type Bridge,
  type DriverPhase,
} from "../lib/demoBridge";

/**
 * Below this the IDE cannot be scaled and stay legible — at 860px it computes to
 * roughly 6.5px text. The height clause catches short laptops (1280×800 lands at
 * 0.47). This is deliberately a JS constant, not the codebase's 860px CSS
 * breakpoint: `display: none` would still fetch and boot 133 KB of IDE.
 */
const DEMO_VIEWPORT = "(min-width: 1024px) and (min-height: 620px)";

export default function LiveDemo() {
  const canRunDemo = useMediaQuery(DEMO_VIEWPORT);
  return canRunDemo ? <LiveDemoDesktop /> : <DemoStory />;
}

function LiveDemoDesktop() {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<DriverPhase>("idle");
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState<number[]>([]);

  const bridgeRef = useRef<Bridge | null>(null);
  const driverRef = useRef<ReturnType<typeof createDriver> | null>(null);
  const attachedRef = useRef<HTMLIFrameElement | null>(null);

  const handleLoaded = useCallback((iframe: HTMLIFrameElement) => {
    if (attachedRef.current === iframe) return;
    attachedRef.current = iframe;

    const bridge = createBridge(iframe);
    bridge.patchFocus();
    bridge.injectStyles();
    bridge.openingLayout();

    bridgeRef.current = bridge;
    driverRef.current = createDriver(bridge, {
      onPhase: (next, index) => {
        setPhase(next);
        setActive(index);
      },
      onChapterDone: (index) =>
        setDone((current) => (current.includes(index) ? current : [...current, index])),
      onLoop: () => setDone([]),
    });

    setReady(true);
  }, []);

  const playFrom = useCallback((index: number) => {
    const driver = driverRef.current;
    if (!driver) return;
    setActive(index);
    void driver.play(index);
  }, []);

  /* The screen is fixed in the page, so visibility is what gates the loop.
     Hysteresis on purpose: it starts once 30% is showing but only stops when the
     section has left completely, so a small scroll can't chop the story up. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry.isIntersecting) setInView(false);
        else if (entry.intersectionRatio >= 0.3) setInView(true);
      },
      { threshold: [0, 0.3] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const live = inView && ready;

  /* The walkthrough runs itself and never stops for the visitor — poking at the
     app does not interrupt it. It only pauses when the section scrolls away,
     rather than churning through prompts off-screen, and starts the story from
     the top when you come back. Under reduced motion it never starts: the mock's
     boot state is already a populated Layout thread with a routed board. */
  useEffect(() => {
    if (!ready || reduced) return;

    if (!inView) {
      driverRef.current?.cancel();
      return;
    }

    const timer = window.setTimeout(() => {
      bridgeRef.current?.reset();
      setDone([]);
      playFrom(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [inView, ready, reduced, playFrom]);

  useEffect(
    () => () => {
      driverRef.current?.cancel();
      bridgeRef.current?.restore();
    },
    []
  );

  const onRailKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const from = active < 0 ? 0 : active;
    const next = (from + delta + CHAPTERS.length) % CHAPTERS.length;
    railRef.current?.querySelectorAll("button")[next]?.focus();
  };

  const caption =
    phase === "waiting"
      ? t("demo.waitingCaption", "Letting the current reply finish…")
      : active >= 0
        ? t(`demo.chapters.${active}.caption`, CHAPTERS[active].caption)
        : t(
            "demo.defaultCaption",
            "One sentence of English to a board on its way to the fab, in five steps.",
          );

  return (
    <div className="demo" id="demo" ref={rootRef}>
      <DemoFrame live={live} onLoaded={handleLoaded} />

      <div className="demo-dock">
        <div
          className="demo-rail"
          role="tablist"
          aria-label={t("demo.railLabel", "Demo chapters")}
          ref={railRef}
          onKeyDown={onRailKeys}
        >
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              role="tab"
              aria-selected={active === index}
              tabIndex={active === index || (active < 0 && index === 0) ? 0 : -1}
              className={`demo-chip mono${active === index ? " on" : ""}${
                done.includes(index) ? " done" : ""
              }`}
              data-phase={active === index ? phase : undefined}
              onClick={() => playFrom(index)}
            >
              <span className="demo-chip-idx">{index + 1}</span>
              {t(`demo.chapters.${index}.label`, chapter.label)}
            </button>
          ))}
        </div>

        {/* not rendered visually — keeps chapter changes announced, since the
            panel the rail controls lives inside an iframe */}
        <p className="demo-visually-hidden" aria-live="polite">
          {caption}
        </p>
      </div>
    </div>
  );
}
