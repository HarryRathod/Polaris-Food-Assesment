const redis = require("./../config/redis");

exports.findNearbyRiders = async (lat, lng) => {
  const radius = Number(process.env.REDIS_GEO_RADIUS) || 5;

  const results = await redis.geosearch(
    "riders:locations",
    "FROMLONLAT",
    lng,
    lat,
    "BYRADIUS",
    radius,
    "km",
    "WITHDIST",
    "ASC",
    "COUNT",
    5,
  );

  if (!results || results.length === 0) {
    return [];
  }

  return results.map((r) => {
    return {
      riderId: r[0],
      distance: parseFloat(r[1]),
    };
  });
};
