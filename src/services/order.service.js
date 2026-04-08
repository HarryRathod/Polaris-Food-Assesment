const orderRepo = require("./../repositories/order.repository");
const Restaurant = require("../models/restaurant.model");
const Menu = require("../models/menu.model");
const sequelize = require("../config/mysql.db");
const { orderQueue } = require("./../queues/order.queue");
const { Op } = require("sequelize");
const Coupon = require("./../models/coupon.model");
const redis = require("../config/redis");

const clearOrdersCache = async (userId) => {
  try {
    const keys = await redis.keys(`orders:${userId}:*`);

    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Orders cache invalidated");
    }
  } catch (err) {
    console.error("Error clearing orders cache:", err);
  }
};

// --- Helper: Distance Calculation (Haversine) ---
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

exports.placeOrder = async (data) => {
  const { items, restaurantId, userId, couponCode, userLat, userLng } = data;

  if (!items || items.length === 0) {
    throw new Error("Items required");
  }

  if (!userLat || !userLng) {
    throw new Error("User location required for delivery time");
  }

  const restaurant = await Restaurant.findByPk(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  // --- ETA CALCULATION ---
  const distance = getDistanceInKm(
    userLat,
    userLng,
    restaurant.latitude,
    restaurant.longitude,
  );

  // Formula: 20 mins prep + (distance * 3 mins)
  const etaMinutes = Math.round(20 + distance * 3);

  const etaRange = `${etaMinutes - 5}-${etaMinutes + 5} mins`;

  let totalAmount = 0;
  let itemName = "";

  for (const item of items) {
    const { menuId, quantity = 1 } = item;

    const menu = await Menu.findByPk(menuId);

    if (!menu) {
      throw new Error(`Menu item not found: ${menuId}`);
    }

    totalAmount += menu.price * quantity;
    itemName += `${menu.name} x${quantity}, `;
  }

  itemName = itemName.slice(0, -2);

  let discount = 0;
  let couponApplied = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      where: {
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() },
      },
    });

    if (!coupon) {
      throw new Error("Invalid or expired coupon");
    }

    // usage limit check
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit exceeded");
    }

    // min order check
    if (totalAmount < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
    }

    // discount calculation
    if (coupon.type === "FLAT") {
      discount = coupon.value;
    } else if (coupon.type === "PERCENTAGE") {
      discount = (totalAmount * coupon.value) / 100;

      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    discount = Math.min(discount, totalAmount);

    coupon.usedCount += 1;
    await coupon.save();

    couponApplied = {
      code: coupon.code,
      discount,
    };
  }

  const finalAmount = totalAmount - discount;

  const order = await orderRepo.createOrder({
    userId,
    restaurantId,
    totalAmount: finalAmount,
    itemName,
    deliveryAddress: data.deliveryAddress,
    couponCode: couponApplied?.code || null,
    discount,
    estimatedDeliveryTime: etaMinutes, // ✅ stored in DB
  });

  // Invalidate orders cache for this user
  // await clearOrdersCache(userId);

  await orderQueue.add("assign-rider", {
    orderId: order.id,
    restaurantLat: restaurant.latitude,
    restaurantLng: restaurant.longitude,
  });

  return {
    ...order.toJSON(),
    originalAmount: totalAmount,
    discount,
    finalAmount,
    couponApplied,
    estimatedDeliveryTime: etaMinutes,
    eta: etaRange,
  };
};

exports.getOrders = async (id, type, page, limit) => {
  if (!id) {
    throw new Error("UserId is required");
  }

  // const cacheKey = `orders:${id}:${type}:${page}:${limit}`;

  // // 1. Check cache
  // const cachedData = await redis.get(cacheKey);
  // if (cachedData) {
  //   console.log("Cache hit");
  //   return JSON.parse(cachedData);
  // }

  // // 2. Cache miss → DB hit
  // console.log("Cache miss, DB hit");

  const orders = await orderRepo.getOrdersById(id, type, page, limit);

  // (Optional) you can skip caching empty results if you want
  // await redis.set(cacheKey, JSON.stringify(orders), "EX", 21600); // 6 hours

  return orders;
};

exports.getOrderById = async (orderId, userId) => {
  const order = await orderRepo.getOrder(orderId);

  if (order.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return order;
};

exports.updateStatus = async (id, status) => {
  const order = await orderRepo.getOrder(id, "rider");

  if (order.status === "DELIVERED") {
    throw new Error("Order already completed");
  }

  const updatedOrder = await orderRepo.updateOrder(id, { status });

  console.log("update call");

  // ✅ Clear cache after successful update
  await clearOrdersCache(order.userId);

  return updatedOrder;
};
