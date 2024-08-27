import swaggerJsdoc from "swagger-jsdoc";

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AuraPixel API DOCS",
      version: "1.0.0",
      description:
        "This is documentation of AuraPixels Backend APIs, a wallpaper application",
      termsOfService:
        "https://standardtouch.com/privacy-policy-for-standard-touch-apps",
      contact: {
        name: "Syed Yaseen",
        url: "https://standardtouch.com/contact-us/",
        email: "yaseen@standardtouch.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
      {
        url: "http://standardtouch.com:3000",
        description: "Production Server",
      },
    ],
  },
  apis: ["src/app.js", "src/routes/**/*.schema.js", "src/models/**/*schema.js"], // files containing annotations as above
};

const APISpecs = swaggerJsdoc(options);

export default APISpecs;
