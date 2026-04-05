const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const couponController = require("./../controllers/coupon.controller");

/**
 * @swagger
 * tags:
 *   - name: Coupon
 *     description: Coupon management APIs
 */

/**
 * @swagger
 * /coupon:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - type
 *               - value
 *               - minOrderAmount
 *               - usageLimit
 *               - perUserLimit
 *               - startDate
 *               - endDate
 *             properties:
 *               code:
 *                 type: string
 *                 example: FLAT80
 *               type:
 *                 type: string
 *                 enum: [FLAT, PERCENTAGE]
 *                 example: FLAT
 *               value:
 *                 type: number
 *                 example: 100
 *               minOrderAmount:
 *                 type: number
 *                 example: 500
 *               usageLimit:
 *                 type: number
 *                 example: 50
 *               perUserLimit:
 *                 type: number
 *                 example: 2
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-01T00:00:00.000Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-30T23:59:59.000Z
 *     responses:
 *       200:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 15fd2a49-b7d9-4d8f-8597-08dd5684cd90
 *                     usedCount:
 *                       type: number
 *                       example: 0
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     code:
 *                       type: string
 *                       example: FLAT80
 *                     type:
 *                       type: string
 *                       example: FLAT
 *                     value:
 *                       type: number
 *                       example: 100
 *                     minOrderAmount:
 *                       type: number
 *                       example: 500
 *                     usageLimit:
 *                       type: number
 *                       example: 50
 *                     perUserLimit:
 *                       type: number
 *                       example: 2
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, couponController.addCoupon);

/**
 * @swagger
 * /coupon/active:
 *   get:
 *     summary: Get all active coupons
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Successfully fetched active coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 3
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 452cd860-2234-414f-b2d7-0dadba33a7a7
 *                           code:
 *                             type: string
 *                             example: SAVE30
 *                           type:
 *                             type: string
 *                             enum: [PERCENTAGE, FLAT]
 *                             example: PERCENTAGE
 *                           value:
 *                             type: number
 *                             example: 30
 *                           maxDiscount:
 *                             type: number
 *                             nullable: true
 *                             example: 100
 *                           minOrderAmount:
 *                             type: number
 *                             example: 300
 *                           usageLimit:
 *                             type: number
 *                             example: 100
 *                           usedCount:
 *                             type: number
 *                             example: 0
 *                           perUserLimit:
 *                             type: number
 *                             example: 1
 *                           isActive:
 *                             type: boolean
 *                             example: true
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-01T00:00:00.000Z
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-05-01T23:59:59.000Z
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-05T05:08:01.000Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-05T05:08:01.000Z
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/active", authMiddleware, couponController.getActiveCoupons);

module.exports = router;
