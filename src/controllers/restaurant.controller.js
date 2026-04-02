const restaurantService = require("./../services/restaurant.service");

exports.addRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;

    const { address, latitude, longitude } = req.body;

    if (!address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "Address, latitude and longitude are required",
      });
    }

    const restaurant = await restaurantService.createRestaurantForUser(
      userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await restaurantService.getRestaurantById(id);

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
