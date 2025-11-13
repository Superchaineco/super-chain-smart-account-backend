// swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.1.0",
        info: { title: "Eco Accounts API", version: "1.0.0" },
        servers: [{ url: "https://prosperity-passport-backend-production.up.railway.app/api" }],
        security: [{ ApiKeyAuth: [] }],
    },
    apis: ["./src/controllers/**/*.ts"], // <-- ruta a tus controladores
});
