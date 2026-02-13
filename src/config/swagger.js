const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lucky Spin API',
            version: '1.0.0',
            description: 'API documentation for the Lucky Spin Backend service',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'], // Đường dẫn tới các file định nghĩa API
};

const specs = swaggerJsdoc(options);
module.exports = specs;
