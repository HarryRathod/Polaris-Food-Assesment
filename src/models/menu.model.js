const { DataTypes } = require("sequelize");
const sequelize = require("./../config/mysql.db");
const Restaurant = require("./restaurant.model");

const Menu = sequelize.define(
  "Menu",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.ENUM("veg", "non-veg"),
    },

    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "restaurants",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "menus",
    indexes: [{ fields: ["restaurantId"] }],
  },
);

Restaurant.hasMany(Menu, { foreignKey: "restaurantId" });
Menu.belongsTo(Restaurant, { foreignKey: "restaurantId" });

module.exports = Menu;
