import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Consumidor from '../models/Consumidor';

const consumidorRepository = getRepository(Consumidor);

export const listarTodosConsumidores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const consumidores = await consumidorRepository.find();

  response.status(200).json(consumidores);
  next();
};
