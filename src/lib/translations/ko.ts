/**
 * Korean copy, keyed to match the English fallback each `t(key, en)` call carries
 * in the component. A key missing here just falls back to the English string —
 * see en-to-kr-manual.md for the running list of what's translated vs. pending.
 */
export const ko: Record<string, string> = {
  "hero.title.line1": "바이브코딩,",
  "hero.title.line2.prefix": "이번엔 ",
  "hero.title.line2.em": "하드웨어.",
  "hero.sub": "핸드폰? 카메라? 손 선풍기? 만들고 싶은 제품을 말로 만들어보세요. P-say-B가 만들어드립니다.",

  "scene.kicker1": "우리가 쓰는 모든 기기는 세 층으로 되어 있습니다",
  "scene.kicker2": "하드웨어의 공정과정에 대하여",

  "scene.labels.0.desc": "세상이 이미 바이브 코딩으로 만들고 있는 층.",
  "scene.labels.1.desc": "그 아래의 PCB. 모든 기기의 진짜 두뇌.",
  "scene.labels.2.desc": "그 전부를 감싸는 몸체.",

  "scene.steps.0.title": "보드를 기획한다",
  "scene.steps.0.body":
    "무엇을 하는 물건인지부터 정한다. 센서, 전원, 통신 - 설계하기 전 제품의 요구사항을 정의합니다.",
  "scene.steps.1.title": "회로도와 레이아웃",
  "scene.steps.1.body": "부품들을 연결하고, 부품을 배치하고, 모든 트레이스를 손으로 잡는다.",
  "scene.steps.2.title": "공장으로 넘긴다",
  "scene.steps.2.body": "설계도를 뽑고, 발주를 넣고, 도착을 기다린다.",

  "vision.kicker": "P-SAY-B가 하는 일",
  "vision.statement.prefix": "세 단계를 ",
  "vision.statement.accent": "하나의 워크플로우로.",
  "vision.lede.prefix": "P-say-B는 당신의 설명을 받고 끝까지 갑니다. ",
  "vision.lede.strong": "기획, 회로도, 레이아웃, 그리고 바로 최종 설계도까지",
  "vision.lede.suffix": ". 하드웨어 팀이 몇 주를 쓰던 일이, 대화 한 번으로 됩니다.",

  "vision.closer.heading.line1": "이제 누구나 자신만의 기기를,",
  "vision.closer.heading.line2": "각자의 취향대로 만들게 됩니다.",
  "vision.closer.body":
    "진열대에서 골라 쓰지도, 수백만 명에 맞춰 타협하지도 않습니다. 소프트웨어가 이미 그렇듯, 단 한 사람 — 바로 당신 — 을 위해 설계됩니다.",

  "founders.heading": "하드웨어의 손쉬운 제작을 위해 모인 팀 소개",
  "founders.0.name": "장진호",
  "founders.0.lines.0": "중앙대 경제학부 재학 / 데이터 기반 실증분석 연구",
  "founders.0.lines.1": "학교 대표로 대만국립대학(NTU)에서 경제학 포럼 연구 발표",
  "founders.0.lines.2": "경제학회 S-Kian 회장 — 77명 규모 운영 · 한국투자증권 공식 인증 · 대학 간 협력 체결",
  "founders.0.lines.3": "",

  "founders.1.name": "이한준",
  "founders.1.lines.0": "중앙대 전자전기공학부 재학",
  "founders.1.lines.1": "차량 유무를 인식해 주차 가능 여부를 자동 추적하는 컴퓨터 비전 워크플로우 개발",
  "founders.1.lines.2": "소프트웨어 개발 및 엔지니어링 프로젝트 전과정을 이끈 경험 갖춤",
  "founders.1.lines.3": "",

  "demo.railLabel": "데모 챕터",
  "demo.defaultCaption": "문장 하나로 다섯 단계를 거쳐, 제작 단계로 향하는 기판까지.",
  "demo.waitingCaption": "현재 답변이 끝나길 기다리는 중…",
  "demo.chapters.0.label": "기획",
  "demo.chapters.0.caption": "부품 번호도, 전압 확인도 필요 없이 — 무엇을 만들고 싶은지만 말하면 됩니다.",
  "demo.chapters.1.label": "회로도",
  "demo.chapters.1.caption": "실제로 만들어져 검증된 보드에서 그대로 가져온 레귤레이터 회로.",
  "demo.chapters.2.label": "레이아웃",
  "demo.chapters.2.caption": "96개 net을 모두 배선. 배치는 비전 문제라, 자체 모델이 직접 처리합니다.",
  "demo.chapters.3.label": "제작",
  "demo.chapters.3.caption": "견적은 내주지만 — 주문은 거부합니다. 바로 이게 핵심입니다.",
  "demo.chapters.4.label": "주문",
  "demo.chapters.4.caption": "간격 오류가 해결되고, 다른 건 그대로인 채 버튼에 불이 들어옵니다.",

  "demoStory.beat1.title": "원하는 것을 설명하면",
  "demoStory.beat1.bubble":
    "칵테일 로봇을 만들고 있어요. 12볼트 연동 펌프 4개를 구동하고, Wi-Fi로 통신하고, 펌웨어용 USB-C 포트가 필요해요. 저는 소프트웨어 개발자라 하드웨어는 잘 몰라요 — 적당한 부품을 골라주세요.",
  "demoStory.beat1.note": "부품 번호도, 직접 찾아봐야 할 전압도 없습니다.",
  "demoStory.beat2.title": "부품을 골라줍니다",
  "demoStory.beat2.more": "+ 10개 항목 더",
  "demoStory.beat2.note.strong1": "52,418개 부품을",
  "demoStory.beat2.note.mid": "실시간 벤더 재고와 대조해 검색. 14개 항목 모두 재고 있음,",
  "demoStory.beat2.note.strong2": "$18.62",
  "demoStory.beat2.note.tail": "에 보드 한 장. 9개월간 재고가 없는 칩을 고르는 게 하드웨어 프로젝트를 정말로 망칩니다.",
  "demoStory.beat3.title": "그리고 그려서 배선합니다",
  "demoStory.beat3.note.strong": "96개 net",
  "demoStory.beat3.note.tail": " 모두 배선 완료 · 4레이어 · 100 × 60 mm. 펌프 드라이버는 한쪽 가장자리에 모여 구리 영역을 공유해서, 서로 열을 주고받는 대신 함께 방열합니다.",
  "demoStory.beat4.title": "그다음 검사하고 주문합니다",
  "demoStory.beat4.drc": "디자인 룰 체크 1,800건 · 오류 0건",
  "demoStory.beat4.boards": "보드 수",
  "demoStory.beat4.stack": "레이어",
  "demoStory.beat4.leadTime": "제작 기간",
  "demoStory.beat4.total": "총액",
  "demoStory.beat4.order": "보드 5장 주문 · $28.40",
  "demoStory.beat4.note": "거버를 내보내고, 모든 규칙을 검사하고, 공장에서 견적까지 받았습니다. 문장 세 개로, 실제로 제작에 들어가는 보드가 나왔습니다.",
  "demoStory.foot": "실제로 조작 가능한 라이브 데모는 데스크톱에서 실행됩니다",
};
