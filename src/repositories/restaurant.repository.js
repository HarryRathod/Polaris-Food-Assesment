const Restaurant = require("./../models/restaurant.model");
const { QueryTypes } = require("sequelize");
const sequelize = require("./../config/mysql.db");

exports.getRestaurantById = async (id) => {
  return await Restaurant.findByPk(id);
};

exports.createRestaurant = async (data) => {
  return await Restaurant.create(data);
};

exports.getRestaurantById = async (id) => {
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

exports.findNearbyRestaurants = async (
  lat,
  lng,
  radius,
  page = 1,
  limit = 10,
) => {
  const safePage = Math.max(1, parseInt(page) || 1);
  const safeLimit = Math.min(parseInt(limit) || 10, 50);
  const offset = (safePage - 1) * safeLimit;

  const dataQuery = `
    SELECT * FROM (
      SELECT 
        *, 
        ST_Distance_Sphere(
          point(longitude, latitude), 
          point(:lng, :lat)
        ) AS distance
      FROM restaurants
    ) AS restaurant_subquery
    WHERE distance <= :radius
    ORDER BY distance ASC
    LIMIT :limit OFFSET :offset;
  `;

  const countQuery = `
    SELECT COUNT(*) as total FROM (
      SELECT 
        ST_Distance_Sphere(
          point(longitude, latitude), 
          point(:lng, :lat)
        ) AS distance
      FROM restaurants
    ) AS restaurant_subquery
    WHERE distance <= :radius;
  `;

  const [data, countResult] = await Promise.all([
    sequelize.query(dataQuery, {
      replacements: { lat, lng, radius, limit: safeLimit, offset },
      type: QueryTypes.SELECT,
    }),
    sequelize.query(countQuery, {
      replacements: { lat, lng, radius },
      type: QueryTypes.SELECT,
    }),
  ]);

  const total = countResult[0].total;

  return {
    total,
    page: safePage,
    totalPages: Math.ceil(total / safeLimit),
    hasNext: safePage * safeLimit < total,
    data,
  };
};
