const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Delivery API",
      version: "1.0.0",
      description: "API documentation for Food Delivery App",
    },
    servers: [
      {
        url: `http://127.0.0.1:${process.env.PORT || 8081}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Order", description: "Order APIs" },
    ],
  },
  apis: [__dirname + "/../routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  if (process.env.NODE_ENV !== "production") {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
  }
};
