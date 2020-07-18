/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
import { uuid } from 'uuidv4';
import Fornecedor from '../models/Fornecedor';
import ArquivoFornecedor from '../models/ArquivoFornecedor';

export const listarTodosFornecedores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const fornecedorRepository = getRepository(Fornecedor);
    const collectionsFornecedores = await fornecedorRepository.find();
    collectionsFornecedores.forEach(fornecedor => delete fornecedor.senha);
    response.status(200).json(collectionsFornecedores);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
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

    console.log(request.body, 'hh');

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
      // const { originalname, size } = elementoImagem;

      const imagem = arquivoRepository.create({
        id: uuid(),
        nome_original: 'originalname.jpg',
        size: 10000,
        url: '',
        fornecedor_id: fornecedor.id,
      });

      await arquivoRepository.save(imagem);
    });

    request.body.video.forEach(async (elementoVideo: arquivoMulter) => {
      // const { originalname, size } = elementoVideo;

      const video = arquivoRepository.create({
        id: uuid(),
        nome_original: 'originalname.mp4',
        size: 10000,
        url: '',
        fornecedor_id: fornecedor.id,
      });

      await arquivoRepository.save(video);
    });

    const { filename: id, originalname: nome_original, size } = request.file;

    const arquivoFile = arquivoRepository.create({
      id,
      nome_original,
      size,
      url: '',
      fornecedor_id: fornecedor.id,
    });

    await arquivoRepository.save(arquivoFile);

    delete fornecedor.senha;
    response.status(201).json(fornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const listarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.params;
    const fornecedorRepository = getRepository(Fornecedor);

    const fornecedor = await fornecedorRepository.find({
      where: { id },
    });

    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado!');
    }

    response.status(200).json(fornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const deletarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.user;

    if (!id) {
      throw new Error('Usuário não autenticado!');
    }

    const fornecedorRepository = getRepository(Fornecedor);

    await fornecedorRepository.delete(id);

    response.status(200).json({ deleted: 'sucess' });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
