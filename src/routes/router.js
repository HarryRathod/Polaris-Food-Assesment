const router = require("express").Router();
const authMiddleware = require("./../middlewares/auth.middleware");
const restaurantController = require("./../controllers/restaurant.controller");
const menuController = require("./../controllers/menu.controller");
const orderController = require("./../controllers/order.controller");

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Routes
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 */
router.use("/auth", require("./auth.routes"));

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Add a new restaurant
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - address
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/restaurants", authMiddleware, restaurantController.addRestaurant);

/**
 * @swagger
 * /restaurant/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant fetched successfully
 *       404:
 *         description: Restaurant not found
 */
router.get(
  "/restaurant/:id",
  authMiddleware,
  restaurantController.getRestaurant,
);

/**
 * @swagger
 * /menus:
 *   post:
 *     summary: Add menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               restaurantId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item created
 */
router.post("/menus", authMiddleware, menuController.addMenu);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemName
 *               - totalAmount
 *               - deliveryAddress
 *               - restaurantId
 *             properties:
 *               itemName:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               deliveryAddress:
 *                 type: string
 *               restaurantId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 */
router.post("/orders", authMiddleware, orderController.placeOrder);

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Get all orders by user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/orders/:userId", authMiddleware, orderController.getUserOrders);

/**
 * @swagger
 * /orders/{orderId}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLACED, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch(
  "/orders/:orderId/status",
  authMiddleware,
  orderController.updateStatus,
);

/**
 * @swagger
 * /rider/{riderId}/delivered:
 *   get:
 *     summary: Get delivered orders for rider
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider ID
 *     responses:
 *       200:
 *         description: Delivered orders fetched
 */
router.get(
  "/rider/:riderId/delivered",
  authMiddleware,
  orderController.getRiderDeliveredOrders,
);

module.exports = router;
