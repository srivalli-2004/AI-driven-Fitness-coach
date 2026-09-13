import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../utils/api";
import Pulse from "../components/Pulse";

function Progress() {
  const { token } = useAuth();
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ weight: "", workoutCompleted: false, notes: "" });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadProgress();
  }, [token]);

  async function loadProgress() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/progress", { token });
      setEntries(data.entries);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await apiRequest("/progress", {
        method: "POST",
        token,
        body: {
          weight: form.weight ? Number(form.weight) : undefined,
          workoutCompleted: form.workoutCompleted,
          notes: form.notes || undefined,
        },
      });
      setForm({ weight: "", workoutCompleted: false, notes: "" });
      await loadProgress();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <section className="page-section">
        <p className="eyebrow">Progress Tracker</p>
        <h2>Log in to track your progress</h2>
        <p className="page-section__intro">
          Sign up or log in to start logging workouts and weigh-ins.
        </p>
        <Link className="btn-primary" to="/signup" style={{ textDecoration: "none", display: "inline-block" }}>
          Get started
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section">
      <p className="eyebrow">Your numbers</p>
      <h2>Progress Tracker</h2>
      <p className="page-section__intro">
        Log a check-in any time — your streak and consistency update automatically.
      </p>

      <Pulse variant="divider" />

      {error && <p className="form-error">{error}</p>}

      {!loading && stats && (
        <div className="stat-grid" style={{ marginBottom: "2.5rem" }}>
          <div className="stat-card">
            <span className="stat-card__value">{stats.workoutsLogged}</span>
            <span className="stat-card__label">Workouts logged</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {stats.currentStreak}
              <span className="stat-card__unit">days</span>
            </span>
            <span className="stat-card__label">Current streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {stats.weeklyConsistency}
              <span className="stat-card__unit">%</span>
            </span>
            <span className="stat-card__label">Last 7 days</span>
          </div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div className="form-row">
          <label>
            Weight (kg) — optional
            <input
              type="number"
              value={form.weight}
              onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
              min={30}
              max={300}
            />
          </label>
          <label style={{ flexDirection: "row", alignItems: "center", gap: "0.6rem", marginTop: "1.6rem" }}>
            <input
              type="checkbox"
              checked={form.workoutCompleted}
              onChange={(e) => setForm((f) => ({ ...f, workoutCompleted: e.target.checked }))}
              style={{ width: "auto" }}
            />
            Completed a workout today
          </label>
        </div>
        <label>
          Notes — optional
          <input
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="How did it go?"
          />
        </label>
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Logging…" : "Log entry"}
        </button>
      </form>

      {!loading && entries.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Recent entries</h3>
          <ul className="exercise-list">
            {entries.slice(0, 10).map((entry) => (
              <li key={entry._id}>
                {new Date(entry.date).toLocaleDateString()} —{" "}
                {entry.workoutCompleted ? "Workout completed" : "No workout"}
                {entry.weight ? ` — ${entry.weight}kg` : ""}
                {entry.notes ? ` — "${entry.notes}"` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Progress;
