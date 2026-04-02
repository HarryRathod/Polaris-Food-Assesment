const orderRepo = require("./../repositories/order.repository");
const Restaurant = require("../models/restaurant.model");
const Menu = require("../models/menu.model");
const sequelize = require("../config/mysql.db");
const { orderQueue } = require("./../queues/order.queue");

exports.placeOrder = async (data) => {
  const { items, restaurantId, userId } = data;

  if (!items || items.length === 0) {
    throw new Error("Items required");
  }

  const restaurant = await Restaurant.findByPk(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  let totalAmount = 0;
  let itemName = "";

  for (const item of items) {
    const menu = await Menu.findByPk(item.menuId);

    if (!menu) {
      throw new Error("Menu item not found");
    }

    totalAmount += menu.price;

    itemName += `${menu.name}`;
  }

  itemName = itemName.slice(0, -2);

  const order = await orderRepo.createOrder({
    userId,
    restaurantId,
    totalAmount,
    itemName,
    deliveryAddress: data.deliveryAddress,
  });

  // 🚚 Queue rider assignment (async)
  await orderQueue.add("assign-rider", {
    orderId: order.id,
    restaurantLat: restaurant.latitude,
    restaurantLng: restaurant.longitude,
  });

  return order;
};

exports.getUserOrders = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const orders = await orderRepo.getOrdersByUserId(userId);

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
  const order = await orderRepo.getOrder(id);

  if (order.status === "DELIVERED") {
    throw new Error("Order already completed");
  }

  return orderRepo.updateOrder(id, { status });
};

exports.getRiderDeliveredOrders = async (riderId) => {
  if (!riderId) {
    throw new Error("RiderId is required");
  }

  const orders = await orderRepo.getDeliveredOrdersByRider(riderId);

  return orders;
};
