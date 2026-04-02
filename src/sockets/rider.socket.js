const redis = require("./../config/redis");
const jwt = require("jsonwebtoken");

exports.initSocket = (io) => {
  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const riderId = socket.user.id;
    socket.join(`rider:${riderId}`);

    let lastUpdate = 0;

    socket.on("updateLocation", async (data) => {
      const { lat, lng } = data;

      if (typeof lat !== "number" || typeof lng !== "number") {
        return;
      }

      const now = Date.now();
      if (now - lastUpdate < 2000) return;
      lastUpdate = now;

      try {
        await redis.geoadd("riders", lng, lat, riderId);
        console.log(`Updated location for rider ${riderId}`);
      } catch (err) {
        console.error("Redis error:", err);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", riderId);
      await redis.zrem("riders", riderId);
    });
  });
};
