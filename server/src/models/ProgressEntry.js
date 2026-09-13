const mongoose = require("mongoose");

const progressEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number },
    workoutCompleted: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgressEntry", progressEntrySchema);
