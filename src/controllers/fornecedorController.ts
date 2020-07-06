import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Fornecedor from '../models/Fornecedor';

export const listarTodosFornecedores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const fornecedorRepository = getRepository(Fornecedor);
  const fornecedores = await fornecedorRepository.find();

  response.status(200).json(fornecedores);
  next();
};
