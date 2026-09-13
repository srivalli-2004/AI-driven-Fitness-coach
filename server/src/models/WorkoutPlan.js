const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
  },
  { _id: false }
);

const dayPlanSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    focus: { type: String, required: true },
    exercises: [exerciseSchema],
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    basedOnGoal: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
    days: [dayPlanSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
