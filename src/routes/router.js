const router = require("express").Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Routes
router.use("/auth", require("./auth.routes"));
router.use("/restaurant", require("./restaurant.routes"));
router.use("/order", require("./order.routes"));
router.use("/coupon", require("./coupon.routes"));

module.exports = router;
