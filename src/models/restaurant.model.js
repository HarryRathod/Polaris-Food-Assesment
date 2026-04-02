const { DataTypes } = require("sequelize");
const sequelize = require("./../config/mysql.db");

const Restaurant = sequelize.define(
  "Restaurant",
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[6-9]\d{9}$/,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "restaurants",
    indexes: [
      { unique: true, fields: ["phone"] },
      { fields: ["latitude", "longitude"] },
    ],
  },
);

Restaurant.associate = (models) => {
  Restaurant.hasMany(models.Order, {
    foreignKey: "restaurantId",
    as: "orders",
  });
};

module.exports = Restaurant;
