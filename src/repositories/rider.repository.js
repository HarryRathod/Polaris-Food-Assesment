const Rider = require("./../models/rider.model");

exports.createRider = (data) => Rider.create(data);

exports.getAvailableRiders = () =>
  Rider.findAll({ where: { isAvailable: true } });

exports.getRiderById = async (id) => {
  const rider = await Rider.findByPk(id);
  if (!rider) throw new Error("Rider not found");
  return rider;
};
