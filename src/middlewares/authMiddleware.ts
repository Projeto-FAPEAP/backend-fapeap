import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import jwtConfig from '../config/auth';

type TokenPayload = { iat: number; exp: number; sub: string };

class AuthMiddleware {
  async consumidor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new Error('JWT não está presente!');
      }
      // Barer-token
      const [, token] = authHeader.split(' ');
      const { jwt_consumidor } = jwtConfig;
      const decoded = verify(token, jwt_consumidor.secret);
      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub,
      };

      // throw new Error('JWT inválido!');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    return next();
  }

  async fornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new Error('JWT não está presente!');
      }
      // Barer-token
      const [, token] = authHeader.split(' ');
      const { jwt_fornecedor } = jwtConfig;
      const decoded = verify(token, jwt_fornecedor.secret);
      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub,
      };

      // throw new Error('JWT inválido!');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    return next();
  }

  async admin(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new Error('JWT não está presente!');
      }
      // Barer-token
      const [, token] = authHeader.split(' ');
      const { jwt_admin } = jwtConfig;
      const decoded = verify(token, jwt_admin.secret);
      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub,
      };
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    return next();
  }
}

export default new AuthMiddleware();
