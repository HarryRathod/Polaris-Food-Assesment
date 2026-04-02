const Menu = require("./../models/menu.model");
const Restaurant = require("./../models/restaurant.model");

exports.createMenu = async (data) => {
  const { name, price, category, restaurantId } = data;

  // 🔍 Validate restaurant exists
  const restaurant = await Restaurant.findByPk(restaurantId);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  // 🍽️ Create menu item
  const menu = await Menu.create({
    name,
    price,
    category,
    restaurantId,
  });

  return menu;
};
