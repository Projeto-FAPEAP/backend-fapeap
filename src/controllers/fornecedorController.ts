/* eslint-disable prettier/prettier */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
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

export const cadastrarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const fornecedorRepository = getRepository(Fornecedor);
    const {
      nome_fornecedor,
      nome_fantasia,
      cpf_cnpj,
      email,
      senha,
      telefone,
      telefone_whatsapp,
      taxa_delivery,
      logradouro,
      numero_fornecedor,
      bairro,
      cep,
    } = request.body;

    const checkEmailExists = await fornecedorRepository.findOne({
      where: { email },
    });

    const checkCpfExists = await fornecedorRepository.findOne({
      where: { cpf_cnpj },
    });

    if (checkEmailExists) {
      throw new Error('Email já existe!');
    }

    if (checkCpfExists) {
      throw new Error('CPF/CNPJ já existe!');
    }

    const hashedSenha = await hash(senha, 8);

    const fornecedorDTO = fornecedorRepository.create({
      nome_fornecedor,
      nome_fantasia,
      cpf_cnpj,
      email,
      senha: hashedSenha,
      telefone,
      telefone_whatsapp,
      taxa_delivery,
      logradouro,
      numero_fornecedor,
      bairro,
      cep,
    });
    const fornecedor = await fornecedorRepository.save(fornecedorDTO);
    delete fornecedor.senha;
    response.status(201).json(fornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
