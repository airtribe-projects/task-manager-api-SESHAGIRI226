const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Task Management API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 API Documentation: http://localhost:${PORT}/api/health`);
});

module.exports = app;
