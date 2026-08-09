# EN → KR translation manual

This is the source-of-truth for the Korean copy on the landing page. Every string
below is wired through a `t(key, englishFallback)` call in the React components —
if a key has no Korean text yet, the site just shows the English fallback, so the
page always works even half-translated.

**To add or change a translation:** write/edit the Korean line under the key in
`src/lib/translations/ko.ts` (the two files should stay in sync — this file is the
readable manual, `ko.ts` is what the app actually reads). Toggle language with the
EN/KO switch in the nav — it's a simple client-side toggle (localStorage-persisted),
no separate `/ko` URL.

Status legend: ✅ translated · ⬜ pending (shows English for now)

---

## Nav

| Key | English | Korean | Status |
|---|---|---|---|
| `nav.contact` | Contact | | ⬜ |

## Hero

| Key | English | Korean | Status |
|---|---|---|---|
| `hero.kicker` | Drude introduces P-say-B | | ⬜ |
| `hero.title.line1` | Vibe-coding, | 바이브코딩, | ✅ |
| `hero.title.line2.prefix` | for | 이번엔 | ✅ |
| `hero.title.line2.em` | hardware. | 하드웨어. | ✅ |
| `hero.sub` | Describe the device you want. **P-say-B** plans the board, draws the schematic, routes the layout, and hands it to the fab. **English in, hardware out.** | 핸드폰? 카메라? 손 선풍기? 만들고 싶은 제품을 말로 만들어보세요. P-say-B가 만들어드립니다. | ✅ |
| `hero.scroll` | Scroll | | ⬜ |

## Phone scroll scene

| Key | English | Korean | Status |
|---|---|---|---|
| `scene.kicker1` | Every device you own is three layers deep | 우리가 쓰는 모든 기기는 세 층으로 되어 있습니다 | ✅ |
| `scene.kicker2` | How the hardware layer gets made — today | 하드웨어의 공정과정에 대하여 | ✅ |
| `scene.glass.prompt` | drude — new project_ | | ⬜ |
| `scene.glass.bubble` | build me a heart-rate wearable. battery first, tiny, matte. | | ⬜ |
| `scene.labels.0.name` | Software | *(kept as "Software")* | ✅ |
| `scene.labels.0.desc` | The part the world already vibe-codes. | 세상이 이미 바이브 코딩으로 만들고 있는 층. | ✅ |
| `scene.labels.1.name` | Hardware | *(kept as "Hardware")* | ✅ |
| `scene.labels.1.desc` | The PCB underneath — every device's real brain. | 그 아래의 PCB. 모든 기기의 진짜 두뇌. | ✅ |
| `scene.labels.2.name` | Shell | *(kept as "Shell")* | ✅ |
| `scene.labels.2.desc` | The body that wraps it all together. | 그 전부를 감싸는 몸체. | ✅ |
| `scene.steps.0.title` | Plan the board | 보드를 기획한다 | ✅ |
| `scene.steps.0.body` | Decide what it must do. Pick the brain, the power, the radios — block by block, before a single trace exists. | 무엇을 하는 물건인지부터 정한다. 센서, 전원, 통신 - 설계하기 전 제품의 요구사항을 정의합니다. | ✅ |
| `scene.steps.1.title` | Schematic & layout | 회로도와 레이아웃 | ✅ |
| `scene.steps.1.body` | Wire every net. Place every part. Route every trace by hand. The slow, expert, unforgiving part. | 부품들을 연결하고, 부품을 배치하고, 모든 트레이스를 손으로 잡는다. | ✅ |
| `scene.steps.2.title` | Send it to the fab | 공장으로 넘긴다 | ✅ |
| `scene.steps.2.body` | Export gerbers, order the run, wait weeks for boards — and hope you got every last pad right. | 설계도를 뽑고, 발주를 넣고, 도착을 기다린다. | ✅ |

## Vision

| Key | English | Korean | Status |
|---|---|---|---|
| `vision.kicker` | What P-say-B does | P-SAY-B가 하는 일 | ✅ |
| `vision.statement.prefix` | We're automating | 세 단계를 | ✅ |
| `vision.statement.accent` | all three steps. | 하나의 워크플로우로. | ✅ |
| `vision.lede.prefix` | P-say-B takes a plain-English description of a device and carries it through the whole line — | P-say-B는 당신의 설명을 받고 끝까지 갑니다. | ✅ |
| `vision.lede.strong` | block plan, schematic, layout, fab-ready gerbers | 기획, 회로도, 레이아웃, 그리고 바로 최종 설계도까지 | ✅ |
| `vision.lede.suffix` | . What takes a hardware team weeks becomes a conversation. | . 하드웨어 팀이 몇 주를 쓰던 일이, 대화 한 번으로 됩니다. | ✅ |
| `vision.closer.heading.line1` | Everyone will build their own devices, | 이제 누구나 자신만의 기기를, | ✅ *(Claude-drafted, by request)* |
| `vision.closer.heading.line2` | to their own taste. | 각자의 취향대로 만들게 됩니다. | ✅ *(Claude-drafted, by request)* |
| `vision.closer.body` | Not picked off a shelf. Not compromised to fit a market of millions. Designed for a market of one — you — the way software already is. | 진열대에서 골라 쓰는 게 아니라, 수백만 명에 맞춰 타협하지도 않습니다. 소프트웨어가 이미 그렇듯, 단 한 사람 — 바로 당신 — 을 위해 설계됩니다. | ✅ *(Claude-drafted, by request)* |

## Founders

| Key | English | Korean | Status |
|---|---|---|---|
| `founders.kicker` | The team | | ⬜ |
| `founders.heading` | Built by two people who got tired of waiting for hardware. | 하드웨어의 손쉬운 제작을 위한 마음으로 모인 팀 | ✅ |
| `founders.0.name` | Jinho Chang | 장진호 | ✅ |
| `founders.0.role` | Co-founder · CEO | | ⬜ |
| `founders.0.lines.0` | Econ major @ CAU / Econometrics-Based Empirical Research | 중앙대 경제학부 재학 / 실증분석연구 | ✅ |
| `founders.0.lines.1` | Excellence Award, Economics Forum / Presented research at National Taiwan University (NTU) as the university representative | 학교 대표로 대만국립대학(NTU)에서 경제학 포럼 연구 발표 | ✅ |
| `founders.0.lines.2` | President, Economics Society S-Kian — Managed 77 members · Officially certified by Korea Investment & Securities · Established inter-university partnerships | 경제학회 S-Kian 회장 — 77명 규모 운영 · 한국투자증권 공식 인증 · 대학 간 협력 체결 | ✅ |
| `founders.0.lines.3` | A dream: hardware, accessible to everyone. | *(omitted in Korean)* | ✅ |
| `founders.1.name` | Ian Lee | 이한준 | ✅ |
| `founders.1.role` | Co-founder · CTO | | ⬜ |
| `founders.1.lines.0` | EEE major @ CAU | 중앙대 전자전기공학부 재학 | ✅ |
| `founders.1.lines.1` | Engineered a computer vision workflow to detect vehicle presence and automate parking availability tracking | 차량 유무를 인식해 주차 가능 여부를 자동 추적하는 컴퓨터 비전 워크플로우 개발 | ✅ |
| `founders.1.lines.2` | Experience in combining hands-on software development expertise with experience leading full-lifecycle engineering projects | 소프트웨어 개발 및 엔지니어링 프로젝트 전과정을 이끈 경험 갖춤 | ✅ |
| `founders.1.lines.3` | i like building stuff i guess | *(omitted in Korean)* | ✅ |

## Footer

| Key | English | Korean | Status |
|---|---|---|---|
| `footer.tag` | P-say-B — vibe-coding, for hardware. | | ⬜ |
| `footer.copy` | © 2026 Drude. Seoul, KR. | | ⬜ |

## Live demo (all viewports) — rail labels & captions only

The five prompts that get **typed into the embedded IDE mock must stay in English**
— `public/demo/index.html` pattern-matches on English keywords (e.g. `/cocktail|pump|drink|bartend|robot/i`)
to decide what to show, so a Korean prompt would silently break the demo. Only the
React-rendered chrome around it (rail button labels, the caption line) is translatable.

| Key | English | Korean | Status |
|---|---|---|---|
| `demo.railLabel` | Demo chapters (aria-label, not visible) | | ⬜ |
| `demo.defaultCaption` | One sentence of English to a board on its way to the fab, in five steps. | | ⬜ |
| `demo.waitingCaption` | Letting the current reply finish… | | ⬜ |
| `demo.chapters.0.label` | Plan | | ⬜ |
| `demo.chapters.0.caption` | No part numbers, no voltages looked up. Just what the thing does. | | ⬜ |
| `demo.chapters.1.label` | Schematic | | ⬜ |
| `demo.chapters.1.caption` | A regulator section lifted from a board that has actually been built. | | ⬜ |
| `demo.chapters.2.label` | Layout | | ⬜ |
| `demo.chapters.2.caption` | 96 nets, all routed. Placement is a vision problem, so this model is ours. | | ⬜ |
| `demo.chapters.3.label` | Fab | | ⬜ |
| `demo.chapters.3.caption` | It quotes the job — then refuses to place the order. This is the whole point. | | ⬜ |
| `demo.chapters.4.label` | Order | | ⬜ |
| `demo.chapters.4.caption` | The clearance error clears, nothing else moves, and the button lights up. | | ⬜ |

## Page metadata (browser tab title + SEO description)

| Key | English | Korean | Status |
|---|---|---|---|
| `meta.title` | Drude — Vibe-Coding, for Hardware | | ⬜ |
| `meta.description` | P-say-B by Drude turns a plain-English idea into a manufacturable PCB. Plan, schematic, layout, fab — one prompt away. | | ⬜ |
