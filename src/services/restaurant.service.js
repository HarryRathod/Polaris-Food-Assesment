const Restaurant = require("./../models/restaurant.model");
const User = require("./../models/user.model");

exports.createRestaurantForUser = async (userId, data) => {
  console.log(userId);
  const user = await User.findByPk(userId);
  console.log(user);

  if (!user) {
    throw new Error("User not found");
  }

  // 🏪 Create restaurant using user details
  const restaurant = await Restaurant.create({
    name: user.name, // 👈 from user
    phone: user.phone, // 👈 from user
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
  });

  return restaurant;
};

getRestaurantByIdHelper = async (id) => {
  return await Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "phone",
      "address",
      "latitude",
      "longitude",
      "isOpen",
      "createdAt",
    ],
  });
};

exports.getRestaurantById = async (id) => {
  if (!id) {
    const error = new Error("Restaurant ID is required");
    error.statusCode = 400;
    throw error;
  }

  const restaurant = await getRestaurantByIdHelper(id);

  if (!restaurant) {
    const error = new Error("Restaurant not found");
    error.statusCode = 404;
    throw error;
  }

  return restaurant;
};
