import Reveal from "../components/Reveal";

export default function Vision() {
  return (
    <section className="vision">
      <div className="container">
        <Reveal>
          <span className="mono" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
            What P-say-B does
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="vision-statement">
            We're automating <span className="accent">all three steps.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="vision-lede">
            P-say-B takes a plain-English description of a device and carries it through
            the whole line — <strong>block plan, schematic, layout, fab-ready gerbers</strong>.
            What takes a hardware team weeks becomes a conversation.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="parallel">
            <div className="parallel-cell">
              <span className="tag mono">Software · already happened</span>
              <h4>Vibe coding collapsed the distance between an idea and a running app.</h4>
              <p>
                Millions of people who never called themselves programmers now describe
                what they want and ship it the same afternoon.
              </p>
            </div>
            <div className="parallel-cell next">
              <span className="tag mono">Hardware · happening next</span>
              <h4>P-say-B collapses the distance between an idea and a working board.</h4>
              <p>
                People who never called themselves engineers will describe a device and
                hold it in their hands a week later.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="vision-closer">
          <Reveal>
            <h2>
              Everyone will build their own devices,
              <br />
              <span className="serif-i">to their own taste.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p>
              Not picked off a shelf. Not compromised to fit a market of millions.
              Designed for a market of one — you — the way software already is.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
