const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

const setupSwagger = require("./docs/swagger");
setupSwagger(app);

const routes = require("./routes/router");
app.use("/api/v1", routes);

app.get("/home", (req, res) => {
  res.send("From home.");
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
