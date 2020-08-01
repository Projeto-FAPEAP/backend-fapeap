/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
import { validate } from 'class-validator';
import Fornecedor from '../models/Fornecedor';
import ArquivoFornecedor from '../models/ArquivoFornecedor';

export const listarTodosFornecedores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Carregar url dos arquivos dos fornecedores
    const fornecedorRepository = getRepository(Fornecedor);
    const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);
    const collectionsFornecedores = await fornecedorRepository.find({
      where: { verificado: true },
    });
    collectionsFornecedores.forEach(fornecedor => delete fornecedor.senha);

    response.status(200).json(collectionsFornecedores);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

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

// Remember - Não esquecer de remover o campo verificado na criacao do fornecedor
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
      verificado: true,
    });

    const errors = await validate(fornecedorDTO);

    if (errors.length > 0) {
      response
        .status(400)
        .json({ error: 'Alguns campos são inválidos', errors });
    }

    const fornecedor = await fornecedorRepository.save(fornecedorDTO);

    const arquivoRepository = getRepository(ArquivoFornecedor);
    request.files.forEach(async elementoFile => {
      const { filename: id, originalname: nome_original, size } = elementoFile;

      const fileElement = arquivoRepository.create({
        id,
        nome_original,
        size,
        url: '',
        fornecedor_id: fornecedor.id,
      });

      await arquivoRepository.save(fileElement);
    });

    /* request.files.video.forEach(async elementoVideo => {
      const { filename: id, originalname: nome_original, size } = elementoVideo;

      const video = arquivoRepository.create({
        id,
        nome_original,
        size,
        url: '',
        fornecedor_id: fornecedor.id,
      });

      await arquivoRepository.save(video);
    }); */

    if (request.files.length === 0) {
      const { id } = fornecedor;
      await fornecedorRepository.delete({ id });
      throw new Error('Você não preencheu os campos de arquivos corretamente!');
    }

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
    // Carregar url dos arquivos do fornecedor
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
    if (error.message === 'Fornecedor não encontrado!') {
      response.status(404).json({ error: error.message });
    } else {
      response.status(400).json({ error: error.message });
    }
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

export const atualizarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.params;

    if (!id) {
      throw new Error('ID do fornecedor não informado!');
    }

    const fornecedorRepository = getRepository(Fornecedor);

    const fornecedor = await fornecedorRepository.findOne(id);

    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado!');
    }

    fornecedorRepository.merge(fornecedor, request.body);

    const resultados = await fornecedorRepository.save(fornecedor);

    response.status(200).json(resultados);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
