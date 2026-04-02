require("dotenv").config();
const sequelize = require("./src/config/mysql.db");
const { Order } = require("./src/models");

const app = require("./src/app");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.stack);
  process.exit(1);
});

// Start server only after DB connects
const port = process.env.PORT || 8081;

// sequelize.sync({ alter: true });
sequelize.sync();

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(Order.associations);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
