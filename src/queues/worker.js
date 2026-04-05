const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { findNearbyRiders } = require("../services/matching.service");
const { Order } = require("../models");

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "order-queue",
  async (job) => {
    console.log("Processing job:", job.id, job.name);

    switch (job.name) {
      case "assign-rider": {
        const { orderId, restaurantLat, restaurantLng } = job.data;

        if (!orderId) {
          throw new Error("Missing orderId");
        }

        if (restaurantLat == null || restaurantLng == null) {
          throw new Error("Missing coordinates");
        }

        console.log("Finding riders near:", restaurantLat, restaurantLng);

        const riders = await findNearbyRiders(restaurantLat, restaurantLng);

        if (!riders || riders.length === 0) {
          throw new Error("No riders found"); // triggers retry
        }

        const selectedRider = riders[0];
        const riderId = selectedRider.riderId;

        console.log("🚴 Assigning rider:", riderId);

        await Order.update(
          {
            riderId,
            status: "ACCEPTED",
          },
          {
            where: { id: orderId },
          },
        );

        console.log("Order updated with rider");

        return {
          orderId,
          riderId,
        };
      }

      default:
        console.log("Unknown job:", job.name);
    }
  },
  {
    connection,
    concurrency: 5,
  },
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`, result);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.error("Worker crashed:", err);
});

worker.on("ready", () => {
  console.log("Worker is ready...");
});
