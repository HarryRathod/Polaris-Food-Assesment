const couponRepository = require("../repositories/coupon.repository");
const redis = require("../config/redis");

const invalidateCouponsCache = async () => {
  try {
    const keys = await redis.keys("activeCoupons:*");

    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Coupons cache invalidated");
    }
  } catch (err) {
    console.error("Error invalidating coupons cache:", err);
  }
};

exports.addCoupon = async (data) => {
  const {
    code,
    type,
    value,
    maxDiscount,
    minOrderAmount,
    usageLimit,
    perUserLimit,
    startDate,
    endDate,
  } = data;

  if (!code || !type || !value || !startDate || !endDate) {
    throw new Error("Missing required fields");
  }

  if (!["FLAT", "PERCENTAGE"].includes(type)) {
    throw new Error("Invalid coupon type");
  }

  if (type === "PERCENTAGE" && value > 100) {
    throw new Error("Percentage value cannot exceed 100");
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new Error("End date must be after start date");
  }

  const existingCoupon = await couponRepository.getCouponByCode(code);
  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  const coupon = await couponRepository.createCoupon({
    code,
    type,
    value,
    maxDiscount,
    minOrderAmount,
    usageLimit,
    perUserLimit,
    startDate,
    endDate,
  });

  // Invalidate cache after successful insert
  await invalidateCouponsCache();

  return coupon;
};

exports.getActiveCoupons = async (page, limit) => {
  const cacheKey = `activeCoupons:${page}:${limit}`;

  // 1. Try fetching from cache
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log("Cache hit");
    return JSON.parse(cachedData);
  }

  // 2. If not in cache → fetch from DB
  console.log("Cache miss, DB hit");

  const coupons = await couponRepository.getActiveCoupons(page, limit);

  if (!coupons || coupons.length === 0) {
    throw new Error("No active coupons found");
  }

  // 3. Store in cache (TTL = 6 hours = 21600 seconds)
  await redis.set(cacheKey, JSON.stringify(coupons), "EX", 21600);

  return coupons;
};
