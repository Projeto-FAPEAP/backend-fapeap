import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
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
    const {
      nome,
      cpf,
      email,
      senha,
      telefone_whatsapp,
      logradouro,
      numero_casa,
      bairro,
      cep,
    } = request.body;

    const checkEmailExists = await consumidorRepository.findOne({
      where: { email },
    });

    const checkCpfExists = await consumidorRepository.findOne({
      where: { cpf },
    });

    if (checkEmailExists) {
      throw new Error('Email já existe!');
    }

    if (checkCpfExists) {
      throw new Error('CPF já existe!');
    }

    const hashedSenha = await hash(senha, 8);

    const consumidorDTO = consumidorRepository.create({
      nome,
      cpf,
      email,
      senha: hashedSenha,
      telefone_whatsapp,
      logradouro,
      numero_casa,
      bairro,
      cep,
    });
    const consumidor = await consumidorRepository.save(consumidorDTO);
    delete consumidor.senha;
    response.status(201).json(consumidor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
