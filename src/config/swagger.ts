import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {

  definition: {

    openapi: '3.0.0',

    info: {

      title: 'EnterpriseFlow ERP API',

      version: '1.0.0',

      description: 'API REST del ERP EnterpriseFlow'

    },

    servers: [

      {

        url: 'http://localhost:3000/api/v1',

        description: 'Servidor de Desarrollo'

      }

    ],

    components: {

      securitySchemes: {

        bearerAuth: {

          type: 'http',

          scheme: 'bearer',

          bearerFormat: 'JWT'

        }

      }

    },

    security: [

      {

        bearerAuth: []

      }

    ]

  },

  apis: [

    './src/modules/**/*.ts',

    './src/routes/*.ts'

  ]

};

export const swaggerSpec = swaggerJsdoc(options);