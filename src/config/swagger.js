const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Multivendor Ecommerce API",
      version: "1.0.0",
      description: "API for large scale multivendor ecommerce (MERN STACK)",
      contact: {
        name: "Nabil Islam Hamza",
        email: "nabilislam.dev@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server ",
      },
      {
        url: `https://daraz.com`,
        description: "domain server ",
      },
    ],
    components: {
      securityShemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};
const specification = swaggerJsdoc(options);
module.exports = specification;
