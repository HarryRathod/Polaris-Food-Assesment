const menuService = require("./../services/menu.service");

exports.addMenu = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const { restaurantId } = req.params;

    if (!name || !price || !category || !restaurantId) {
      return res.status(400).json({
        success: false,
        error: "Name, price and restaurantId are required",
      });
    }

    const menu = await menuService.createMenu({
      name,
      price,
      category,
      restaurantId,
    });

    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

exports.getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        error: "RestaurantId is required",
      });
    }

    const menu = await menuService.getAllMenu(restaurantId, page, limit);

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
