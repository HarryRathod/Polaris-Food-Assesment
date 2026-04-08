const authRouter = require("express").Router();
const controller = require("./../controllers/auth.controller");
const rateLimit = require("express-rate-limit");
const authMiddleware = require("./../middlewares/auth.middleware");

// Rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

authRouter.use(authLimiter);
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register user or rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ram3 Sharma
 *               email:
 *                 type: string
 *                 example: ram3@test.com
 *               password:
 *                 type: string
 *                 example: test@1234
 *               phone:
 *                 type: string
 *                 example: "9873543311"
 *               type:
 *                 type: string
 *                 enum: [user, rider]
 *                 example: user
 *     responses:
 *       201:
 *         description: Successfully registered
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
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
authRouter.post("/register", controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user or rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - type
 *             properties:
 *               email:
 *                 type: string
 *                 example: aman@test.com
 *               password:
 *                 type: string
 *                 example: test@1234
 *               type:
 *                 type: string
 *                 enum: [user, rider]
 *                 example: user
 *     responses:
 *       200:
 *         description: Login successful
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
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid credentials or bad request
 *       500:
 *         description: Server error
 */
authRouter.post("/login", controller.login);

authRouter.get("/me", authMiddleware, controller.aboutMe);

authRouter.post("/logout", controller.logout);

module.exports = authRouter;
