import 'express';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      empresaId: string;
      rol: string;
      permisos: string[];
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};