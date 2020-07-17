/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
import Fornecedor from '../models/Fornecedor';
import ArquivoFornecedor from '../models/ArquivoFornecedor';

import { uuid } from 'uuidv4';

export const listarTodosFornecedores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const fornecedorRepository = getRepository(Fornecedor);
  const collectionsFornecedores = await fornecedorRepository.find();
  collectionsFornecedores.forEach(fornecedor => delete fornecedor.senha);
  response.status(200).json(collectionsFornecedores);
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
      nome,
      nome_fantasia,
      cpf_cnpj,
      email,
      senha,
      telefone,
      telefone_whatsapp,
      taxa_delivery,
      logradouro,
      numero_local,
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
      nome,
      nome_fantasia,
      cpf_cnpj,
      email,
      senha: hashedSenha,
      telefone,
      telefone_whatsapp,
      taxa_delivery,
      logradouro,
      numero_local,
      bairro,
      cep,
    });
    const fornecedor = await fornecedorRepository.save(fornecedorDTO);

    const arquivoRepository = getRepository(ArquivoFornecedor);
    type arquivoMulter = {
      filename: string;
      originalname: string;
      size: number;
    };

    request.body.imagens.forEach(async (elementoImagem: arquivoMulter) => {
      const {originalname,size} = elementoImagem;

      const imagem = arquivoRepository.create({
        id: uuid(),
        nome_original: "originalname.jpg",
        size: 10000,
        url: '',
        fornecedor_id: fornecedor.id,
      });

      await arquivoRepository.save(imagem);
    });

    request.body.video.forEach(async (elementoVideo: arquivoMulter) => {
      const { originalname, size } = elementoVideo;

      const video = arquivoRepository.create({
        id: uuid(),
        nome_original: "originalname.mp4",
        size: 10000,
        url: '',
        fornecedor_id: fornecedor.id,
      });

      await arquivoRepository.save(video);
    });

    delete fornecedor.senha;
    response.status(201).json(fornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
