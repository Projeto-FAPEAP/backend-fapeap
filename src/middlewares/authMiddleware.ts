import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import jwtConfig from '../config/auth';

export function authMiddlewareConsumidor(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new Error('JWT não está presente!');
    }
    // Barer-token
    const [, token] = authHeader.split(' ');
    const { jwt_consumidor } = jwtConfig;
    const decoded = verify(token, jwt_consumidor.secret);
    console.log(decoded);
    // throw new Error('JWT inválido!');
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  return next();
}
