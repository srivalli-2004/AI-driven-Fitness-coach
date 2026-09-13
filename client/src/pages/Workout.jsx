import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../utils/api";
import Pulse from "../components/Pulse";

function Workout() {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadPlan();
  }, [token]);

  async function loadPlan() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/plans", { token });
      setPlan(data.workoutPlan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    setError("");
    try {
      const data = await apiRequest("/plans/generate", { method: "POST", token });
      setPlan(data.workoutPlan);
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  }

  if (!token) {
    return (
      <section className="page-section">
        <p className="eyebrow">Workout Plans</p>
        <h2>Log in to see your plan</h2>
        <p className="page-section__intro">
          Your workout plan is generated from your profile — sign up or log in
          to see it.
        </p>
        <Link className="btn-primary" to="/signup" style={{ textDecoration: "none", display: "inline-block" }}>
          Get started
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section">
      <p className="eyebrow">Your personalized schedule</p>
      <h2>Workout Plan</h2>
      <p className="page-section__intro">
        Built from your profile — {user?.goal?.replace("_", " ")}, {user?.activityLevel} activity level.
      </p>

      <Pulse variant="divider" />

      {loading && <p className="page-section__intro">Loading your plan…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && plan && (
        <>
          <div className="plan-grid">
            {plan.days.map((day) => (
              <article className="plan-card" key={day.day}>
                <span className="plan-card__index">{day.day}</span>
                <h3>{day.focus}</h3>
                {day.exercises.length > 0 ? (
                  <ul className="exercise-list">
                    {day.exercises.map((ex) => (
                      <li key={ex.name}>
                        {ex.name} — {ex.sets} × {ex.reps}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Take the day to rest and recover.</p>
                )}
              </article>
            ))}
          </div>

          <button
            className="btn-primary"
            style={{ marginTop: "2rem" }}
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? "Regenerating…" : "Regenerate plan"}
          </button>
        </>
      )}

      {!loading && !plan && !error && (
        <p className="page-section__intro">
          No plan yet — try regenerating below.
        </p>
      )}
    </section>
  );
}

export default Workout;
