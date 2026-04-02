const Rider = require("./../models/rider.model");

exports.createRider = (data) => Rider.create(data);

exports.getAvailableRiders = () =>
  Rider.findAll({ where: { isAvailable: true } });

exports.getRiderById = async (id) => {
  const rider = await Rider.findByPk(id);
  if (!rider) throw new Error("Rider not found");
  return rider;
};

exports.getDeliveredOrdersByRider = async (riderId) => {
  return await Order.findAll({
    where: {
      riderId,
      status: "DELIVERED",
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "phone"],
      },
      {
        model: Restaurant,
        as: "restaurant",
        attributes: ["id", "name", "address"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

exports.updateAvailability = async (id, status) => {
  const [updated] = await Rider.update(
    { isAvailable: status },
    { where: { id } },
  );

  if (!updated) {
    throw new Error("Rider not found");
  }

  return Rider.findByPk(id);
};

exports.updateManyAvailability = (ids, status) =>
  Rider.update({ isAvailable: status }, { where: { id: ids } });
