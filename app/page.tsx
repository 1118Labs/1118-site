import { ComparisonSlider } from "@/components/ComparisonSlider";

export default function Home() {
  return (
    <main>
      <section className="scene-one" aria-labelledby="scene-one-title">
        <div className="scene-one-inner">
          <div className="scene-one-copy" id="belief">
            <p className="scene-one-label">1118</p>
            <h1 id="scene-one-title">
              <span>We build</span>
              <span>the software</span>
              <span className="scene-one-emphasis">we keep</span>
              <span className="scene-one-emphasis">looking for.</span>
            </h1>
            <a className="scene-one-link" href="#work">
              Explore our work
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="scene-one-portrait" id="work">
            <ComparisonSlider priority />
          </div>
        </div>
      </section>
      <div className="scene-one-flow" aria-hidden="true" />
    </main>
  );
}
