import express from 'express';
//import cors from 'cors';
//import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { configureSecurity } from './config/security';

const app = express();
configureSecurity(app);
//app.use(cors());
//app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use('/api/v1', routes);

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EnterpriseFlow ERP API funcionando 🚀',
    version: '1.0.0'
  });
});

// 👇 Siempre al final
app.use(errorHandler);

export default app;