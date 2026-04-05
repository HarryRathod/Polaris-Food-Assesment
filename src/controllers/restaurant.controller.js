const restaurantService = require("./../services/restaurant.service");
const sequelize = require("../config/mysql.db");
const { QueryTypes } = require("sequelize");

exports.addRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "Name, address, latitude and longitude are required",
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

exports.getRestaurantsNearMe = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const { page = 1, limit = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude are required as query parameters",
      });
    }

    const restaurants = await restaurantService.findNearbyRestaurants(
      latitude,
      longitude,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    // Standardized error handling matching your Function-2 style
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await restaurantService.getRestaurantById(restaurantId);

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
