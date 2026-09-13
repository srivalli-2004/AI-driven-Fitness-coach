const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },

    goal: {
      type: String,
      enum: ["fat_loss", "muscle_gain", "endurance", "general_fitness"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active"],
      required: true,
    },
    dietaryPreference: {
      type: String,
      enum: ["balanced", "vegetarian", "vegan", "high_protein"],
      default: "balanced",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
