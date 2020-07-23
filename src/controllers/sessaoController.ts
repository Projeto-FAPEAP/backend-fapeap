import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import Consumidor from '../models/Consumidor';
import Fornecedor from '../models/Fornecedor';
import jwtConfig from '../config/auth';

export const autenticarConsumidor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cpf, senha } = request.body;
    const consumidorRepository = getRepository(Consumidor);
    const consumidor = await consumidorRepository.findOne({
      where: { cpf },
    });

    if (!consumidor) {
      throw new Error('CPF ou senha incorretos!');
    }

    const senhaEncontrada = await compare(senha, consumidor.senha);

    if (!senhaEncontrada) {
      throw new Error('CPF ou senha incorretos!');
    }

    const { jwt_consumidor } = jwtConfig;

    const tokenConsumidor = sign({}, jwt_consumidor.secret, {
      subject: consumidor.id,
      expiresIn: jwt_consumidor.expiresIn,
    });

    delete consumidor.senha;

    const consumidorDTO = { consumidor, tokenConsumidor };

    response.json(consumidorDTO);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const autenticarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cpf_cnpj, senha } = request.body;
    const fornecedorRepository = getRepository(Fornecedor);
    const fornecedor = await fornecedorRepository.findOne({
      where: { cpf_cnpj },
    });

    if (!fornecedor) {
      throw new Error('Cpf ou senha incorretos!');
    }

    const senhaEncontrada = await compare(senha, fornecedor.senha);

    if (!senhaEncontrada) {
      throw new Error('Cpf ou senha incorretos!');
    }

    if (!fornecedor.verificado) {
      throw new Error('Estamos analisando o seu cadastro!');
    }

    const { jwt_fornecedor } = jwtConfig;

    const tokenFornecedor = sign({}, jwt_fornecedor.secret, {
      subject: fornecedor.id,
      expiresIn: jwt_fornecedor.expiresIn,
    });

    delete fornecedor.senha;
    const fornecedorDTO = { fornecedor, tokenFornecedor };
    response.json(fornecedorDTO);
  } catch (error) {
    if (error.message === 'Estamos analisando o seu cadastro!') {
      response.status(403).json({ message: error.message });
    } else {
      response.status(400).json({ error: error.message });
    }
  }
  next();
};
