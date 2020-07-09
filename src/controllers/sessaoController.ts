import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import Consumidor from '../models/Consumidor';
import Fornecedor from '../models/Fornecedor';

export const autenticaConsumidor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, senha } = request.body;
    const consumidorRepository = getRepository(Consumidor);
    const consumidor = await consumidorRepository.findOne({
      where: { email },
    });

    if (!consumidor) {
      throw new Error('Email ou senha incorretos!');
    }

    const senhaEncontrada = await compare(senha, consumidor.senha);

    if (!senhaEncontrada) {
      throw new Error('Email ou senha incorretos!');
    }
    delete consumidor.senha;
    response.json(consumidor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const autenticaFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, senha } = request.body;
    const fornecedorRepository = getRepository(Fornecedor);
    const fornecedor = await fornecedorRepository.findOne({
      where: { email },
    });

    if (!fornecedor) {
      throw new Error('Email ou senha incorretos!');
    }

    const senhaEncontrada = await compare(senha, fornecedor.senha);

    if (!senhaEncontrada) {
      throw new Error('Email ou senha incorretos!');
    }
    delete fornecedor.senha;
    response.json(fornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
