const { DataTypes } = require("sequelize");
const sequelize = require("./../config/mysql.db");

const Coupon = sequelize.define(
  "Coupon",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    type: {
      type: DataTypes.ENUM("FLAT", "PERCENTAGE"),
      allowNull: false,
    },

    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    maxDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true, // only for percentage coupons
      validate: {
        min: 0,
      },
    },

    minOrderAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true, // null = unlimited
      validate: {
        min: 1,
      },
    },

    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    perUserLimit: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional
      validate: {
        min: 1,
      },
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "coupons",
    indexes: [
      { unique: true, fields: ["code"] },
      { fields: ["isActive"] },
      { fields: ["startDate", "endDate"] },
    ],
  },
);

module.exports = Coupon;
