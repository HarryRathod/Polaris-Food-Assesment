const { Menu } = require("./../models");

exports.createMenu = async (data) => {
  return await Menu.create(data);
};

exports.getAllMenuByRestaurantId = async (
  restaurantId,
  page = 1,
  limit = 10,
) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Menu.findAndCountAll({
    where: { restaurantId },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};
