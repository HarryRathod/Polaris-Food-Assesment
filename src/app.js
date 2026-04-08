const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:8081", "http://127.0.0.1:8081"],
    credentials: true,
  }),
);

app.use(helmet());

const setupSwagger = require("./docs/swagger");
setupSwagger(app);

const routes = require("./routes/router");
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
