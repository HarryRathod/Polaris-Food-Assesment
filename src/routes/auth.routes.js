const authRouter = require("express").Router();
const controller = require("./../controllers/auth.controller");
const rateLimit = require("express-rate-limit");

// Rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

authRouter.use(authLimiter);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register user
 */
authRouter.post("/register", controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 */
authRouter.post("/login", controller.login);

module.exports = authRouter;
