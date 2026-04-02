const User = require("./../models/user.model");
const Rider = require("./../models/rider.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getModelByType = (type) => {
  if (type === "user") return User;
  if (type === "rider") return Rider;
  throw new Error("Invalid type. Must be 'user' or 'rider'");
};

exports.register = async (data) => {
  try {
    const { type, password } = data;

    const Model = getModelByType(type);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Model.create({
      ...data,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id, type }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return token;
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new Error("Email or phone already exists");
    }
    throw err;
  }
};

exports.login = async (email, password, type) => {
  const Model = getModelByType(type);
  const user = await Model.scope(null).findOne({
    where: { email, isActive: true },
  });

  console.log("from auth.service", user);

  if (!user) {
    throw new Error(`${type} not found`);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, type }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};
