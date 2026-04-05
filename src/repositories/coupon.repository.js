const Coupon = require("./../models/coupon.model");
const { Op } = require("sequelize");
const sequelize = require("./../config/mysql.db");

exports.createCoupon = async (data) => {
  return await Coupon.create(data);
};

exports.getCouponByCode = async (code) => {
  return await Coupon.findOne({
    where: { code },
  });
};

exports.getActiveCoupons = async (page = 1, limit = 10) => {
  const now = new Date();

  const offset = (page - 1) * limit;

  const { count, rows } = await Coupon.findAndCountAll({
    where: {
      isActive: true,

      startDate: {
        [Op.lte]: now,
      },

      endDate: {
        [Op.gte]: now,
      },

      [Op.or]: [
        { usageLimit: null },
        {
          usageLimit: {
            [Op.gt]: sequelize.col("usedCount"),
          },
        },
      ],
    },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};
