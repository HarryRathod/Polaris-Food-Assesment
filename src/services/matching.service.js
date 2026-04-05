const IORedis = require("ioredis");

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Find riders near restaurant
exports.findNearbyRiders = async (lat, lng) => {
  const radiusInKm = 5;

  const riders = await redis.geosearch(
    "riders:locations",
    "FROMLONLAT",
    lng,
    lat,
    "BYRADIUS",
    radiusInKm,
    "km",
    "WITHDIST",
    "ASC",
  );

  return riders.map((r) => ({
    riderId: r[0],
    distance: parseFloat(r[1]),
  }));
};
