const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./../config/mysql.db");

const User = sequelize.define(
  "User",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[6-9]\d{9}$/,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    defaultScope: {
      attributes: { exclude: ["password"] },
    },

    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["phone"] },
    ],
  },
);

module.exports = User;
