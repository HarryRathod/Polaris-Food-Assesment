const restaurantRepository = require("../repositories/restaurant.repository");
const userRepository = require("../repositories/user.repository");

const clearNearbyRestaurantsCache = async () => {
  try {
    const keys = await redis.keys("nearbyRestaurants:*");

    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Nearby restaurants cache invalidated");
    }
  } catch (err) {
    console.error("Error clearing nearby cache:", err);
  }
};

exports.createRestaurantForUser = async (userId, data) => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const restaurantData = {
    name: data.name,
    phone: user.phone,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
  };

  // Invalidating cache
  await clearNearbyRestaurantsCache();

  return await restaurantRepository.createRestaurant(restaurantData);
};

const redis = require("../config/redis");

exports.findNearbyRestaurants = async (latitude, longitude, page, limit) => {
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error("Invalid latitude or longitude");
    }

    const radius = process.env.RESTAURANT_SEARCH_DISTANCE;

    // Round lat/lng to avoid too many unique keys (IMPORTANT)
    const roundedLat = lat.toFixed(3);
    const roundedLng = lng.toFixed(3);

    const cacheKey = `nearbyRestaurants:${roundedLat}:${roundedLng}:${page}:${limit}`;

    // 1. Check cache
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Cache hit");
      return JSON.parse(cachedData);
    }

    // 2. Cache miss → DB hit
    console.log("Cache miss, DB hit");

    const restaurants = await restaurantRepository.findNearbyRestaurants(
      lat,
      lng,
      radius,
      page,
      limit,
    );

    // 3. Store in cache (6 hours)
    await redis.set(cacheKey, JSON.stringify(restaurants), "EX", 21600);

    return restaurants;
  } catch (err) {
    console.error("Service Error:", err);
    throw new Error("Could not fetch nearby restaurants");
  }
};

exports.getRestaurantById = async (id) => {
  if (!id) {
    const error = new Error("Restaurant ID is required");
    error.statusCode = 400;
    throw error;
  }

  const restaurant = await restaurantRepository.getRestaurantById(id);

  if (!restaurant) {
    const error = new Error("Restaurant not found");
    error.statusCode = 404;
    throw error;
  }

  return restaurant;
};
