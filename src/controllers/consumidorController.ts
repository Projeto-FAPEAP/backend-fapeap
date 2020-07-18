/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
import Consumidor from '../models/Consumidor';

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
      numero_local,
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
      numero_local,
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

export const listarTodosConsumidores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const consumidorRepository = getRepository(Consumidor);
    const collectionsConsumidores = await consumidorRepository.find();
    collectionsConsumidores.forEach(consumidor => delete consumidor.senha);
    response.status(200).json(collectionsConsumidores);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const listarConsumidor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.params;
    const consumidorRepository = getRepository(Consumidor);

    const consumidor = await consumidorRepository.find({
      where: { id },
    });

    if (!consumidor) {
      throw new Error('Consumidor não encontrado!');
    }

    response.status(200).json(consumidor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const deletarConsumidor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.user;

    if (!id) {
      throw new Error('Usuário não autenticado!');
    }
    const consumidorRepository = getRepository(Consumidor);

    await consumidorRepository.delete(id);

    response.status(200).json({ deleted: 'sucess' });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
