const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Expenses API',
        description: 'API do zarządzania wydatkami użytkowników.',
    },
    host: 'localhost:5000',
    basePath: '/expenses',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/expenses.js'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    console.log('Swagger documentation generated successfully.');
    require('./app');
});
