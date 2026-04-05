const User = require("./../models/user.model");

exports.createUser = async (data) => {
  try {
    return await User.create(data);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new Error("Email or phone already exists");
    }
    throw err;
  }
};

exports.findByEmail = (email) =>
  User.scope(null).findOne({
    where: { email, isActive: true },
  });

exports.findByPhone = (phone) =>
  User.findOne({ where: { phone, isActive: true } });

exports.getUserById = async (id) => {
  return await User.findByPk(id);
};
