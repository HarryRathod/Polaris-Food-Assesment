const Order = require("./order.model");
const Restaurant = require("./restaurant.model");
const User = require("./user.model");
const Rider = require("./rider.model");
const Menu = require("./menu.model");
const Coupon = require("./coupon.model");

const models = {
  Order,
  Restaurant,
  User,
  Rider,
  Menu,
  Coupon,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
