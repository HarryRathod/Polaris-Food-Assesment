const orderService = require("./../services/order.service");

exports.placeOrder = async (req, res) => {
  try {
    const { items, restaurantId, deliveryAddress } = req.body;

    if (!items || !restaurantId || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const order = await orderService.placeOrder({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { id, type } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const orders = await orderService.getOrders(id, type, page, limit);

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "PLACED",
      "ACCEPTED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    await orderService.updateStatus(req.params.orderId, status);

    res.status(200).json({
      success: true,
      message: "Order updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
