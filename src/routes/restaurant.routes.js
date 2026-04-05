const router = require("express").Router();
const authMiddleware = require("./../middlewares/auth.middleware");
const restaurantController = require("./../controllers/restaurant.controller");
const menuController = require("./../controllers/menu.controller");

/**
 * @swagger
 * /restaurant:
 *   post:
 *     tags: [Restaurant]
 *     summary: Create a restaurant
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
 *               - address
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dal Bati Special
 *               address:
 *                 type: string
 *                 example: vasanth colony, Chennai
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 19.0843
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 65.2705
 *     responses:
 *       201:
 *         description: Restaurant created successfully
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
 *                       example: 41e2ee2e-18bb-46b3-9cd0-c8593e628a9f
 *                     isOpen:
 *                       type: boolean
 *                       example: true
 *                     name:
 *                       type: string
 *                       example: Ram4 Sharma
 *                     phone:
 *                       type: string
 *                       example: "9873553311"
 *                     address:
 *                       type: string
 *                       example: vasanth colony, Chennai
 *                     latitude:
 *                       type: number
 *                       example: 19.0843
 *                     longitude:
 *                       type: number
 *                       example: 65.2705
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-04-04T12:11:40.720Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-04-04T12:11:40.720Z
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, restaurantController.addRestaurant);

/**
 * @swagger
 * /restaurant:
 *   get:
 *     tags: [Restaurant]
 *     summary: Get nearby restaurants within 10km radius
 *     description: Fetch restaurants based on latitude and longitude with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         example: 13.0827
 *         description: Latitude of the user location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         example: 80.2707
 *         description: Longitude of the user location
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
 *         description: Successfully fetched nearby restaurants
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
 *                       example: 1
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     hasNext:
 *                       type: boolean
 *                       example: false
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 05a49c50-cba1-4892-a826-49508cd7d374
 *                           name:
 *                             type: string
 *                             example: Baba ka dhaba
 *                           phone:
 *                             type: string
 *                             example: "9875553311"
 *                           address:
 *                             type: string
 *                             example: vasanth colony, Chennai
 *                           latitude:
 *                             type: number
 *                             format: float
 *                             example: 21.0843
 *                           longitude:
 *                             type: number
 *                             format: float
 *                             example: 78.2705
 *                           isOpen:
 *                             type: integer
 *                             example: 1
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-05T04:51:01.000Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-05T04:51:01.000Z
 *                           distance:
 *                             type: number
 *                             format: float
 *                             example: 0.10322558626461412
 *       400:
 *         description: Missing or invalid query parameters
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, restaurantController.getRestaurantsNearMe);

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
  "/:restaurantId",
  authMiddleware,
  restaurantController.getRestaurant,
);

/**
 * @swagger
 * /restaurant/{restaurantId}/menu:
 *   get:
 *     tags: [Menu]
 *     summary: Get menu for a specific restaurant
 *     description: Fetch all menu items for a given restaurant ID with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         example: d9e3d00c-7e5b-470b-9af2-0bed5b297b6f
 *         description: Unique ID of the restaurant
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
 *         description: Successfully fetched restaurant menu
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
 *                             example: 31b5f928-9a95-4381-9ad0-af6573b8a9e9
 *                           name:
 *                             type: string
 *                             example: Roti Sabji
 *                           price:
 *                             type: number
 *                             example: 60
 *                           category:
 *                             type: string
 *                             enum: [veg, non-veg]
 *                             example: veg
 *                           isAvailable:
 *                             type: boolean
 *                             example: true
 *                           restaurantId:
 *                             type: string
 *                             example: 05a49c50-cba1-4892-a826-49508cd7d374
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-05T04:54:27.000Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-05T04:54:27.000Z
 *       400:
 *         description: Invalid restaurant ID
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Restaurant or menu not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:restaurantId/menu",
  authMiddleware,
  menuController.getRestaurantMenu,
);

/**
 * @swagger
 * /restaurant/{restaurantId}/menu:
 *   post:
 *     tags: [Menu]
 *     summary: Add menu item to a specific restaurant
 *     description: Create a new menu item under a given restaurant ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         example: 41e2ee2e-18bb-46b3-9cd0-c8593e628a9f
 *         description: Unique ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pav Bhaji
 *               price:
 *                 type: number
 *                 example: 70
 *               category:
 *                 type: string
 *                 enum: [veg, non-veg]
 *                 example: veg
 *     responses:
 *       201:
 *         description: Menu item created successfully
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
 *                       example: e8a3d114-3fce-4695-81ee-27c8a578c237
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     name:
 *                       type: string
 *                       example: Pav Bhaji
 *                     price:
 *                       type: number
 *                       example: 70
 *                     category:
 *                       type: string
 *                       example: veg
 *                     restaurantId:
 *                       type: string
 *                       example: 41e2ee2e-18bb-46b3-9cd0-c8593e628a9f
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-04-04T19:14:20.945Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-04-04T19:14:20.945Z
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
router.post("/:restaurantId/menu", authMiddleware, menuController.addMenu);

module.exports = router;
