const redis = require("./../config/redis");
// const jwt = require("jsonwebtoken");

function startRiderLocationUpdates(lng, lat, riderId, frequency) {
  const intervalId = setInterval(async () => {
    try {
      await redis.geoadd("riders:locations", lng, lat, riderId);
    } catch (error) {
      console.error(error);
    }
  }, frequency);

  return intervalId;
}

const demoRider = startRiderLocationUpdates(
  78.2705,
  21.0843,
  "b9d4b288-bc80-4632-b40e-fef1f2357e67",
  5000,
);

// To stop the after 30 seconds:
// setTimeout(() => clearInterval(demoRider), 30000);

// exports.initSocket = (io) => {
//   // Auth middleware
//   io.use((socket, next) => {
//     const token = socket.handshake.auth?.token;

//     if (!token) return next(new Error("Unauthorized"));

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.user = decoded;
//       next();
//     } catch {
//       next(new Error("Invalid token"));
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     const riderId = socket.user.id;
//     socket.join(`rider:${riderId}`);

//     let lastUpdate = 0;

//     socket.on("updateLocation", async (data) => {
//       const { lat, lng } = data;

//       if (typeof lat !== "number" || typeof lng !== "number") {
//         return;
//       }

//       const now = Date.now();
//       if (now - lastUpdate < 2000) return;
//       lastUpdate = now;

//       try {
//         await redis.geoadd("riders:locations", lng, lat, riderId);
//         console.log(`Updated location for rider ${riderId}`);
//       } catch (err) {
//         console.error("Redis error:", err);
//       }
//     });

//     socket.on("disconnect", async () => {
//       console.log("Socket disconnected:", riderId);
//       await redis.zrem("riders", riderId);
//     });
//   });
// };
