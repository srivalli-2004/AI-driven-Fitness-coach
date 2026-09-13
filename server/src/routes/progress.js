const express = require("express");
const router = express.Router();

const ProgressEntry = require("../models/ProgressEntry");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

// POST /api/progress — log a new entry (a workout, a weigh-in, or both)
router.post("/", async (req, res) => {
  try {
    const { weight, workoutCompleted, notes } = req.body;

    const entry = await ProgressEntry.create({
      userId: req.userId,
      weight,
      workoutCompleted: !!workoutCompleted,
      notes,
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to log entry" });
  }
});

// GET /api/progress — fetch entries + computed stats for the logged-in user
router.get("/", async (req, res) => {
  try {
    const entries = await ProgressEntry.find({ userId: req.userId }).sort({ date: -1 });

    res.json({
      entries,
      stats: computeStats(entries),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ---------- Stats calculation ----------

function computeStats(entries) {
  const workoutsLogged = entries.filter((e) => e.workoutCompleted).length;

  return {
    workoutsLogged,
    currentStreak: calculateStreak(entries),
    weeklyConsistency: calculateWeeklyConsistency(entries),
  };
}

// Counts consecutive days (working backward from today) with a completed workout.
// Breaks on the first day with no completed-workout entry.
function calculateStreak(entries) {
  const completedDates = new Set(
    entries
      .filter((e) => e.workoutCompleted)
      .map((e) => new Date(e.date).toDateString())
  );

  let streak = 0;
  let cursor = new Date();

  while (completedDates.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

// % of the last 7 days that have a completed workout logged
function calculateWeeklyConsistency(entries) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const completedInWindow = entries.filter(
    (e) => e.workoutCompleted && new Date(e.date) >= sevenDaysAgo
  ).length;

  return Math.round((Math.min(completedInWindow, 7) / 7) * 100);
}

module.exports = router;
