import { useNavigate } from "react-router-dom";
import Pulse from "../components/Pulse";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <p className="eyebrow">Track. Train. Transform.</p>
          <h1>
            Your fitness
            <br />
            has a heartbeat.
          </h1>
          <p className="hero__sub">
            Personalized workout and diet plans that adapt to your progress —
            not a one-size-fits-all plan you'll abandon in a week.
          </p>
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            Start Your Journey
          </button>
        </div>
        <div className="hero__graphic">
          <Pulse variant="hero" />
        </div>
      </section>

      <Pulse variant="divider" />

      <section className="features">
        <h2>Explore the plan</h2>
        <div className="features__grid">
          <article className="feature-card">
            <span className="feature-card__index">01</span>
            <h3>Workout Plans</h3>
            <p>Choose the right plan to lose weight, build muscle, or stay fit.</p>
            <button className="btn-ghost" onClick={() => navigate("/workout")}>
              Explore →
            </button>
          </article>

          <article className="feature-card">
            <span className="feature-card__index">02</span>
            <h3>Diet Plans</h3>
            <p>Get personalized meal plans and track your nutrition goals.</p>
            <button className="btn-ghost" onClick={() => navigate("/diet")}>
              Explore →
            </button>
          </article>

          <article className="feature-card">
            <span className="feature-card__index">03</span>
            <h3>Progress Tracker</h3>
            <p>Track your progress, set goals, and stay motivated.</p>
            <button className="btn-ghost" onClick={() => navigate("/progress")}>
              Start tracking →
            </button>
          </article>
        </div>
      </section>
    </>
  );
}

export default Home;
