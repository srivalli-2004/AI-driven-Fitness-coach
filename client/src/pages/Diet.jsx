import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../utils/api";
import Pulse from "../components/Pulse";

function Diet() {
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
      setPlan(data.dietPlan);
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
      setPlan(data.dietPlan);
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  }

  if (!token) {
    return (
      <section className="page-section">
        <p className="eyebrow">Diet Plans</p>
        <h2>Log in to see your plan</h2>
        <p className="page-section__intro">
          Your calorie and macro targets are calculated from your profile —
          sign up or log in to see them.
        </p>
        <Link className="btn-primary" to="/signup" style={{ textDecoration: "none", display: "inline-block" }}>
          Get started
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section">
      <p className="eyebrow">Fuel your training</p>
      <h2>Diet Plan</h2>
      <p className="page-section__intro">
        Calculated from your profile — {user?.dietaryPreference?.replace("_", " ")} preference.
      </p>

      <Pulse variant="divider" />

      {loading && <p className="page-section__intro">Loading your plan…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && plan && (
        <>
          <div className="stat-grid" style={{ marginBottom: "2.5rem" }}>
            <div className="stat-card">
              <span className="stat-card__value">{plan.dailyCalories}</span>
              <span className="stat-card__label">Daily calories</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__value">
                {plan.macros.proteinGrams}
                <span className="stat-card__unit">g</span>
              </span>
              <span className="stat-card__label">Protein</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__value">
                {plan.macros.carbsGrams}
                <span className="stat-card__unit">g</span>
              </span>
              <span className="stat-card__label">Carbs</span>
            </div>
          </div>

          <div className="plan-grid">
            {plan.sampleMeals.map((meal) => (
              <article className="plan-card" key={meal.meal}>
                <span className="plan-card__index plan-card__tag--mono">{meal.calories} kcal</span>
                <h3>{meal.meal}</h3>
                <ul className="exercise-list">
                  {meal.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
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

export default Diet;
