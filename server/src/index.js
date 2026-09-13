const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const plansRouter = require("./routes/plans");
const usersRouter = require("./routes/users");
const progressRouter = require("./routes/progress");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NEW-ME backend is running" });
});

app.use("/api/plans", plansRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
