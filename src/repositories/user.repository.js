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

exports.findById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return user;
};

exports.findByPhone = (phone) =>
  User.findOne({ where: { phone, isActive: true } });
