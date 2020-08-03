/* eslint-disable no-param-reassign */

import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Fornecedor from '../models/Fornecedor';

export const listarForneceodresNaoVerificados = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Carregar url dos arquivos dos fornecedores
    const fornecedorRepository = getRepository(Fornecedor);
    const collectionsFornecedores = await fornecedorRepository.find({
      where: { verificado: false },
    });
    collectionsFornecedores.forEach(fornecedor => delete fornecedor.senha);

    response.status(200).json(collectionsFornecedores);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
