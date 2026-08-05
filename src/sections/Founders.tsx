import Reveal from "../components/Reveal";

/* TODO(founders): swap in real names, roles, resume lines, and links. */
const FOUNDERS = [
  {
    initials: "IL",
    name: "Founder Name",
    role: "Co-founder · Hardware",
    lines: [
      "Resume line one — degree, lab, or company",
      "Resume line two — the project or award that matters",
      "Resume line three — why they can build this",
    ],
  },
  {
    initials: "CF",
    name: "Co-founder Name",
    role: "Co-founder · Software",
    lines: [
      "Resume line one — degree, lab, or company",
      "Resume line two — the project or award that matters",
      "Resume line three — why they can build this",
    ],
  },
];

export default function Founders() {
  return (
    <section className="founders">
      <div className="container">
        <div className="founders-head">
          <Reveal>
            <span className="mono">The team</span>
            <h2>Built by two people who got tired of waiting for hardware.</h2>
          </Reveal>
        </div>
        <div className="founder-grid">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.12}>
              <div className="founder-card">
                <div className="founder-top">
                  <div className="founder-avatar">{f.initials}</div>
                  <div>
                    <div className="founder-name">{f.name}</div>
                    <div className="founder-role">{f.role}</div>
                  </div>
                </div>
                <ul className="founder-lines">
                  {f.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
