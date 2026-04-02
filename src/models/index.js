const Order = require("./order.model");
const Restaurant = require("./restaurant.model");
const User = require("./user.model");
const Rider = require("./rider.model");

const models = {
  Order,
  Restaurant,
  User,
  Rider,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
