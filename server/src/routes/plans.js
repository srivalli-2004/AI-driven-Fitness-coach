const express = require("express");
const router = express.Router();

const User = require("../models/User");
const WorkoutPlan = require("../models/WorkoutPlan");
const DietPlan = require("../models/DietPlan");
const { generateWorkoutPlan, generateDietPlan } = require("../utils/generatePlans");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/generate", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const workoutData = generateWorkoutPlan(user);
    const dietData = generateDietPlan(user);

    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { userId: user._id },
      { userId: user._id, ...workoutData, generatedAt: new Date() },
      { upsert: true, new: true }
    );

    const dietPlan = await DietPlan.findOneAndUpdate(
      { userId: user._id },
      { userId: user._id, ...dietData, generatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ workoutPlan, dietPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate plans" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [workoutPlan, dietPlan] = await Promise.all([
      WorkoutPlan.findOne({ userId: req.userId }),
      DietPlan.findOne({ userId: req.userId }),
    ]);
    res.json({ workoutPlan, dietPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

module.exports = router;
