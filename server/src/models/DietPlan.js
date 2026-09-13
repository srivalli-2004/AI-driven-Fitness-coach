const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    meal: { type: String, required: true },
    items: [{ type: String }],
    calories: { type: Number, required: true },
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    generatedAt: { type: Date, default: Date.now },
    dailyCalories: { type: Number, required: true },
    macros: {
      carbsGrams: { type: Number, required: true },
      proteinGrams: { type: Number, required: true },
      fatGrams: { type: Number, required: true },
    },
    sampleMeals: [mealSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DietPlan", dietPlanSchema);
