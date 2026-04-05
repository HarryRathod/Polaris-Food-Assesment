const menuRepository = require("../repositories/menu.repository");
const restaurantRepository = require("../repositories/restaurant.repository");

const redis = require("../config/redis");

// helper
const clearMenuCache = async (restaurantId) => {
  try {
    const keys = await redis.keys(`menu:${restaurantId}:*`);

    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Menu cache invalidated");
    }
  } catch (err) {
    console.error("Error clearing menu cache:", err);
  }
};

exports.createMenu = async (data) => {
  const { name, price, category, restaurantId } = data;

  const restaurant = await restaurantRepository.getRestaurantById(restaurantId);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const menu = await menuRepository.createMenu({
    name,
    price,
    category,
    restaurantId,
  });

  // Invalidate cache after successful insert
  await clearMenuCache(restaurantId);

  return menu;
};

exports.getAllMenu = async (restaurantId, page, limit) => {
  const cacheKey = `menu:${restaurantId}:${page}:${limit}`;

  // 1. Check cache
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log("Cache hit");
    return JSON.parse(cachedData);
  }

  // 2. Cache miss → DB call
  console.log("Cache miss, DB hit");

  const menu = await menuRepository.getAllMenuByRestaurantId(
    restaurantId,
    page,
    limit,
  );

  if (!menu || menu.length === 0) {
    throw new Error("Menu not found!");
  }

  // 3. Store in Redis (6 hours = 21600 sec)
  await redis.set(cacheKey, JSON.stringify(menu), "EX", 21600);

  return menu;
};
