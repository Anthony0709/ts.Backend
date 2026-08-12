import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export function configureSecurity(app: Express) {

  // Helmet
  app.use(helmet());

  // CORS
  app.use(cors({

    origin: process.env.FRONTEND_URL || 'http://localhost:4200',

    credentials: true

  }));

  // Rate Limit
  app.use(rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

      success: false,

      message: 'Demasiadas solicitudes. Intente nuevamente en unos minutos.'

    }

  }));

}