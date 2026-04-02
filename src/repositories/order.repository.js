const Order = require("./../models/order.model");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Rider = require("../models/rider.model");

// Create order
exports.createOrder = (data, transaction) =>
  Order.create(data, { transaction });

// Get single order
exports.getOrder = async (id) => {
  const order = await Order.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
      },
      {
        model: Restaurant,
        as: "restaurant",
      },
    ],
  });

  if (!order) throw new Error("Order not found");

  return order;
};

// Get user orders
exports.getOrdersByUserId = async (userId) => {
  return await Order.findAll({
    where: { userId },
    include: [
      {
        model: Restaurant,
        as: "restaurant",
        attributes: ["id", "name", "phone", "address"],
      },
      {
        model: Rider,
        as: "rider",
        attributes: ["id", "name", "phone"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

exports.getDeliveredOrdersByRider = async (riderId) => {
  return await Order.findAll({
    where: {
      riderId,
      status: "DELIVERED",
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "phone"],
      },
      {
        model: Restaurant,
        as: "restaurant",
        attributes: ["id", "name", "address"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};
