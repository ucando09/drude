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

## Live demo (desktop)

The demo mock itself is now bilingual: `public/demo/index.ko.html` is a hand-translated
fork of `public/demo/index.html` (chat text, sidebar folder/session names, the Plan/
Schematic/Layout/Fab workspace panel — both Skilled and Easy modes). `DemoFrame`
picks between the two based on `useI18n().language`; `LiveDemo` remounts the whole
desktop demo (`key={language}`) on toggle so the iframe reloads with the right file.

The five prompts that get **typed into the embedded IDE mock are per-language**: each
`CHAPTERS[]` entry in `src/lib/demoBridge.ts` carries both `prompt` (English) and
`promptKo` (Korean), and `createDriver(bridge, events, language)` picks between them.
Each mock's own `SCRIPT` array pattern-matches the typed text to decide which canned
reply to show — `index.html` on English keywords (e.g. `/cocktail|pump|drink|bartend|robot/i`),
`index.ko.html` on the matching Korean ones (e.g. `/칵테일|펌프|로봇|음료|바텐더/`) — so a
prompt and its mock's regexes have to change together, in both `demoBridge.ts` and the
corresponding `index*.html`. `sync:demo` only ever touches `index.html`; re-translating
`index.ko.html` (prompts, regexes, and copy alike) after a source-mock change is a
manual step (see the comment at the top of that file).

The rail chrome around the iframe (button labels, the caption line) is separately
translated below, same as any other React-rendered copy.

| Key | English | Korean | Status |
|---|---|---|---|
| `demo.railLabel` | Demo chapters (aria-label, not visible) | 데모 챕터 | ✅ |
| `demo.defaultCaption` | One sentence of English to a board on its way to the fab, in five steps. | 문장 하나로 다섯 단계를 거쳐, 제작 단계로 향하는 기판까지. | ✅ |
| `demo.waitingCaption` | Letting the current reply finish… | 현재 답변이 끝나길 기다리는 중… | ✅ |
| `demo.chapters.0.label` | Plan | 기획 | ✅ |
| `demo.chapters.0.caption` | No part numbers, no voltages looked up. Just what the thing does. | 부품 번호도, 전압 확인도 필요 없이 — 무엇을 만들고 싶은지만 말하면 됩니다. | ✅ |
| `demo.chapters.1.label` | Schematic | 회로도 | ✅ |
| `demo.chapters.1.caption` | A regulator section lifted from a board that has actually been built. | 실제로 만들어져 검증된 보드에서 그대로 가져온 레귤레이터 회로. | ✅ |
| `demo.chapters.2.label` | Layout | 레이아웃 | ✅ |
| `demo.chapters.2.caption` | 96 nets, all routed. Placement is a vision problem, so this model is ours. | 96개 net을 모두 배선. 배치는 비전 문제라, 자체 모델이 직접 처리합니다. | ✅ |
| `demo.chapters.3.label` | Fab | 제작 | ✅ |
| `demo.chapters.3.caption` | It quotes the job — then refuses to place the order. This is the whole point. | 견적은 내주지만 — 주문은 거부합니다. 바로 이게 핵심입니다. | ✅ |
| `demo.chapters.4.label` | Order | 주문 | ✅ |
| `demo.chapters.4.caption` | The clearance error clears, nothing else moves, and the button lights up. | 간격 오류가 해결되고, 다른 건 그대로인 채 버튼에 불이 들어옵니다. | ✅ |

## Demo story (mobile/tablet fallback, <1024px)

Fully static, React-rendered — safe to translate in full (unlike the live demo above).

| Key | English | Korean | Status |
|---|---|---|---|
| `demoStory.beat1.title` | You describe the thing | 원하는 것을 설명하면 | ✅ |
| `demoStory.beat1.bubble` | I'm building a cocktail robot. It drives four peristaltic pumps at 12 volts, talks over Wi-Fi, and needs a USB-C port for firmware. I'm a software developer, not a hardware person — pick sensible parts for me. | 칵테일 로봇을 만들고 있어요. 12볼트 연동 펌프 4개를 구동하고, Wi-Fi로 통신하고, 펌웨어용 USB-C 포트가 필요해요. 저는 소프트웨어 개발자라 하드웨어는 잘 몰라요 — 적당한 부품을 골라주세요. | ✅ |
| `demoStory.beat1.note` | No part numbers. No voltages you had to look up. | 부품 번호도, 직접 찾아봐야 할 전압도 없습니다. | ✅ |
| `demoStory.beat2.title` | It picks the parts | 부품을 골라줍니다 | ✅ |
| `demoStory.beat2.more` | + 10 more lines | + 10개 항목 더 | ✅ |
| `demoStory.beat2.note.strong1` | 52,418 parts | 52,418개 부품을 | ✅ |
| `demoStory.beat2.note.mid` | searched against live vendor stock. All 14 lines in stock, | 실시간 벤더 재고와 대조해 검색. 14개 항목 모두 재고 있음, | ✅ |
| `demoStory.beat2.note.strong2` | $18.62 | $18.62 | ✅ |
| `demoStory.beat2.note.tail` | a board. Picking a chip that's out of stock for nine months is what actually kills hardware projects. | 에 보드 한 장. 9개월간 재고가 없는 칩을 고르는 게 하드웨어 프로젝트를 정말로 망칩니다. | ✅ |
| `demoStory.beat3.title` | It draws it and routes it | 그리고 그려서 배선합니다 | ✅ |
| `demoStory.beat3.note.strong` | 96 nets | 96개 net | ✅ |
| `demoStory.beat3.note.tail` | , all routed · 4 layers · 100 × 60 mm. The pump drivers sit along one edge sharing a copper pour, so they spread heat instead of cooking each other. | 모두 배선 완료 · 4레이어 · 100 × 60 mm. 펌프 드라이버는 한쪽 가장자리에 모여 구리 영역을 공유해서, 서로 열을 주고받는 대신 함께 방열합니다. | ✅ |
| `demoStory.beat4.title` | Then it checks it and orders it | 그다음 검사하고 주문합니다 | ✅ |
| `demoStory.beat4.drc` | 1,800 design-rule checks · 0 errors | 디자인 룰 체크 1,800건 · 오류 0건 | ✅ |
| `demoStory.beat4.boards` | Boards | 보드 수 | ✅ |
| `demoStory.beat4.stack` | Stack | 레이어 | ✅ |
| `demoStory.beat4.leadTime` | Lead time | 제작 기간 | ✅ |
| `demoStory.beat4.total` | Total | 총액 | ✅ |
| `demoStory.beat4.order` | Order 5 boards · $28.40 | 보드 5장 주문 · $28.40 | ✅ |
| `demoStory.beat4.note` | Gerbers exported, every rule checked, and the job quoted with the factory. That's a real board on its way to be manufactured — from three sentences of English. | 거버를 내보내고, 모든 규칙을 검사하고, 공장에서 견적까지 받았습니다. 문장 세 개로, 실제로 제작에 들어가는 보드가 나왔습니다. | ✅ |
| `demoStory.foot` | The live, playable demo runs on desktop | 실제로 조작 가능한 라이브 데모는 데스크톱에서 실행됩니다 | ✅ |

## Page metadata (browser tab title + SEO description)

| Key | English | Korean | Status |
|---|---|---|---|
| `meta.title` | Drude — Vibe-Coding, for Hardware | | ⬜ |
| `meta.description` | P-say-B by Drude turns a plain-English idea into a manufacturable PCB. Plan, schematic, layout, fab — one prompt away. | | ⬜ |
