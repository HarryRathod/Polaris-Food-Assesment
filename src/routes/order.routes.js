const router = require("express").Router();
const authMiddleware = require("./../middlewares/auth.middleware");
const orderController = require("./../controllers/order.controller");

/**
 * @swagger
 * /order:
 *   post:
 *     tags: [Order]
 *     summary: Place an order with optional coupon and ETA calculation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - deliveryAddress
 *               - items
 *               - userLat
 *               - userLng
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *               deliveryAddress:
 *                 type: string
 *               couponCode:
 *                 type: string
 *                 example: FLAT80
 *               userLat:
 *                 type: number
 *                 format: float
 *                 example: 21.0743
 *               userLng:
 *                 type: number
 *                 format: float
 *                 example: 78.2805
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuId
 *                     - quantity
 *                   properties:
 *                     menuId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *           example:
 *             restaurantId: 05a49c50-cba1-4892-a826-49508cd7d374
 *             deliveryAddress: Anna Nagar, Chennai
 *             couponCode: FLAT80
 *             userLat: 21.0743
 *             userLng: 78.2805
 *             items:
 *               - menuId: 31b5f928-9a95-4381-9ad0-af6573b8a9e9
 *                 quantity: 10
 *               - menuId: 99ffb238-adcf-43f3-a05a-0b3c99f6d7cd
 *                 quantity: 2
 *     responses:
 *       201:
 *         description: Order placed successfully with estimated delivery time
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 29f20fea-3363-409e-a3fb-9e7034f2dde2
 *                 status: PLACED
 *                 paymentStatus: PENDING
 *                 userId: a1f3ff21-978d-4b3e-83c1-015ed35f02e1
 *                 restaurantId: 05a49c50-cba1-4892-a826-49508cd7d374
 *                 totalAmount: 600
 *                 itemName: Roti Sabji x10, Sev Bhaji x2
 *                 deliveryAddress: Anna Nagar, Chennai
 *                 estimatedDeliveryTime: 32
 *                 eta: 27-37 mins
 *                 createdAt: 2026-04-05T05:26:41.020Z
 *                 updatedAt: 2026-04-05T05:26:41.020Z
 *                 originalAmount: 700
 *                 discount: 100
 *                 finalAmount: 600
 *                 couponApplied:
 *                   code: FLAT80
 *                   discount: 100
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, orderController.placeOrder);

/**
 * @swagger
 * /order:
 *   get:
 *     tags: [Order]
 *     summary: Get orders for logged-in user or rider
 *     description: |
 *       Fetch orders based on JWT token type:
 *       - If type = **user** → returns orders placed by the user
 *       - If type = **rider** → returns orders delivered by the rider
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully (User or Rider)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Response for USER
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     count:
 *                       type: integer
 *                       example: 2
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           itemName:
 *                             type: string
 *                             example: Dal Rice, Dal Makhani
 *                           status:
 *                             type: string
 *                             example: PLACED
 *                           totalAmount:
 *                             type: number
 *                             example: 130
 *                           paymentStatus:
 *                             type: string
 *                             example: PENDING
 *                           deliveryAddress:
 *                             type: string
 *                           userId:
 *                             type: string
 *                           restaurantId:
 *                             type: string
 *                           riderId:
 *                             type: string
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           restaurant:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               phone:
 *                                 type: string
 *                               address:
 *                                 type: string
 *                           rider:
 *                             type: object
 *                             nullable: true
 *               example:
 *                 success: true
 *                 count: 2
 *                 data:
 *                   - id: 3221b16e-81e7-4a20-bf2e-01cd514c0e15
 *                     itemName: Dal Rice, Dal Makhani
 *                     status: PLACED
 *                     totalAmount: 130
 *                     paymentStatus: PENDING
 *                     deliveryAddress: Chennai6
 *                     userId: b8f359de-3acc-4d2b-80f3-200683e2bcac
 *                     restaurantId: 41e2ee2e-18bb-46b3-9cd0-c8593e628a9f
 *                     riderId: null
 *                     createdAt: 2026-04-04T17:30:45.000Z
 *                     updatedAt: 2026-04-04T17:30:45.000Z
 *                     restaurant:
 *                       id: 41e2ee2e-18bb-46b3-9cd0-c8593e628a9f
 *                       name: Ram4 Sharma
 *                       phone: "9873553311"
 *                       address: vasanth colony, Chennai
 *                     rider: null
 *
 *                 # Rider Example Response
 *                 riderExample:
 *                   success: true
 *                   count: 2
 *                   data:
 *                     - id: 9a24d6c1-9f69-4b5f-909b-6c1fb0adcd05
 *                       itemName: Dal Ba
 *                       status: DELIVERED
 *                       totalAmount: 250
 *                       paymentStatus: PENDING
 *                       deliveryAddress: Chennai6
 *                       userId: b8f359de-3acc-4d2b-80f3-200683e2bcac
 *                       restaurantId: 41e2ee2e-18bb-46b3-9cd0-c8593e628a9f
 *                       riderId: 5a2a64d5-c001-46ad-bc09-0681b68fee67
 *                       createdAt: 2026-04-04T14:27:04.000Z
 *                       updatedAt: 2026-04-04T14:27:04.000Z
 *                       user:
 *                         id: b8f359de-3acc-4d2b-80f3-200683e2bcac
 *                         name: Ram5 Sharma
 *                         phone: "9875553311"
 *                       restaurant:
 *                         id: 41e2ee2e-18bb-46b3-9cd0-c8593e628a9f
 *                         name: Ram4 Sharma
 *                         address: vasanth colony, Chennai
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, orderController.getOrders);

/**
 * @swagger
 * /order/{orderId}/status:
 *   patch:
 *     tags: [Order]
 *     summary: Update order status
 *     description: Update the status of an order (used by rider/admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: 3221b16e-81e7-4a20-bf2e-01cd514c0e15
 *         description: Unique ID of the order
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
 *                 enum:
 *                   - PLACED
 *                   - ACCEPTED
 *                   - PREPARING
 *                   - OUT_FOR_DELIVERY
 *                   - DELIVERED
 *                   - CANCELLED
 *                 example: DELIVERED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order updated
 *       400:
 *         description: Invalid status or request
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:orderId/status", authMiddleware, orderController.updateStatus);

module.exports = router;
