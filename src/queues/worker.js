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
        console.log(orderId, restaurantLat, restaurantLng);

        if (!orderId) {
          throw new Error("Missing orderId in job");
        }

        if (!restaurantLat || !restaurantLng) {
          throw new Error("Missing coordinates");
        }

        const riders = await findNearbyRiders(restaurantLat, restaurantLng);

        if (!riders || riders.length === 0) {
          console.log("No riders found");
          return null;
        }

        const selectedRider = riders[0];
        const riderId = selectedRider.riderId || selectedRider.id;

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

        const updatedOrder = await Order.findByPk(orderId);

        console.log("Order updated with rider");

        return {
          orderId,
          riderId,
        };
      }
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
  console.log("Worker is ready and listening...");
});
