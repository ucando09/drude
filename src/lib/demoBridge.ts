/**
 * Bridge to the P-say-B mock running inside the demo iframe.
 *
 * The mock is a classic (non-module) script, so its top-level `function`
 * declarations land on `window` and are callable from here. Its top-level
 * `const`s (S, DEMO_PROMPTS, PROJECTS …) do NOT, so anything they gate is
 * reached by clicking real DOM instead. No eval anywhere.
 *
 * Every member is optional and every call is guarded: if the mock fails to
 * load, the section degrades to a static picture rather than throwing.
 */

export type StageId = "PLAN" | "SCHEMATIC" | "LAYOUT" | "FAB";
export type ModelId = "gemini-3.1-pro" | "claude-opus-5" | "psayb-hw-7b" | "psayb-cv-route";

type DemoWindow = Window &
  typeof globalThis & {
    resetDemo?: () => void;
    enterDraft?: (projectId: string) => void;
    switchTab?: (tab: string, reveal?: boolean) => void;
    setPane?: (which: "sidebar" | "canvas", open: boolean) => void;
    setExpanded?: (on: boolean) => void;
    send?: () => void;
    toast?: (msg: string) => void;
  };

/**
 * How many of the mock's three panes fit side by side at the width it is being
 * given. Its own grid is the source of these numbers:
 * `246px | minmax(360px,1fr) | minmax(420px,1.15fr)`, with `.sb-collapsed`
 * folding the sidebar to a 46px icon rail and `.cv-collapsed` removing the
 * workspace panel entirely.
 *
 *  - `full`     1026px+ — all three, sidebar open. What the mock was drawn for.
 *  - `compact`   826px+ — all three, sidebar folded to its rail.
 *  - `stacked`   under  — one pane at a time; the driver swaps between the
 *                         conversation and the workspace as the story moves.
 */
export type LayoutMode = "full" | "compact" | "stacked";

export function layoutModeFor(logicalWidth: number): LayoutMode {
  if (logicalWidth >= 1026) return "full";
  if (logicalWidth >= 826) return "compact";
  return "stacked";
}

export type Chapter = {
  id: string;
  label: string;
  caption: string;
  stage: StageId;
  model?: ModelId;
  /** false for the last beat, which continues inside the Fab thread */
  newConversation: boolean;
  prompt: string;
};

const PROJECT_ID = "cocktail-robot";

/**
 * Prompts are copied verbatim from the mock's own DEMO_PROMPTS.
 *
 * We deliberately do NOT drive this by dispatching the mock's F8 hotkey: F8
 * walks an internal index that only moves forward, so jumping straight to
 * chapter 4 from the rail would type chapter 1's prompt. Random access means
 * owning the text — which makes this the one place that has to follow a change
 * to the mock's prompts, stage ids or model ids.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: "plan",
    label: "Plan",
    caption: "No part numbers, no voltages looked up. Just what the thing does.",
    stage: "PLAN",
    model: "gemini-3.1-pro",
    newConversation: true,
    prompt:
      "I'm building a cocktail robot. It drives four peristaltic pumps at 12 volts, talks over Wi-Fi, and needs a USB-C port for firmware. I'm a software developer, not a hardware person — pick sensible parts for me.",
  },
  {
    id: "schematic",
    label: "Schematic",
    caption: "A regulator section lifted from a board that has actually been built.",
    stage: "SCHEMATIC",
    model: "psayb-hw-7b",
    newConversation: true,
    prompt:
      "Synthesize the schematic from @bom.json. Use a verified reference design for the buck converter rather than inventing the feedback network.",
  },
  {
    id: "layout",
    label: "Layout",
    caption: "96 nets, all routed. Placement is a vision problem, so this model is ours.",
    stage: "LAYOUT",
    model: "psayb-cv-route",
    newConversation: true,
    prompt:
      "Place and route it. Keep the board under 100 by 60 millimetres, four layers, pumps along the right edge, USB-C bottom right, and give the 12 volt rails proper width.",
  },
  {
    id: "fab",
    label: "Fab",
    caption: "It quotes the job — then refuses to place the order. This is the whole point.",
    stage: "FAB",
    model: "gemini-3.1-pro",
    newConversation: true,
    prompt: "Run DRC, export the Gerbers, and get me a quote for five boards.",
  },
  {
    id: "order",
    label: "Order",
    caption: "The clearance error clears, nothing else moves, and the button lights up.",
    stage: "FAB",
    newConversation: false,
    prompt: "Fix the clearance error on the 12 volt pour and re-run the check.",
  },
];

export type Bridge = ReturnType<typeof createBridge>;

export function createBridge(iframe: HTMLIFrameElement) {
  const win = () => iframe.contentWindow as DemoWindow | null;
  const doc = () => iframe.contentDocument;
  const composer = () => doc()?.querySelector<HTMLTextAreaElement>("#input") ?? null;

  let originalFocus: ((options?: FocusOptions) => void) | null = null;
  let mode: LayoutMode = "full";

  /**
   * The state we want the visitor to arrive at: workspace panel closed so the
   * conversation reads first, and the panel set to Easy (plain language) rather
   * than Skilled. The mode segment's handlers are bound at boot and call
   * switchTab without `reveal`, so clicking Easy will not reopen the panel.
   *
   * resetDemo() reopens both panes, so this has to run after every reset.
   */
  function openingLayout() {
    doc()?.querySelector<HTMLElement>('#modeSeg .seg[data-mode="easy"]')?.click();
    const w = win();
    w?.setPane?.("canvas", false); // also un-expands, in the mock's own setPane
    w?.setPane?.("sidebar", mode === "full");
  }

  return {
    ready() {
      const d = doc();
      return !!d && d.readyState === "complete" && !!win()?.switchTab;
    },

    /**
     * Exact busy probe. send() creates <div class="bubble" id="live"> and drops
     * the id when the reply finishes, so #live exists precisely while streaming.
     * (#btnSend.disabled is not usable — it is also true when the input is empty.)
     */
    busy() {
      return !!doc()?.getElementById("live");
    },

    /**
     * The mock focuses its composer programmatically (enterDraft does it on every
     * new draft). Focusing inside an iframe hands it the keyboard, so space,
     * PgDn and the arrow keys silently stop scrolling the page — and it can jump
     * the scroll position too. Nothing we drive ever needs that focus, and a real
     * click from the visitor focuses natively without going through here, so we
     * suppress programmatic focus outright.
     */
    patchFocus() {
      const w = win();
      if (!w || originalFocus) return;
      const proto = w.HTMLElement.prototype;
      originalFocus = proto.focus;
      proto.focus = function () {
        return undefined;
      };
    },

    restore() {
      const w = win();
      if (w && originalFocus) {
        w.HTMLElement.prototype.focus = originalFocus;
        originalFocus = null;
      }
    },

    /**
     * The mock declares `font: 13px/1.5 Inter` with no @font-face, and a parent
     * stylesheet does not cross into a child document — so without this it falls
     * back to Segoe UI and looks nothing like the product. The files are already
     * in the HTTP cache, so this costs a 304.
     *
     * Also contains overscroll so the thread / BOM / sidebar scrollers stop
     * chaining into the page when they hit their ends.
     *
     * And it repairs the mock's own narrow-viewport rule. The mock ships:
     *
     *     @media (max-width:1200px){ .body{grid-template-columns:210px 1fr 1fr} }
     *
     * which hard-codes three tracks with no var(--c1/--c2/--c3), so below
     * 1200px the collapse classes stop moving the columns: a closed workspace
     * panel is display:none but its 1fr track still holds the space, leaving a
     * dead band down the side of the frame. That rule never used to fire — the
     * frame was always 1600px wide — and it does now that the app is given the
     * width it actually has. Same declaration, variables put back, and later in
     * the cascade so it wins. minmax(0,1fr) rather than the desktop rule's 360
     * and 420 minimums, since at these widths those are what overflow.
     *
     * The expanded state needs one track rather than three zeroed ones for the
     * same reason the mock's own ⤢ is subtly wrong: it hides the other two
     * panes with display:none, which stops them being grid items at all, so the
     * workspace panel auto-places into the *first* column — the one the state
     * sets to 0px — and renders at zero width.
     */
    injectStyles() {
      const d = doc();
      if (!d || d.getElementById("drude-demo-patch")) return;

      document
        .querySelectorAll<HTMLLinkElement>('link[href*="fonts.g"]')
        .forEach((link) => d.head.appendChild(link.cloneNode(true)));

      const style = d.createElement("style");
      style.id = "drude-demo-patch";
      style.textContent = `html,body{overscroll-behavior:contain}
@media (max-width:1200px){
  .body{grid-template-columns:var(--c1,210px) var(--c2,minmax(0,1fr)) var(--c3,minmax(0,1fr))}
}
.body.cv-expanded{grid-template-columns:1fr}`;
      d.head.appendChild(style);
    },

    /**
     * #menuStage items have their handlers bound once at boot, and the S.locked
     * guard lives on #btnStage's handler rather than on the items — so a click
     * here sets the stage, calls syncAll() and switches the canvas tab.
     */
    stage(id: StageId) {
      doc()?.querySelector<HTMLElement>(`#menuStage .mi[data-s="${id}"]`)?.click();
    },

    model(id: ModelId) {
      doc()?.querySelector<HTMLElement>(`#menuModel .mi[data-m="${id}"]`)?.click();
    },

    newDraft() {
      win()?.enterDraft?.(PROJECT_ID);
    },

    openingLayout,

    /**
     * Re-applies the pane rules for a new width. Only ever collapses: widening
     * leaves the workspace panel closed until the next prompt opens it, which
     * costs a beat but can never leave three panes crammed into a viewport that
     * cannot hold them.
     */
    setLayout(next: LayoutMode) {
      mode = next;
      const w = win();
      if (!w) return;
      w.setPane?.("sidebar", next === "full");
      if (next === "stacked") w.setPane?.("canvas", false);
    },

    /**
     * Puts the conversation on screen before a prompt is typed into it. Only
     * does anything when stacked, where the workspace panel is covering it.
     */
    composerLayout() {
      if (mode === "stacked") win()?.setPane?.("canvas", false);
    },

    /** Reveals the workspace panel — used the moment a prompt is sent. */
    showCanvas() {
      // stacked has no room to show it beside the reply, so it waits for
      // resultLayout() instead and lets the visitor read the answer first
      if (mode !== "stacked") win()?.setPane?.("canvas", true);
    },

    /**
     * The payoff beat for a stacked viewport: once the reply has finished, the
     * workspace panel takes the whole frame so the BOM, the schematic and the
     * routed board are seen at full size rather than in a 40%-wide sliver.
     */
    resultLayout() {
      if (mode !== "stacked") return;
      const w = win();
      w?.setPane?.("canvas", true);
      w?.setExpanded?.(true);
    },

    hasComposer() {
      return !!composer();
    },

    /**
     * Writes the composer directly rather than calling the mock's typePrompt().
     * typePrompt holds an uncancellable module-level `typing` lock: a second call
     * while it is running is silently dropped, and its own setTimeout chain keeps
     * typing the old text to completion — so interrupting one chapter with
     * another used to leave the wrong prompt in the box. Dispatching `input` is
     * what the mock's own typing does, and it is what drives autosize() and the
     * send button's enabled state.
     */
    setComposer(text: string) {
      const w = win();
      const el = composer();
      if (!w || !el) return;
      el.value = text;
      el.dispatchEvent(new w.Event("input"));
    },

    submit() {
      doc()?.getElementById("btnSend")?.click();
    },

    /** resetDemo() with its "ready to record" toast silenced. */
    reset() {
      const w = win();
      if (!w?.resetDemo) return;
      const original = w.toast;
      w.toast = () => {};
      w.resetDemo();
      w.toast = original;
      openingLayout();
    },
  };
}

export type DriverPhase = "idle" | "waiting" | "typing" | "streaming";

export type DriverEvents = {
  onPhase: (phase: DriverPhase, index: number) => void;
  onChapterDone: (index: number) => void;
  /** a full pass finished and the walkthrough is starting again */
  onLoop: () => void;
};

/** how long the finished board sits there before the story starts over */
const LOOP_HOLD_MS = 5000;

/**
 * Plays chapters in sequence from a given index. Every wait is token-guarded, so
 * cancelling — or starting somewhere else — abandons the run in flight
 * immediately, including mid-keystroke.
 */
export function createDriver(bridge: Bridge, events: DriverEvents) {
  let token = 0;
  const timers = new Set<number>();

  function wait(ms: number, mine: number) {
    return new Promise<boolean>((resolve) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        resolve(mine === token);
      }, ms);
      timers.add(t);
    });
  }

  function until(predicate: () => boolean, mine: number, timeoutMs = 25000) {
    return new Promise<boolean>((resolve) => {
      const started = performance.now();
      const step = () => {
        if (mine !== token) return resolve(false);
        if (predicate()) return resolve(true);
        if (performance.now() - started > timeoutMs) return resolve(false);
        const t = window.setTimeout(() => {
          timers.delete(t);
          step();
        }, 80);
        timers.add(t);
      };
      step();
    });
  }

  /** Our own cancellable typing, at the same cadence the mock uses. */
  function type(text: string, mine: number) {
    return new Promise<boolean>((resolve) => {
      if (!bridge.hasComposer()) return resolve(false);
      bridge.setComposer("");
      let i = 0;
      const step = () => {
        if (mine !== token) return resolve(false);
        if (i >= text.length) return resolve(true);
        i += 1;
        bridge.setComposer(text.slice(0, i));
        const t = window.setTimeout(() => {
          timers.delete(t);
          step();
        }, 16 + Math.random() * 30);
        timers.add(t);
      };
      step();
    });
  }

  async function runOne(index: number, mine: number) {
    const chapter = CHAPTERS[index];

    // the mock cannot cancel a reply in flight, so wait it out rather than
    // reshuffling the thread underneath it
    events.onPhase("waiting", index);
    if (!(await until(() => bridge.ready() && !bridge.busy(), mine))) return false;

    if (chapter.newConversation) {
      bridge.newDraft();
      bridge.stage(chapter.stage);
      if (chapter.model) bridge.model(chapter.model);
      if (!(await wait(280, mine))) return false;
    }

    // on a stacked viewport the workspace panel is sitting over the composer
    bridge.composerLayout();

    events.onPhase("typing", index);
    if (!(await type(chapter.prompt, mine))) return false;
    if (!(await wait(420, mine))) return false;

    bridge.submit();
    // the panel opens on the prompt landing in the chat, not before it
    bridge.showCanvas();
    events.onPhase("streaming", index);

    if (!(await until(() => bridge.busy(), mine, 3000))) {
      return mine === token; // never started streaming; don't hang the rail
    }

    const finished = await until(() => !bridge.busy(), mine);
    if (finished) bridge.resultLayout();
    return finished;
  }

  function cancel() {
    token += 1;
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
  }

  /** Runs from startIndex to the end, then holds on the ordered board and starts
   *  the whole story again. Cancelling — pausing, or scrolling away — ends it. */
  async function play(startIndex: number) {
    cancel();
    const mine = token;
    let i = startIndex;

    for (;;) {
      if (!(await runOne(i, mine))) return;
      events.onChapterDone(i);

      if (i < CHAPTERS.length - 1) {
        if (!(await wait(1500, mine))) return;
        i += 1;
        continue;
      }

      if (!(await wait(LOOP_HOLD_MS, mine))) return;
      events.onLoop();
      bridge.reset();
      if (!(await wait(900, mine))) return;
      i = 0;
    }
  }

  return { play, cancel };
}
