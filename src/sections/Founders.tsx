import Reveal from "../components/Reveal";

const FOUNDERS = [
  {
    initials: "JC",
    name: "Jinho Chang",
    role: "Co-founder · CEO",
    lines: [
      "Econ major @ CAU / Econometrics-Based Empirical Research",
      "Excellence Award, Economics Forum / Presented research at National Taiwan University (NTU) as the university representative",
      "President, Economics Society S-Kian — Managed 77 members · Officially certified by Korea Investment & Securities · Established inter-university partnerships",
      "A dream: hardware, accessible to everyone.",
    ],
  },
  {
    initials: "IL",
    name: "Ian Lee",
    role: "Co-founder · CTO",
    lines: [
      "EEE major @ CAU",
      "Engineered a computer vision workflow to detect vehicle presence and automate parking availability tracking",
      "Experience in combining hands-on software development expertise with experience leading full-lifecycle engineering projects",
      "i like building stuff i guess",
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
