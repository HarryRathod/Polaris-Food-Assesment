const { DataTypes } = require("sequelize");
const sequelize = require("./../config/mysql.db");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "PLACED",
        "ACCEPTED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ),
      defaultValue: "PLACED",
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID", "FAILED"),
      defaultValue: "PAID",
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },

    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "restaurants", key: "id" },
      onDelete: "CASCADE",
    },

    riderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "riders", key: "id" },
      onDelete: "SET NULL",
    },
  },
  {
    timestamps: true,
    tableName: "orders",
    indexes: [
      { fields: ["userId"] },
      { fields: ["restaurantId"] },
      { fields: ["riderId"] },
      { fields: ["status"] },
    ],
  },
);

Order.associate = (models) => {
  Order.belongsTo(models.Restaurant, {
    foreignKey: "restaurantId",
    as: "restaurant",
  });

  Order.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });

  Order.belongsTo(models.Rider, {
    foreignKey: "riderId",
    as: "rider",
  });
};

module.exports = Order;
