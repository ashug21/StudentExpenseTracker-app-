require("dotenv").config();
const express = require("express");
const pool = require("./db");
const app = express();
const PORT = process.env.PORT || 5500;
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/expense", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});