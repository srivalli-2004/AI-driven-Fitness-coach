import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    gender: "female",
    goal: "general_fitness",
    activityLevel: "moderate",
    dietaryPreference: "balanced",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup({
        ...form,
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
      });
      navigate("/workout");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-section">
      <h2>Create your profile</h2>
      <p className="page-section__intro">
        This tells the coach how to build your plan — you can update it later.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-row">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
        </div>

        <div className="form-row">
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <div className="form-row form-row--three">
          <label>
            Age
            <input type="number" name="age" value={form.age} onChange={handleChange} required min={13} max={100} />
          </label>
          <label>
            Weight (kg)
            <input type="number" name="weight" value={form.weight} onChange={handleChange} required min={30} max={300} />
          </label>
          <label>
            Height (cm)
            <input type="number" name="height" value={form.height} onChange={handleChange} required min={100} max={250} />
          </label>
        </div>

        <div className="form-row">
          <label>
            Goal
            <select name="goal" value={form.goal} onChange={handleChange}>
              <option value="fat_loss">Fat Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="endurance">Endurance</option>
              <option value="general_fitness">General Fitness</option>
            </select>
          </label>
          <label>
            Activity level
            <select name="activityLevel" value={form.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </select>
          </label>
        </div>

        <label>
          Dietary preference
          <select name="dietaryPreference" value={form.dietaryPreference} onChange={handleChange}>
            <option value="balanced">Balanced</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="high_protein">High Protein</option>
          </select>
        </label>

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}

export default Signup;
