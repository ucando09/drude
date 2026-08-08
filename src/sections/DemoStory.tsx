import type { ReactNode } from "react";
import Reveal from "../components/Reveal";

/**
 * Small-viewport stand-in for the live demo. The real app is a 3-pane desktop
 * IDE that needs ~1026px before it gets cramped — at phone widths it computes to
 * about 3px text, and opening the mock in its own tab is worse than nothing
 * (it is overflow:hidden over a 1026px grid, so it can't even be panned).
 *
 * So the story is retold here in four beats in the landing page's own light
 * language, using the app's real numbers.
 */

/** Four of the fourteen lines the app actually resolves, verbatim. */
const BOM = [
  { ref: "U1", part: "ESP32-WROOM-32E", qty: 1, price: "3.84", stock: "18,204", low: false },
  { ref: "U2", part: "MP1584EN", qty: 1, price: "0.62", stock: "9,510", low: false },
  { ref: "U4-U7", part: "DRV8871DDAR", qty: 4, price: "1.94", stock: "842", low: true },
  { ref: "J2", part: "USB-C 16P receptacle", qty: 1, price: "0.31", stock: "31k", low: false },
];

function Beat({
  index,
  title,
  children,
  delay,
}: {
  index: number;
  title: ReactNode;
  children: ReactNode;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="story-beat">
      <span className="story-idx mono">{String(index).padStart(2, "0")}</span>
      <h3>{title}</h3>
      <div className="story-body">{children}</div>
    </Reveal>
  );
}

export default function DemoStory() {
  return (
    <div className="demo-story" id="demo">
      <div className="container">
        <div className="story-beats">
          <Beat index={1} delay={0} title="You describe the thing">
            <p className="story-bubble">
              I'm building a cocktail robot. It drives four peristaltic pumps at 12 volts, talks
              over Wi-Fi, and needs a USB-C port for firmware. I'm a software developer, not a
              hardware person — pick sensible parts for me.
            </p>
            <p className="story-note">No part numbers. No voltages you had to look up.</p>
          </Beat>

          <Beat index={2} delay={0.06} title="It picks the parts">
            <table className="story-bom">
              <tbody>
                {BOM.map((row) => (
                  <tr key={row.ref}>
                    <td className="story-bom-ref mono">{row.ref}</td>
                    <td className="story-bom-part">
                      {row.part}
                      {row.qty > 1 ? <span className="story-bom-qty"> ×{row.qty}</span> : null}
                    </td>
                    <td className="story-bom-price mono">${row.price}</td>
                    <td className={`story-bom-stock mono${row.low ? " low" : ""}`}>{row.stock}</td>
                  </tr>
                ))}
                <tr className="story-bom-more">
                  <td colSpan={4}>+ 10 more lines</td>
                </tr>
              </tbody>
            </table>
            <p className="story-note">
              <strong>52,418 parts</strong> searched against live vendor stock. All 14 lines in
              stock, <strong>$18.62</strong> a board. Picking a chip that's out of stock for nine
              months is what actually kills hardware projects.
            </p>
          </Beat>

          <Beat index={3} delay={0.06} title="It draws it and routes it">
            <div className="story-board">
              <svg viewBox="0 0 300 180" fill="none" role="img" aria-label="Routed circuit board">
                <rect x="2" y="2" width="296" height="176" rx="10" fill="#2b4bff" />
                <rect x="26" y="30" width="72" height="52" rx="6" fill="#0e1116" />
                <text
                  x="62"
                  y="60"
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="9"
                  letterSpacing="1"
                  fill="rgba(255,255,255,0.85)"
                >
                  ESP32
                </text>
                <g fill="#0e1116">
                  <rect x="212" y="24" width="40" height="26" rx="4" />
                  <rect x="212" y="60" width="40" height="26" rx="4" />
                  <rect x="212" y="96" width="40" height="26" rx="4" />
                  <rect x="212" y="132" width="40" height="26" rx="4" />
                </g>
                <rect x="120" y="120" width="48" height="24" rx="4" fill="#171a20" />
                <g stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round">
                  <path d="M98 44 H180 V37 H212" />
                  <path d="M98 56 H168 V73 H212" />
                  <path d="M98 68 H156 V109 H212" />
                  <path d="M62 82 V145 H120" />
                  <path d="M168 132 H196 V145 H252" />
                </g>
                <g fill="#e3b341">
                  <circle cx="20" cy="20" r="4" />
                  <circle cx="280" cy="20" r="4" />
                  <circle cx="20" cy="160" r="4" />
                  <circle cx="280" cy="160" r="4" />
                  <circle cx="110" cy="24" r="3" />
                  <circle cx="110" cy="156" r="3" />
                </g>
              </svg>
            </div>
            <p className="story-note">
              <strong>96 nets</strong>, all routed · 4 layers · 100 × 60 mm. The pump drivers sit
              along one edge sharing a copper pour, so they spread heat instead of cooking each
              other.
            </p>
          </Beat>

          <Beat index={4} delay={0.06} title="Then it checks it and orders it">
            <div className="story-pass">
              <span className="story-pass-dot" aria-hidden="true" />
              <p className="mono">1,800 design-rule checks · 0 errors</p>
            </div>
            <dl className="story-quote">
              <div>
                <dt className="mono">Boards</dt>
                <dd>5</dd>
              </div>
              <div>
                <dt className="mono">Stack</dt>
                <dd>4 layer</dd>
              </div>
              <div>
                <dt className="mono">Lead time</dt>
                <dd>3 days</dd>
              </div>
              <div>
                <dt className="mono">Total</dt>
                <dd>$28.40</dd>
              </div>
            </dl>
            <button className="story-order" type="button">
              Order 5 boards · $28.40
            </button>
            <p className="story-note">
              Gerbers exported, every rule checked, and the job quoted with the factory. That's a
              real board on its way to be manufactured — from three sentences of English.
            </p>
          </Beat>
        </div>

        <Reveal delay={0.1}>
          <p className="story-foot mono">The live, playable demo runs on desktop</p>
        </Reveal>
      </div>
    </div>
  );
}
