const Order = require("./../models/order.model");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Rider = require("../models/rider.model");

exports.createOrder = (data, transaction) =>
  Order.create(data, { transaction });

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

exports.getOrdersById = async (id, type, page = 1, limit = 10) => {
  const safePage = Math.max(1, parseInt(page) || 1);
  const safeLimit = Math.min(parseInt(limit) || 10, 50);
  const offset = (safePage - 1) * safeLimit;

  let result;

  if (type === "user") {
    const userId = id;

    result = await Order.findAndCountAll({
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
      limit: safeLimit,
      offset,
    });
  } else {
    const riderId = id;

    result = await Order.findAndCountAll({
      // where: { riderId, status: "DELIVERED" },
      where: { riderId },
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
      limit: safeLimit,
      offset,
    });
  }

  return {
    total: result.count,
    page: safePage,
    totalPages: Math.ceil(result.count / safeLimit),
    hasNext: safePage * safeLimit < result.count,
    data: result.rows,
  };
};

exports.updateOrder = async (id, status) => {
  try {
    // console.log(id);
    const rider = await Rider.findByPk(riderId);

    if (!rider) {
      throw new Error("Invalid rider");
    }

    const [updatedCount, updatedRows] = await Order.update(status, {
      where: { id },
    });
    if (!updatedRows || updatedRows.length === 0) {
      const updatedOrder = await Order.findByPk(id);
      return updatedOrder;
    }

    return updatedRows[0];
  } catch (error) {
    throw error;
  }
};
