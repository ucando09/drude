import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import { useI18n } from "../lib/i18n";

/* ------------------------------------------------------------------ */
/* Scroll choreography (p = 0..1 across the 640vh pinned section)      */
/*   0.00–0.16  phone front view → tilts into isometric                */
/*   0.16–0.30  layers explode apart, labels fade in                   */
/*   0.30–0.42  hold the exploded view                                 */
/*   0.42–0.60  rotate back flat, zoom into the PCB, layers fly off    */
/*   0.56–0.62  crossfade to the large process board                   */
/*   0.60–1.00  Plan → Schematic & layout → Manufacture                */
/* ------------------------------------------------------------------ */

const LABELS = [
  { idx: "01", name: "Software", desc: "The part the world already vibe-codes." },
  { idx: "02", name: "Hardware", desc: "The PCB underneath — every device's real brain." },
  { idx: "03", name: "Shell", desc: "The body that wraps it all together." },
];

const STEPS: { idx: string; title: string; body: string; range: [number, number] }[] = [
  {
    idx: "Step 01 / 03",
    title: "Plan the board",
    body: "Decide what it must do. Pick the brain, the power, the radios — block by block, before a single trace exists.",
    range: [0.6, 0.74],
  },
  {
    idx: "Step 02 / 03",
    title: "Schematic & layout",
    body: "Wire every net. Place every part. Route every trace by hand. The slow, expert, unforgiving part.",
    range: [0.74, 0.865],
  },
  {
    idx: "Step 03 / 03",
    title: "Send it to the fab",
    body: "Export gerbers, order the run, wait weeks for boards — and hope you got every last pad right.",
    range: [0.865, 1],
  },
];

const TRACES = [
  "M170 100 H213 L245 132 V150",
  "M126 305 H196 L232 269 V260",
  "M410 100 H367 L335 132 V150",
  "M420 315 H372 L336 279 V260",
  "M285 260 V352",
  "M285 150 V92",
];

const PADS: [number, number][] = [
  [170, 100],
  [126, 305],
  [410, 100],
  [420, 315],
  [285, 352],
  [285, 92],
  [245, 150],
  [232, 260],
  [335, 150],
  [336, 260],
];

function Trace({ p, d, i }: { p: MotionValue<number>; d: string; i: number }) {
  const start = 0.745 + i * 0.01;
  const len = useTransform(p, [start, start + 0.09], [0, 1]);
  return <motion.path d={d} style={{ pathLength: len }} />;
}

function FabPart({ p, i, children }: { p: MotionValue<number>; i: number; children: ReactNode }) {
  const start = 0.878 + i * 0.008;
  const op = useTransform(p, [start, start + 0.03], [0, 1]);
  const sc = useTransform(p, [start, start + 0.035], [0.55, 1]);
  return (
    <motion.g style={{ opacity: op, scale: sc, transformBox: "fill-box", transformOrigin: "center" }}>
      {children}
    </motion.g>
  );
}

function StepCard({
  p,
  step,
  index,
  isLast,
}: {
  p: MotionValue<number>;
  step: (typeof STEPS)[number];
  index: number;
  isLast: boolean;
}) {
  const { t } = useI18n();
  const [a, b] = step.range;
  const op = useTransform(
    p,
    isLast ? [a, a + 0.04, 0.995, 1] : [a, a + 0.04, b - 0.03, b],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(p, [a, a + 0.055], [34, 0]);
  return (
    <div className="step-card">
      <motion.div style={{ opacity: op, y }}>
        <span className="idx mono">{step.idx}</span>
        <h3>{t(`scene.steps.${index}.title`, step.title)}</h3>
        <p>{t(`scene.steps.${index}.body`, step.body)}</p>
      </motion.div>
    </div>
  );
}

function ProcessBoard({ p }: { p: MotionValue<number> }) {
  const bpOp = useTransform(p, [0.6, 0.64, 0.75, 0.8], [0, 1, 1, 0.12]);
  const padsOp = useTransform(p, [0.8, 0.87], [0, 1]);
  const fabOp = useTransform(p, [0.868, 0.915], [0, 1]);

  return (
    <svg viewBox="0 0 560 430" fill="none" aria-label="PCB manufacturing process diagram">
      {/* bare board */}
      <rect x="24" y="24" width="512" height="372" rx="20" fill="#fff" stroke="#dcdcd6" strokeWidth="1.5" />
      {[
        [52, 52],
        [508, 52],
        [52, 368],
        [508, 368],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" fill="none" stroke="#d2d2cc" strokeWidth="3" />
      ))}

      {/* step 1 — blueprint block plan */}
      <motion.g style={{ opacity: bpOp }} stroke="#a8aeba" strokeWidth="1.5" strokeDasharray="6 5">
        <rect x="230" y="150" width="110" height="110" rx="6" />
        <rect x="60" y="60" width="110" height="80" rx="6" />
        <rect x="36" y="270" width="90" height="70" rx="6" />
        <rect x="410" y="56" width="100" height="90" rx="6" />
        <rect x="420" y="280" width="90" height="70" rx="6" />
        <g stroke="none">
          <text className="bp-label" x="285" y="209" textAnchor="middle">MCU</text>
          <text className="bp-label" x="115" y="104" textAnchor="middle">PWR</text>
          <text className="bp-label" x="81" y="309" textAnchor="middle">USB-C</text>
          <text className="bp-label" x="460" y="105" textAnchor="middle">RF / BLE</text>
          <text className="bp-label" x="465" y="319" textAnchor="middle">IMU</text>
        </g>
        <g strokeDasharray="none" stroke="#c4c8d2">
          <line x1="24" y1="410" x2="536" y2="410" />
          <line x1="24" y1="404" x2="24" y2="416" />
          <line x1="536" y1="404" x2="536" y2="416" />
        </g>
        <text className="bp-label" x="280" y="426" textAnchor="middle" stroke="none">51.2 MM</text>
      </motion.g>

      {/* step 2 — copper routes itself in */}
      <g stroke="#2b4bff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {TRACES.map((d, i) => (
          <Trace key={d} p={p} d={d} i={i} />
        ))}
      </g>
      <motion.g style={{ opacity: padsOp }} fill="#e3b341">
        {PADS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" />
        ))}
      </motion.g>

      {/* step 3 — fabbed board */}
      <motion.g style={{ opacity: fabOp }}>
        <rect x="24" y="24" width="512" height="372" rx="20" fill="#2b4bff" />
        <g stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {TRACES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g fill="#e3b341">
          {PADS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" />
          ))}
        </g>
        {[
          [52, 52],
          [508, 52],
          [52, 368],
          [508, 368],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" fill="#fafaf7" stroke="#e3b341" strokeWidth="3.5" />
        ))}
        <text className="silk-label" x="280" y="386" textAnchor="middle">DRUDE · P-SAY-B · REV A</text>
      </motion.g>

      <FabPart p={p} i={0}>
        <rect x="238" y="158" width="94" height="94" rx="8" fill="#0e1116" />
        <rect x="248" y="168" width="74" height="74" rx="4" fill="none" stroke="rgba(255,255,255,0.16)" />
        <text className="silk-label" x="285" y="209" textAnchor="middle">P-SAY-B</text>
      </FabPart>
      <FabPart p={p} i={1}>
        <rect x="72" y="72" width="86" height="56" rx="6" fill="#171a20" />
        <rect x="86" y="136" width="18" height="9" rx="2" fill="#c8ccd4" />
        <rect x="116" y="136" width="18" height="9" rx="2" fill="#c8ccd4" />
      </FabPart>
      <FabPart p={p} i={2}>
        <rect x="30" y="282" width="62" height="46" rx="6" fill="#c8ccd4" stroke="#a9afb8" strokeWidth="1.5" />
        <rect x="40" y="296" width="42" height="18" rx="4" fill="#8f959e" />
      </FabPart>
      <FabPart p={p} i={3}>
        <path d="M424 78 v22 h20 v-22 h20 v22 h20 v-22" stroke="#fff" strokeWidth="2.5" fill="none" />
        <rect x="424" y="112" width="80" height="26" rx="5" fill="#171a20" />
      </FabPart>
      <FabPart p={p} i={4}>
        <rect x="432" y="292" width="52" height="42" rx="6" fill="#171a20" />
      </FabPart>
      <FabPart p={p} i={5}>
        <rect x="352" y="170" width="28" height="15" rx="7" fill="#d7dbe0" />
        <rect x="190" y="180" width="17" height="9" rx="2" fill="#c8ccd4" />
        <rect x="352" y="200" width="9" height="17" rx="2" fill="#c8ccd4" />
        <rect x="200" y="300" width="17" height="9" rx="2" fill="#c8ccd4" />
        <rect x="370" y="300" width="17" height="9" rx="2" fill="#c8ccd4" />
        <rect x="250" y="118" width="17" height="9" rx="2" fill="#c8ccd4" />
      </FabPart>
    </svg>
  );
}

export default function PhoneScene() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 });

  const rx = useTransform(p, [0.06, 0.16, 0.42, 0.56], [0, 58, 58, 0]);
  const rz = useTransform(p, [0.06, 0.16, 0.42, 0.56], [0, -32, -32, 0]);
  const stackScale = useTransform(p, [0, 0.16, 0.44, 0.6], [1, 0.92, 0.92, 2.4]);
  const gap = useTransform(p, [0.16, 0.3, 0.46, 0.6], [0, 130, 130, 340]);
  const negGap = useTransform(gap, (v) => -v);
  const sideOp = useTransform(p, [0.46, 0.55], [1, 0]);
  const stackOp = useTransform(p, [0.53, 0.59], [1, 0]);

  const labelsOp = useTransform(p, [0.22, 0.3, 0.4, 0.48], [0, 1, 1, 0]);
  const labelsX = useTransform(p, [0.22, 0.3], [28, 0]);
  const kicker1Op = useTransform(p, [0.02, 0.07, 0.4, 0.47], [0, 1, 1, 0]);
  const kicker2Op = useTransform(p, [0.56, 0.62, 0.995, 1], [0, 1, 1, 1]);
  const shadowOp = useTransform(p, [0.06, 0.16, 0.44, 0.52], [0, 0.8, 0.8, 0]);

  const boardOp = useTransform(p, [0.555, 0.62], [0, 1]);
  const boardScale = useTransform(p, [0.555, 0.66], [1.18, 1]);
  const boardX = useTransform(p, [0.555, 0.66], [-48, 0]);

  return (
    <section className="scene" ref={ref}>
      <div className="scene-sticky">
        <motion.p className="scene-kicker mono" style={{ opacity: kicker1Op }}>
          {t("scene.kicker1", "Every device you own is three layers deep")}
        </motion.p>
        <motion.p className="scene-kicker mono" style={{ opacity: kicker2Op }}>
          {t("scene.kicker2", "How the hardware layer gets made — today")}
        </motion.p>

        <motion.div className="scene-shadow" style={{ opacity: shadowOp }} />

        <div className="phone-viewport">
          <div className="phone-fit">
            <motion.div
              className="phone-stack"
              style={{ rotateX: rx, rotateZ: rz, scale: stackScale, opacity: stackOp }}
            >
              <motion.div className="phone-layer layer-shell" style={{ z: negGap, opacity: sideOp }}>
                <div className="shell-camera">
                  <i />
                  <i />
                </div>
                <div className="shell-logo">DRUDE</div>
              </motion.div>

              <div className="phone-layer layer-pcb">
                <svg viewBox="0 0 250 510" fill="none">
                  <rect x="6" y="6" width="238" height="498" rx="34" fill="#2b4bff" />
                  <rect x="70" y="200" width="110" height="110" rx="10" fill="#0e1116" />
                  <text x="125" y="260" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="2" fill="rgba(255,255,255,0.85)">P-SAY-B</text>
                  <g stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round">
                    <path d="M125 200 V150 H80" />
                    <path d="M125 310 V370 H170" />
                    <path d="M70 255 H36 V180" />
                    <path d="M180 255 H214 V330" />
                  </g>
                  <g fill="#e3b341">
                    <circle cx="80" cy="150" r="5" />
                    <circle cx="170" cy="370" r="5" />
                    <circle cx="36" cy="180" r="5" />
                    <circle cx="214" cy="330" r="5" />
                    <circle cx="40" cy="60" r="5" />
                    <circle cx="210" cy="60" r="5" />
                    <circle cx="40" cy="450" r="5" />
                    <circle cx="210" cy="450" r="5" />
                  </g>
                  <rect x="60" y="60" width="60" height="34" rx="5" fill="#171a20" />
                  <rect x="150" y="430" width="54" height="26" rx="5" fill="#171a20" />
                </svg>
              </div>

              <motion.div className="phone-layer layer-glass" style={{ z: gap, opacity: sideOp }}>
                <div className="glass-notch" />
                <div className="glass-prompt">
                  <span className="p-accent">›</span> {t("scene.glass.prompt", "drude — new project_")}
                </div>
                <div className="glass-bubble">
                  {t("scene.glass.bubble", "build me a heart-rate wearable. battery first, tiny, matte.")}
                </div>
                <div className="glass-skeleton">
                  <i style={{ width: "88%" }} />
                  <i style={{ width: "64%" }} />
                  <i style={{ width: "76%" }} />
                  <i style={{ width: "40%" }} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="layer-labels">
          {LABELS.map((l, i) => (
            <motion.div className="layer-label" key={l.idx} style={{ opacity: labelsOp, x: labelsX }}>
              <span className="idx">{l.idx}</span>
              <span className="name">{t(`scene.labels.${i}.name`, l.name)}</span>
              <span className="desc">{t(`scene.labels.${i}.desc`, l.desc)}</span>
            </motion.div>
          ))}
        </div>

        <div className="board-wrap">
          <motion.div style={{ opacity: boardOp, scale: boardScale, x: boardX }}>
            <ProcessBoard p={p} />
          </motion.div>
        </div>

        <div className="step-col">
          {STEPS.map((s, i) => (
            <StepCard key={s.idx} p={p} step={s} index={i} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
