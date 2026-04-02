const menuService = require("./../services/menu.service");

exports.addMenu = async (req, res) => {
  try {
    const { name, price, category, restaurantId } = req.body;

    if (!name || !price || !restaurantId) {
      return res.status(400).json({
        success: false,
        error: "Name, price and restaurantId are required",
      });
    }

    const menu = await menuService.createMenu(req.body);

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
