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

import type { Language } from "./i18n";

export type StageId = "PLAN" | "SCHEMATIC" | "LAYOUT" | "FAB";
export type ModelId = "gemini-3.1-pro" | "claude-opus-5" | "psayb-hw-7b" | "psayb-cv-route";

type DemoWindow = Window &
  typeof globalThis & {
    resetDemo?: () => void;
    enterDraft?: (projectId: string) => void;
    switchTab?: (tab: string, reveal?: boolean) => void;
    setPane?: (which: "sidebar" | "canvas", open: boolean) => void;
    send?: () => void;
    toast?: (msg: string) => void;
  };

export type Chapter = {
  id: string;
  label: string;
  caption: string;
  stage: StageId;
  model?: ModelId;
  /** false for the last beat, which continues inside the Fab thread */
  newConversation: boolean;
  /** typed into index.html — must keep matching that file's SCRIPT regexes */
  prompt: string;
  /** typed into index.ko.html — must keep matching that file's own (Korean) SCRIPT regexes */
  promptKo: string;
};

const PROJECT_ID = "cocktail-robot";

/**
 * Prompts are copied verbatim from each mock's own DEMO_PROMPTS (index.html
 * and index.ko.html carry separate copies, since the Korean mock's SCRIPT
 * entries match Korean keywords rather than English ones).
 *
 * We deliberately do NOT drive this by dispatching the mock's F8 hotkey: F8
 * walks an internal index that only moves forward, so jumping straight to
 * chapter 4 from the rail would type chapter 1's prompt. Random access means
 * owning the text — which makes this the one place that has to follow a change
 * to either mock's prompts, stage ids or model ids.
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
    promptKo:
      "칵테일 로봇을 만들고 있어. 12볼트로 연동 펌프 4개를 구동하고, Wi-Fi로 통신하고, 펌웨어용 USB-C 포트가 필요해. 나는 소프트웨어 개발자라 하드웨어는 잘 몰라 — 적당한 부품을 골라줘.",
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
    promptKo:
      "@bom.json으로 회로도를 합성해 줘. 벅 컨버터는 피드백 네트워크를 지어내지 말고, 검증된 참조 설계를 사용해 줘.",
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
    promptKo:
      "배치하고 배선해 줘. 보드는 100×60밀리미터 이내, 4레이어로 하고, 펌프는 오른쪽 가장자리에, USB-C는 오른쪽 아래에 배치해 줘. 12볼트 레일은 폭을 넉넉하게 줘.",
  },
  {
    id: "fab",
    label: "Fab",
    caption: "It quotes the job — then refuses to place the order. This is the whole point.",
    stage: "FAB",
    model: "gemini-3.1-pro",
    newConversation: true,
    prompt: "Run DRC, export the Gerbers, and get me a quote for five boards.",
    promptKo: "DRC를 실행하고, 거버 파일을 내보내고, 보드 5장 견적을 받아줘.",
  },
  {
    id: "order",
    label: "Order",
    caption: "The clearance error clears, nothing else moves, and the button lights up.",
    stage: "FAB",
    newConversation: false,
    prompt: "Fix the clearance error on the 12 volt pour and re-run the check.",
    promptKo: "12볼트 구리 영역의 간격 오류를 고치고 검사를 다시 실행해 줘.",
  },
];

export type Bridge = ReturnType<typeof createBridge>;

export function createBridge(iframe: HTMLIFrameElement) {
  const win = () => iframe.contentWindow as DemoWindow | null;
  const doc = () => iframe.contentDocument;
  const composer = () => doc()?.querySelector<HTMLTextAreaElement>("#input") ?? null;

  let originalFocus: ((options?: FocusOptions) => void) | null = null;

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
    win()?.setPane?.("canvas", false);
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
     */
    injectStyles() {
      const d = doc();
      if (!d || d.getElementById("drude-demo-patch")) return;

      document
        .querySelectorAll<HTMLLinkElement>('link[href*="fonts.g"]')
        .forEach((link) => d.head.appendChild(link.cloneNode(true)));

      const style = d.createElement("style");
      style.id = "drude-demo-patch";
      style.textContent = "html,body{overscroll-behavior:contain}";
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

    /** Reveals the workspace panel — used the moment a prompt is sent. */
    showCanvas() {
      win()?.setPane?.("canvas", true);
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
export function createDriver(bridge: Bridge, events: DriverEvents, language: Language = "en") {
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

    events.onPhase("typing", index);
    const promptText = language === "ko" ? chapter.promptKo : chapter.prompt;
    if (!(await type(promptText, mine))) return false;
    if (!(await wait(420, mine))) return false;

    bridge.submit();
    // the panel opens on the prompt landing in the chat, not before it
    bridge.showCanvas();
    events.onPhase("streaming", index);

    if (!(await until(() => bridge.busy(), mine, 3000))) {
      return mine === token; // never started streaming; don't hang the rail
    }
    return until(() => !bridge.busy(), mine);
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
