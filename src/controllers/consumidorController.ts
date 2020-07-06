import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Consumidor from '../models/Consumidor';

export const listarTodosConsumidores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const consumidorRepository = getRepository(Consumidor);
  const consumidores = await consumidorRepository.find();

  response.status(200).json(consumidores);
  next();
};

export const cadastrarConsumidor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const consumidorRepository = getRepository(Consumidor);
    const consumidorDTO = consumidorRepository.create(request.body);
    const consumidor = await consumidorRepository.save(consumidorDTO);
    response.status(201).json(consumidor);
  } catch (error) {
    console.log(error.message);
  }
  next();
};
