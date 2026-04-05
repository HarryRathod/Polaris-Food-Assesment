const couponService = require("../services/coupon.service");

exports.addCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.addCoupon(req.body);

    return res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (err) {
    next(err);
  }
};

exports.getActiveCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const coupons = await couponService.getActiveCoupons(page, limit);

    return res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (err) {
    next(err);
  }
};
